import MyWalletScreen from '@wallet/screen/components/Wallet/MyWalletScreen'
import React from 'react'
import { useTranslation } from 'react-i18next'

const TestMyWalletScreen = () => {
  const { t } = useTranslation()

  return (
    <MyWalletScreen t={t}/>
  )
}

export default TestMyWalletScreen
