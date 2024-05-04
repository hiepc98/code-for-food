import GeneralScreen from '@wallet/screen/components/Others/GeneralScreen'
import React from 'react'
import { useTranslation } from 'react-i18next'

const TestGeneralScreen = () => {
  const { t } = useTranslation()

  return (
    <GeneralScreen t={t}/>
  )
}

export default TestGeneralScreen
