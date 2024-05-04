import useTheme from '@wallet/screen/hooks/useTheme'
import useViewport from '@wallet/screen/hooks/useViewport'
import { cx } from '@wallet/utils'
import { chain } from 'lodash'
import React, { useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { Redirect, useHistory, useLocation } from 'react-router-dom'
import { ToastContainer, cssTransition } from 'react-toastify'
import { onChangeGetStarted, useAppSelector, onChangeFullScreen } from 'store'

import MenuFooter from '~containers/App/Components/MenuFooter'
import { WalletProvider } from '~controllers/contexts/WalletContext'
// import useTheme from '~controllers/hooks/useTheme'
// import useViewport from '~controllers/hooks/useViewport'
// import { TempProvider } from '~controllers/providers-temp/TempProvider'

import GlobalService from './Components/GlobalService'
import IntegrationService from './Components/IntegrationService'
import Routing from './Components/Routing'

// import IntegrationService from './Components/IntegrationService'
// Lazy all services

const zoomEffect = cssTransition({
  enter: 'animate__animated animate__faster animate__fadeInDownBig',
  exit: 'animate__animated animate__faster animate__fadeOutUpBig'
})

const App = () => {
  const { isExpand } = useViewport()
  const { pathname } = useLocation()
  const history = useHistory()
  const { theme, handleChangeTheme } = useTheme()
  const dispatch = useDispatch()

  const [hasWallet, hasRequest, authentication, lastActivity, isGetStarted] =
    useAppSelector((state) => {
      return [
        state.wallet.wallets.length > 0,
        state.integration.requests.length > 0,
        state.user.authentication,
        state.user.authentication.lastActivity || 0,
        state.setting.isGetStarted
      ]
    })

  const { isLock, type: passwordType, password } = authentication

  useEffect(() => {
    if (!isGetStarted && hasWallet) {
      dispatch(onChangeGetStarted(true))
    }
  }, [hasWallet])

  useEffect(() => {
    handleChangeTheme(theme)
    const query = new URLSearchParams(window.location.search)
    const redirect = query.get('redirect')
    if (redirect) history.push(redirect)
  }, [])

  const IndexRoutes = useMemo(() => {
    const bootList = ['token']
    const isUnbooted =
      chain(authentication).pick(bootList).values().value().length !==
      bootList.length

    // Verify && Lock Extension
    const currentDate = new Date().getTime()
    const minutePassed = (currentDate - lastActivity) / 1000 / 60

    if (window.location.href.includes('?development')) {
      return <Redirect to="/integration/transaction" />
    }

    if (!window.location.href.includes('/staking')) {
      dispatch(onChangeFullScreen(false))
    }

    if (isUnbooted || !password || !hasWallet) {
      if (!location.href.includes('welcome')) {
        return null
      }

      if (isUnbooted) {
        return <Redirect to="/boot" />
      }
      dispatch(onChangeGetStarted(false))
      if (password) return
      return <Redirect to="/get-started" />
    }

    if (isLock || minutePassed > 15) {
      return (
        <Redirect
          to={{
            pathname:
              passwordType === 'password'
                ? '/lock-password'
                : `/main/${passwordType}`,
            state: {
              isUnlock: true
            }
          }}
        />
      )
    }

    if (hasRequest) {
      return <Redirect to="/integration" />
    }
    return <Redirect to="/main" />
  }, [isLock])

  const isShowMenuFooter = useMemo(() => {
    return (
      !pathname.includes('startup') &&
      !pathname.includes('integration') &&
      !pathname.includes('lock')
    )
  }, [pathname])

  if (process.env.NODE_ENV === 'production') {
    console.log = () => {}
    console.error = () => {}
    console.debug = () => {}
  }
  return (
    <>
      <WalletProvider>
        {/* <TempProvider> */}
        <main
          className={cx(
            'relative h-screen',
            { expand: isExpand }
          )}>
          {IndexRoutes}
          <Routing />
          {isShowMenuFooter && hasWallet && <MenuFooter />}
        </main>
        <GlobalService />
        <IntegrationService />
        {/* </TempProvider> */}
      </WalletProvider>
      {/* <IntegrationService/> */}

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop={true}
        closeOnClick
        limit={1}
        rtl={false}
        theme={theme}
        closeButton={false}
        transition={zoomEffect}
      />
    </>
  )
}

export default App
