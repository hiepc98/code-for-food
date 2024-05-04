import AddCustomToken from '@wallet/screen/components/Token/screens/AddCustomToken'
import React from 'react'
import { useTranslation } from 'react-i18next'

const TestAddCustomToken = () => {
  const { t } = useTranslation()

  return (
    <AddCustomToken t={t}/>
  )
}

export default TestAddCustomToken
