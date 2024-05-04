import { encryptService } from '@wallet/screen'
import SendTokenScreen from '@wallet/screen/components/Token/screens/SendTokenScreen'
import get from 'lodash/get'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation, useParams } from 'react-router-dom'

// import useReceiveAddress from '~controllers/hooks/useReceiveAddress'
import { useAppSelector } from 'store'

interface LocationState {
  fromScreen?: string
}

const TestSendTokenScreen = () => {
  const { t } = useTranslation()
  // const { addRecentContact, getRecentContactList } = useReceiveAddress()

  const { address: tokenAddress } = useParams<{ address: string }>()

  const [activeWallet, wallets] = useAppSelector((state) => [
    state.wallet.activeWallet,
    state.wallet.wallets
  ])

  const { state = {} as LocationState } = useLocation<LocationState>()
  const fromScreen = get(state, 'fromScreen', 'main')
  return (
    <SendTokenScreen
      // tokenAddress={tokenAddress as string}
      // wallets={wallets}
      // activeWallet={activeWallet}
      // customTokens={[]}
      t={t}
      // addRecentContact={addRecentContact}
      // getRecentContactList={getRecentContactList}
      // fromScreen={fromScreen}
      encryptService={encryptService}
    />
  )
}

export default TestSendTokenScreen
