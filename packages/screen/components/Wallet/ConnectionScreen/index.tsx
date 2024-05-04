import { type IConnection, Wallet } from '@wallet/core'
import { Button, Icon, ListItem, MainLayout, Touch } from '@wallet/ui'
import { get } from 'lodash'
import uniqueId from 'lodash/uniqueId'
import React, { type FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import {
  clearConnection,
  createOrUpdateEvent,
  removeConnection,
  useAppDispatch,
  useAppSelector
} from 'store'

// import {
//   useAppDispatch,
//   useAppSelector
// } from '~controllers/stores/configureStore'
// import { createOrUpdateEvent } from '~controllers/stores/reducers/storages/integrationSlice'
// import {
//   clearConnection,
//   removeConnection
// } from '~controllers/stores/reducers/storages/walletSlice'
import EmptyData from '../../shared/EmptyData'
import withI18nProvider from '../../../provider'

const ConnectionScreen = () => {
  const { t } = useTranslation()
  const { state } = useLocation<{ wallet: Wallet }>()
  const wallet = useAppSelector((rState) =>
    rState.wallet.wallets.find((w) => w.name === state?.wallet.name)
  )

  const dispatch = useAppDispatch()
  const connections = get(wallet, 'connections', [])
  const isEmpty = connections.length === 0

  const onRevokeAll = () => {
    window.openModal({
      type: 'confirm',
      title: t('connection_screen.revoke_title'),
      iconType: 'warning',
      content: t('connection_screen.are_you_sure_revoke'),
      btnType: 'warning',
      closable: false,
      displayType: 'compact',
      onOk: () => {
        dispatch(clearConnection(state.wallet))
        dispatch(
          createOrUpdateEvent({
            id: uniqueId(),
            name: 'disconnect',
            data: {}
          })
        )
      },
      okText: t('connection_screen.revoke_all')
    })
  }

  const onRevoke = (connection: IConnection) => () => {
    window.openModal({
      type: 'confirm',
      title: t('connection_screen.are_you_sure_single_connection', {
        title: connection.title
      }),
      content: '',
      closable: true,
      iconType: 'warning',
      onOk: () => {
        dispatch(
          removeConnection({
            wallet: state.wallet,
            connection
          })
        )
        dispatch(
          createOrUpdateEvent({
            id: uniqueId(),
            name: 'disconnect',
            data: {},
            origin: [connection.origin]
          })
        )
      },
      btnType: 'warning',
      okText: t('connection_screen.revoke')
    })
  }

  const renderConnections = () => {
    if (isEmpty) {
      return <div className='h-full w-full flex items-center justify-center'>
        <p className="text-body-16-regular text-tx-secondary">{t('connection_screen.noConnection')}</p>
      </div>
    }

    return (
      <>
        {connections.map((cnn) => {
          return (
            <ListItem
              key={cnn.origin}
              title={cnn.title}
              description={cnn.origin}
              image={cnn.favicon || '/public/img/brand/logo.svg'}
              rightView={
                <Touch onClick={onRevoke(cnn)} className="ml-auto">
                  <Icon name="close" className="text-h2 text-ui04" />
                </Touch>
              }
            />
          )
        })}
      </>
    )
  }

  return (
    <MainLayout title={t('Manage Connections')}>
      <div className="flex flex-col flex-1 w-full h-full">
        <div className="flex-1 overflow-auto">{renderConnections()}</div>

        {!isEmpty && (
          <div className="w-full border-t-[1px] border-t-ui02">
            <Button
              isBlock
              onClick={onRevokeAll}
              type="transparent"
              className="text-ui04 font-normal capitalize justify-end text-base py-2">
                {t('Revoke all connections')}
                <Icon name="delete" className="ml-2 text-h2" />
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  )
}

export default withI18nProvider(ConnectionScreen)
