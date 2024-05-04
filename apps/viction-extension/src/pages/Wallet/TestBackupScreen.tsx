import BackupScreen from '@wallet/screen/components/Wallet/BackupScreen'
import React from 'react'
import { encryptService } from '~controllers/services/encryption'
import { useTranslation } from 'react-i18next'

const TestBackupScreen = () => {
  const { t } = useTranslation()
  return (

    <BackupScreen
      t={t}
      encryptService={encryptService}
    />
  )
}

export default TestBackupScreen
