import CurrencyScreen from '@wallet/screen/components/Others/CurrencyScreen'
import React from 'react'
import { useTranslation } from 'react-i18next'

const TestCurrencyScreen = () => {
  const { t } = useTranslation()

  return (
    <CurrencyScreen t={t}/>
  )
}

export default TestCurrencyScreen
