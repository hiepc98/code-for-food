import ManageTokenScreen from '@wallet/screen/components/Token/screens/ManageTokenScreen'
import React from 'react'
import { useTranslation } from 'react-i18next'

const TestManageTokenScreen = () => {
  const { t } = useTranslation()

  return (
    // <div>TestManageTokenScreen</div>
    <ManageTokenScreen t={t}/>
  )
}

export default TestManageTokenScreen
