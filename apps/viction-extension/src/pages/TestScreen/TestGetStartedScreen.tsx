import React from 'react'
import loader from '../../../public/lottie/loader.json'
import GetStartedScreen from '@wallet/screen/components/Others/GetStartedScreen'
import { useTranslation } from 'react-i18next'

const TestGetStartedScreen = () => {
  const { t } = useTranslation()

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 h-full w-screen">
      <GetStartedScreen
        t={t}
        // loader={loader}
      />
    </div>
  )
}

export default TestGetStartedScreen
