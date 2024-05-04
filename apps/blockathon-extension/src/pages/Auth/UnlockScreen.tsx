import UnlockScreen from '@wallet/screen/components/Auth/screens/UnlockScreen'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { encryptService } from '~controllers/services/encryption'

const TestUnlockScreen = () => {
  const { t } = useTranslation()

  return (
    <UnlockScreen t={t} encryptService={encryptService}/>
  )
}

export default TestUnlockScreen
