import ManageWalletScreen from '@wallet/screen/components/Wallet/ManageWalletScreen'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { encryptService } from '~controllers/services/encryption'

const TestManageWalletScreen = () => {
  const { t } = useTranslation()
  return (
    <ManageWalletScreen
      encryptService={encryptService}
      t={t}
    />
  )
}

export default TestManageWalletScreen
