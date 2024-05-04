import LanguageScreen from '@wallet/screen/components/Others/LanguageScreen'
import React from 'react'
import { useTranslation } from 'react-i18next'

const TestLanguageScreen = () => {
  const { t, i18n } = useTranslation()
  return (
    <LanguageScreen t={t} i18n={i18n}/>
  )
}

export default TestLanguageScreen
