// import SendTxScreen from '@wallet/screen/components/Integration/screens/SendTxScreen'
import EvmTxScreen from '@wallet/screen/components/Integration/screens/EvmTxScreen'

import React from 'react'
import { useTranslation } from 'react-i18next'

const SendTxScreenV2 = () => {
  const { t } = useTranslation()

  return (
    <EvmTxScreen t={t}/>
  )
}

export default SendTxScreenV2
