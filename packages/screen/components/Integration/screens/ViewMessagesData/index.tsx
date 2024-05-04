import { ListItem } from '@wallet/ui'
import { cx } from '@wallet/utils'
import React, { type ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'

import ClosableContent from '../../../shared/ClosableContent'
import withI18nProvider from '../../../../provider'

const MessagesTab = () => {
  const { t } = useTranslation()
  const onSelectMessage = () => {}
  return (
    <div className="w-full">
      <ListItem
        title={t('setting_screen.message_1')}
        description="cosmwasm.wasm.v1.MsgExecuteContract"
        showArrow
        onClick={onSelectMessage}
      />
    </div>
  )
}

const DataTab = () => {
  const messages = JSON.stringify(
    {
      delegatorAddress: 'auralweutkp51w4eqjnwyr02a42gnd2znacalc2ggus',
      validatorAddress: 'auravaloper1z8qlzq3ag2mzccg4xr2n805swr5 rl3ugdh3euf'
    },
    null,
    4
  )
  return (
    <div className="w-full">
      <ClosableContent data={messages} />
    </div>
  )
}

interface TabState {
  name: string
  content: ReactElement
}

const ViewMessagesData = () => {
  const { t } = useTranslation()
  const tabs: TabState[] = [
    {
      name: t('confirmation.messages'),
      content: <MessagesTab />
    },
    {
      name: t('confirmation.data'),
      content: <DataTab />
    }
  ]

  const [tabActive, setTabActive] = useState<TabState>(tabs[0])

  const onChangeTabActive = (tab: TabState) => {
    setTabActive(tab)
  }

  return (
    <div className="h-full w-full mt-20 overflow-auto">
      <div className="px-5 mb-6 flex items-center justify-between">
        <div className="flex flex-1 items-center gap-4 text-[18px] leading-6">
          {tabs.map((tab) => (
            <div
              key={tab.name}
              className={cx(
                'transition pb-1 cursor-pointer all-center font-bold text-ui04',
                {
                  'text-ui02': tabActive.name !== tab.name,
                  'border-b-2 border-ui04 font-bold':
                    tabActive.name === tab.name
                }
              )}
              onClick={() => onChangeTabActive(tab)}>
              {tab.name}
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 overflow-auto flex px-5">{tabActive.content}</div>
    </div>
  )
}

export default withI18nProvider(ViewMessagesData)
