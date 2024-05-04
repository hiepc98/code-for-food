import NetworkScreen from '@wallet/screen/components/Others/NetworkScreen'
import React from 'react'
import { useTranslation } from 'react-i18next'

const TestNetworkScreen = () => {
  const { t } = useTranslation()

  return (
    <NetworkScreen t={t}/>
  )
}

export default TestNetworkScreen
