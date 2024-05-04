import { useTranslation } from 'react-i18next'

import React from 'react'
import SettingScreen from '@wallet/screen/components/Others/SettingScreen'

const TestSettingScreen = () => {
  const { t } = useTranslation()
  return (
    <SettingScreen
      t={t}
    />
  )
}

export default TestSettingScreen
