/* eslint-disable multiline-ternary */
import { Button, Icon, Image, Touch } from '@wallet/ui'
import {
  convertWeiToBalance,
  cx,
  formatNumberBro,
  truncate
} from '@wallet/utils'
import get from 'lodash/get'
// eslint-disable-next-line no-use-before-define
import React, { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
// import ListToken, {
//   type TypeListToken
// } from '~pages/Token/components/ListToken'

import HideBalance from '../components/HideBalance'
import TabNFT from '../components/TabNFT'
import TabToken from '../components/TabToken'
import Tabs from '../components/Tabs'
// import useScrollAnimation from '../../../hooks/useScrollAnimation'
import { Wallet } from '@wallet/core'
import ListToken, { TypeListToken } from '../../shared/ListToken'
import { useMainContext } from '../context'
import {
  onChangeLockState,
  onToggleBalance,
  useAppDispatch,
  useAppSelector
} from 'store'
import useViewport from '../../../hooks/useViewport'
import useClipboard from '../../../hooks/useClipboard'
import useEffectCustom from '../../../hooks/useEffectCustom'
import useManageToken from '../../../hooks/useManageToken'
import useScrollAnimation from '../../../hooks/useScrollAnimation'
import { useTranslation } from 'react-i18next'
import NetworkScreenInner from '../../../components/Others/NetworkScreen/components/NetworkScreenInner'
import useRefreshTimer from '../../../hooks/useRefreshTimer'
import { COIN_IMAGE } from 'store/constants'

// interface LocationState {
//   isReload?: boolean
// }

const WrapMain = () => {
  const history = useHistory()
  const dispatch = useAppDispatch()
  const { isExpand } = useViewport()

  const { t } = useTranslation()

  const { reloadBalance } : any = useMainContext()

  const { tokens } = useManageToken()
  const { onCopyWithTitle } = useClipboard({ t })
  const [activeWallet, coinLocal, activeNetwork, showBalance] = useAppSelector(
    (state) => {
      return [
        state.wallet.activeWallet,
        state.info.coinLocal,
        state.setting.activeNetwork,
        state.setting.showBalance
      ]
    }
  )

  const tokensLocal = coinLocal[activeNetwork?.chain]

  const { onMouseMove } = useScrollAnimation(tokens)

  const tabs = [
    {
      name: t('Tokens'),
      content: <TabToken />
    },
    {
      name: t('NFTs'),
      content: <TabNFT />
    }
  ]

  const totalBalance = tokens?.reduce((result: number, item: any) => {
    const balance = convertWeiToBalance(item.rawBalance || '0', item.decimal)
    const price = get(item, 'prices.price', 0)
    const total = price * Number(balance)
    result += total
    return result
  }, 0)

  const onOpenModalTokens = (type: TypeListToken) => () => {
    const renderTitle = type === 'send' ? 'Send Token' : 'Receive'

    const tokenArray = type === 'send' ? tokens : tokensLocal
    window.openModal({
      type: 'none',
      title: t(renderTitle),
      content: (
        <>
          {type === 'send' ? (
            <ListToken
              type={type}
              isHidePrice={false}
              classNameItem="rounded-full"
              t={t}
              listTokens={tokens}
              activeWallet={activeWallet as Wallet}
              showBalance={true}
            />
          ) : (
            <ListToken
              type={type}
              listTokens={tokenArray}
              classNameItem="rounded-full"
              isHidePrice={false}
              t={t}
              activeWallet={activeWallet as Wallet}
              showBalance={true}
            />
          )}
        </>
      ),
      contentType: 'other',
      closable: true
    })
  }

  const openSelectNetwork = () => {
    window.openModal({
      type: 'none',
      title: t('main_screen.network'),
      content: (
        <div className={'w-full h-full overflow-auto mt-20'}>
          <NetworkScreenInner onClose={() => window.closeModal()} />
        </div>
      ),
      contentType: 'other',
      closable: true
    })
  }

  const onLockExtension = () => {
    dispatch(onChangeLockState(true))
    history.push('/main/password')
  }

  const onRouting = (path: string) => () => {
    return history.push(path)
  }

  const onToggleShowBalance = () => {
    dispatch(onToggleBalance())
  }

  const onCopyAddress = (e: React.MouseEvent) => {
    e.stopPropagation()
    onCopyWithTitle(
      get(activeWallet, 'address', ''),
      t('main_screen.address')
    )()
  }

  const renderWalletBalance = () => {
    return (
      <>
        <div className="text-ui04">
          {showBalance ? (
            `$${formatNumberBro(totalBalance || '0', 1)}`
          ) : (
            <HideBalance
              amountDot={8}
              typeSize="medium"
              typeBackground="bold"
            />
          )}
        </div>
      </>
    )
  }

  // Filter email from wallet name
  const walletName = get(activeWallet, 'name', '')

  const address = get(activeWallet, 'address', '')
  const walletAvatar = get(activeWallet, 'avatar', '')

  return (
    <div className="flex flex-col h-full overflow-auto">
      <div className="mainScreen bg-bg-brand">
        <div className="flex min-h-[56px] justify-between w-full px-5 items-center py-5 border-ui01">
          <div
            className="flex items-center cursor-pointer"
            onClick={onRouting('/main/wallet')}>
            <div
              className={cx(
                `w-6 h-6 text-ui00 text-[24px] all-center mr-2 ${walletAvatar}`
              )}></div>
            <div>
              <div
                className={`text-h5 truncate mr-3 text-bg-mid ${
                  isExpand ? 'max-w-[160px]' : 'max-w-[120px]'
                }`}>
                {walletName}
              </div>

              <div className="text-tx-secondary text-body-14-regular flex items-center gap-[2px]">
                {truncate(address)}
                <Touch
                  onClick={onCopyAddress}
                  style={{ width: 20, height: 20 }}>
                  <Icon name="copy" />
                </Touch>
              </div>
            </div>
            <Icon name="chevron_down"
              className="text-h3 text-ui04"/>
          </div>

          <div
            className="flex items-center gap-1 cursor-pointer py-[10px] hover:brightness-90 hover:drop-shadow-sm transition-all duration-300"
            onClick={openSelectNetwork}>
            <Image src={COIN_IMAGE.TOMO} className="w-4 h-4" />
            <div className="flex items-center truncate text-tiny leading-[16px] text-ui04">
              {get(activeNetwork, 'name', '').substring(0, 12)}
            </div>
            <Icon
              name="chevron_down"
              className="text-h3 text-ui04"
            />
          </div>
        </div>

        <div className="px-5 py-0" onMouseMove={onMouseMove}>
          <div
            className="balance flex items-center h-[64px] transition-all duration-300"
            id="balance">
            <div
              className="flex items-center text-h1 transition-all duration-300"
              id="number">
              {renderWalletBalance()}
            </div>

            <div
              className="text-h3 mx-3 mt-[6px] font-bold cursor-pointer hover:opacity-50 active:opacity-30"
              onClick={onToggleShowBalance}>
              <Icon
                name={showBalance ? 'eye_on' : 'eye_off'}
                className="text-ui04"
              />
            </div>

            <div
              className="ml-auto cursor-pointer hover:opacity-50 transition-all"
              onClick={onLockExtension}>
              <Icon name="lock_off" className="text-h2 text-ui04" />
            </div>
          </div>

          <div
            className="btn-action flex justify-between mb-3 mt-3 text-tiny gap-[2px] transition-all duration-300"
            id="btn-action">
            <Button
              type="primary"
              className="flex-1 px-0 w-full max-h-10 bg-primary transition-all duration-100"
              outline
              onClick={onOpenModalTokens('send')}
              id="send">
              <div className="text-h6 flex items-center text-ui00">
              {t('send_nft_success.send')}
                <Icon
                  className="text-h3 text-ui00 ml-1"
                  name={t('setting_screen.arrow_up')}
                />{' '}

              </div>
            </Button>

            <Button
              type="primary"
              className="flex-1 px-0 w-full max-h-10 bg-primary transition-all duration-100"
              outline
              onClick={onOpenModalTokens('receive')}
              id="receive">
              <div className="text-h6 flex items-center text-ui00">
                {t('history_item.receive')}
                <Icon
                  className="text-h3 text-ui00 ml-1"
                  name={t('setting_screen.arrow_down')}
                />{' '}
              </div>
            </Button>

            <Button
              type="primary"
              className="flex-1 px-0 w-full max-h-10 bg-primary transition-all duration-100"
              outline
              onClick={() => history.push('/main/historyTest')}
              id="history">
              <div className="text-h6 flex items-center text-ui00">
                {t('main_screen.history')}
                <Icon className="text-h3 text-ui00 ml-1" name={'history'} />
              </div>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 h-full overflow-hidden bg-bg-brand-main">
        <Tabs className="h-full" tabs={tabs} />
      </div>
    </div>
  )
}

export default WrapMain
