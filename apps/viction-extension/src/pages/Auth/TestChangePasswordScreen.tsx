import ChangePasswordScreen from '@wallet/screen/components/Others/ChangePasswordScreen'
import React from 'react'
import { encryptService } from '~controllers/services/encryption'
import { useTranslation } from 'react-i18next'

const TestChangePasswordScreen = () => {
  const { t } = useTranslation()

  return (
    <ChangePasswordScreen encryptService={encryptService} t={t}/>
  )
}

export default TestChangePasswordScreen
