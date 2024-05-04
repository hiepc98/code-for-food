import SendNftScreen from '@wallet/screen/components/NFT/SendNftScreen'
import React from 'react'
import { encryptService } from '~controllers/services/encryption'
import { useTranslation } from 'react-i18next'

const TestSendNftScreen = () => {
  const { t } = useTranslation()

  return (

    <SendNftScreen encryptService={encryptService} t={t}/>
  )
}

export default TestSendNftScreen
