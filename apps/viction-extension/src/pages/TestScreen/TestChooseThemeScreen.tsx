import ChooseThemeScreen from '@wallet/screen/components/Others/ChooseTheme'
import React from 'react'
import { useTranslation } from 'react-i18next'

const TestChooseThemeScreen = () => {
  const { t } = useTranslation()

  return (
    <ChooseThemeScreen t={t}/>
  )
}

export default TestChooseThemeScreen
