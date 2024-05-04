import StartupScreen from '@wallet/screen/components/StartupScreen'
import React from 'react'
import { useTranslation } from 'react-i18next'

const TestStartupScreen = () => {
  const { t } = useTranslation()
  return (
    <StartupScreen t={t}/>
  )
}

export default TestStartupScreen
