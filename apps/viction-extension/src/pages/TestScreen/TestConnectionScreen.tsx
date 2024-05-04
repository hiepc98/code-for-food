// import ConnectionScreen from '@wallet/screen/components/Wallet/ConnectionScreen'
import ConnectionScreen from '@wallet/screen/components/Wallet/ConnectionScreen'
import React from 'react'
import { useTranslation } from 'react-i18next'

const TestConnectionScreen = () => {
  const { t } = useTranslation()

  return (
    <ConnectionScreen t={t}/>
  )
}

export default TestConnectionScreen
