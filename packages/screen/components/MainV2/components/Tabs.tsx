/* eslint-disable multiline-ternary */
import { Icon } from '@wallet/ui'
import { cx } from '@wallet/utils'
import useManageToken from '../../../hooks/useManageToken'
import get from 'lodash/get'
// eslint-disable-next-line no-use-before-define
import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { onDisplayTokens, useAppDispatch, useAppSelector } from 'store'
import { isEmpty } from 'lodash'

type Tab = {
  name: string
  content: React.ReactNode
}

interface IProps {
  tabs: Tab[]
  suffix?: React.ReactNode
  className?: string
}

const Tabs = ({ tabs, suffix, className }: IProps) => {
  const history = useHistory()
  const dispatch = useAppDispatch()
  const { tokens } = useManageToken()

  const [activeTypeDisplay] = useAppSelector((state) => [
    state.wallet.activeTypeDisplay
  ])

  const typeTab = tabs.find(
    (it) => it.name === get(activeTypeDisplay, 'typeToken', 'Tokens')
  )

  const [tabActive, setTabActive] = useState(typeTab)
  const [showAllNFTs, setShowAllNFTs] = useState(activeTypeDisplay?.typeDisplay)

  useEffect(() => {
    dispatch(onDisplayTokens({
      typeToken: tabActive?.name || 'Tokens',
      typeDisplay: showAllNFTs
    }))
  }, [tabActive, showAllNFTs])

  const onClickSuffixType = (type?:string) => () => {
    if (type === 'Tokens') {
      history.push('/manage-token')
    } else {
      setShowAllNFTs(!showAllNFTs)
    }
    dispatch(
      onDisplayTokens({
        typeToken: tabActive!.name,
        typeDisplay: !activeTypeDisplay!.typeDisplay
      })
    )
  }

  const renderTabActionType = () => {
    if (tabActive?.name === 'Tokens') {
      return (
        <div
          onClick={onClickSuffixType(tabActive?.name)}
          className="hover:opacity-50 cursor-pointer">
          <Icon name="custom" className="text-h2 text-ui04" />
        </div>
      )
    }
    return (
      <div
        onClick={onClickSuffixType(tabActive?.name)}
        className="hover:opacity-50 cursor-pointer">
        {showAllNFTs ? (
          <Icon name="view_grid" className="text-h2 text-ui04" />
        ) : (
          <Icon name="view_list" className="text-h2 text-ui04" />
        )}
      </div>
    )
  }

  const onChangeTabActive = (tab: Tab) => () => {
    dispatch(onDisplayTokens({ typeToken: tab.name, typeDisplay: true }))
    setTabActive(tab)
  }

  return (
    <div className={className}>
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex flex-1 items-center gap-4 text-[18px] leading-6">
          {tabs.map((tab) => (
            <div
              key={tab.name}
              className={cx(
                'transition pb-1 cursor-pointer all-center text-h5 uppercase',
                {
                  'text-ui02': tabActive?.name !== tab.name,
                  'text-bg-mid border-b-2 border-ui04':
                    tabActive?.name === tab.name
                }
              )}
              onClick={onChangeTabActive(tab)}>
              {tab.name}
            </div>
          ))}
        </div>
        <div>{renderTabActionType()}</div>
        {suffix}
      </div>

      <div className={cx('overflow-auto flex main-content-v2', {
        'items-center': (isEmpty(tokens) && tabActive!.name === 'Tokens')
      })}>
        {tabActive?.content}
      </div>
    </div>
  )
}

export default Tabs
