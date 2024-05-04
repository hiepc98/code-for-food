import HistoryScreen from '@wallet/screen/components/Wallet/HistoryScreen'
import { useTranslation } from 'react-i18next'

import React from 'react'

export const TestHistoryScreen = () => {
  const { t } = useTranslation()
  return (
    <HistoryScreen
      t={t}
    />
  )
}
