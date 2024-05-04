import ConnectScreen from '@wallet/screen/components/Integration/screens/ConnectScreen'
// import ConnectionScreen from '@wallet/screen/components/Wallet/ConnectionScreen'
import React from 'react'

import { useTranslation } from 'react-i18next'

const ConnectScreenV2 = () => {
  const { t } = useTranslation()

  return (
    <ConnectScreen t={t}/>
  )
}

export default ConnectScreenV2
