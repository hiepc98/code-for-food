import ReceiveInfoScreen from '@wallet/screen/components/Token/screens/ReceiveInfoScreen'
import React from 'react'
import { useTranslation } from 'react-i18next'

const TestReceiveInfoScreen = () => {
  const { t } = useTranslation()
  return (
    <ReceiveInfoScreen t={t}/>
  )
}

export default TestReceiveInfoScreen
