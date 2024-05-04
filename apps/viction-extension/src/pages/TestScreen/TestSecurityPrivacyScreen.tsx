import SecurityPrivacyScreen from '@wallet/screen/components/Others/SecurityPrivacyScreen'
import React from 'react'
import { useTranslation } from 'react-i18next'

const TestSecurityPrivacyScreen = () => {
  const { t } = useTranslation()

  return (
    <SecurityPrivacyScreen t={t}/>
  )
}

export default TestSecurityPrivacyScreen
