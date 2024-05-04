import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { CoreServiceProvider } from './context/BaseProvider'
import { Modal } from '@wallet/ui'
import i18n from 'i18n'
import React, { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { Provider } from 'react-redux'
import { MemoryRouter as Router } from 'react-router-dom'

import { PersistGate } from '@plasmohq/redux-persist/integration/react'

import { persistor, store } from 'store'

// Global Styles - refactor later
import 'animate.css/animate.min.css'
import 'react-toastify/dist/ReactToastify.min.css'
import '../styles/global.scss'

import ErrorFallback from '@wallet/ui/components/Utilities/ErrorFallback'
import { I18nextProvider } from 'react-i18next'

import App from '~containers/App'
import SplashScreen from '~shared/components/Splash'

// Client
const queryClient = new QueryClient()

// Variable
const FORCE_ACTIVE = 'FORCE_ALIVE'
const FORCE_ACTIVE_INTERVAL = 1000

const Welcome = () => {
  useEffect(() => {
    setInterval(() => {
      // Keep background services alive
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage({ name: FORCE_ACTIVE })
    }, FORCE_ACTIVE_INTERVAL)
  }, [])

  return (
    <I18nextProvider i18n={i18n} defaultNS={'translation'}>
      <Provider store={store}>
        <PersistGate
          loading={<SplashScreen isFullScreen />}
          persistor={persistor}>
          <QueryClientProvider client={queryClient}>
            <Router>
              <ErrorBoundary
                FallbackComponent={({ error }) => (
                  <ErrorFallback error={error} />
                )}>
                <App />
                <Modal />
              </ErrorBoundary>
            </Router>
          </QueryClientProvider>
        </PersistGate>
      </Provider>
    </I18nextProvider>
  )
}
export default Welcome
