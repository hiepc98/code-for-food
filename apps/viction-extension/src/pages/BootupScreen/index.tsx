import Loader from '@wallet/screen/components/shared/Loader'
import useTheme from '@wallet/screen/hooks/useTheme'
import { cx } from '@wallet/utils'
import React, { Suspense, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

// import { lazy } from '@loadable/component'
import { bootup } from '~controllers/services/boot'

const BootupScreen = () => {
  const history = useHistory()
  const { isDarkTheme } = useTheme()
  // const [isCompleted, setIsCompleted] = React.useState(false)
  const [isBootUp, setIsBootUp] = React.useState(false)

  useEffect(() => {
    bootup().then(() => {
      setIsBootUp(true)
    })
  }, [])

  useEffect(() => {
    if (window.walletServices && isBootUp) {
      history.push('/startup')
    }
  }, [isBootUp])

  return (
    <div className="">
        {/* <img
          className={cx('h-20 w-screen animate-bounce', {})}
          src="/public/img/brand/logo-light.svg"
        /> */}
      {/* <Loader width="280px" height="280px" /> */}
    </div>
  )
}

export default BootupScreen
