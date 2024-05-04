import NetworkSwitch from '@wallet/screen/components/Integration/screens/NetworkSwitch'
import React from 'react'
import { useTranslation } from 'react-i18next'

const NetworkSwitchV2 = () => {
  const { t } = useTranslation()

  return (
    <NetworkSwitch t={t}/>
  )
}

export default NetworkSwitchV2
