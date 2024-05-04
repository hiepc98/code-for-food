import ChangeProfileScreen from '@wallet/screen/components/Wallet/ChangeProfileScreen'
import React from 'react'
import { useTranslation } from 'react-i18next'

const TestChangeProfileScreen = () => {
  const { t } = useTranslation()
  return (
    <ChangeProfileScreen t={t}/>
  )
}

export default TestChangeProfileScreen
