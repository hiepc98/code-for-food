import type { Token, Wallet } from '@wallet/core'
import { MainLayout } from '@wallet/ui'
import get from 'lodash/get'
import { type FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import useTokenLocal from '../../../hooks/useTokenLocal'

import ReceiveInfo from '../components/ReceiveInfo'
import ListToken from '../../../components/shared/ListToken'
import withI18nProvider from '../../../provider'

interface LocationState {
  fromScreen?: string
  wallet?: Wallet
  tokenInfo?: Token
}

const ReceiveInfoScreen = () => {
  const { t } = useTranslation()
  const { state = {} as LocationState } = useLocation<LocationState>()
  const fromScreen = get(state, 'fromScreen')
  const tokenInfo = get(state, 'tokenInfo')

  const { tokensLocal } = useTokenLocal()

  const onGoBack = () => {
    if (fromScreen === 'setting' || fromScreen === 'tokenDetail') {
      window.goBack()
      return false
    }
    window.openModal({
      type: 'none',
      title: t('history_item.receive'),
      content: (
        <ListToken
          type={'receive'}
          listTokens={tokensLocal}
          isHidePrice={false}
          t={t}
        />
      ),
      contentType: 'other',
      closable: true
    })
    setTimeout(() => {
      window.goBack()
    }, 600)
  }
  return (
    <MainLayout
      backAction={onGoBack}
      title={
        fromScreen !== 'setting' &&
        t(
          `${t('history_item.receive')} ${get(tokenInfo, 'symbol', '').toUpperCase()}`
        )
      }
      className="px-5 pb-5">
      <ReceiveInfo />
    </MainLayout>
  )
}

export default withI18nProvider(ReceiveInfoScreen)
