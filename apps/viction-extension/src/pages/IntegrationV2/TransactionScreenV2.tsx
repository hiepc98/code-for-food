import TransactionScreen from '@wallet/screen/components/Integration/screens/TransactionScreen'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { encryptService } from '~controllers/services/encryption'

const TransactionScreenV2 = () => {
  const { t } = useTranslation()

  return (

    <TransactionScreen encryptService={encryptService} t={t}/>
  )
}

export default TransactionScreenV2
