import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Modal } from '@wallet/ui'
import React, { useEffect } from 'react'
import { Provider } from 'react-redux'
import { MemoryRouter as Router } from 'react-router-dom'
import { persistor, store } from 'store'

import { PersistGate } from '@plasmohq/redux-persist/integration/react'

import 'i18n'
// Global Styles - refactor later
import 'animate.css/animate.min.css'
import 'react-toastify/dist/ReactToastify.min.css'
import '../styles/global.scss'

import ErrorFallback from '@wallet/ui/components/Utilities/ErrorFallback'
import { ErrorBoundary } from 'react-error-boundary'

import App from '~containers/App'

// Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 15
    }
  }
})

// Variable
const FORCE_ACTIVE = 'FORCE_ALIVE'
const FORCE_ACTIVE_INTERVAL = 1000

const Popup = () => {
  useEffect(() => {
    setInterval(() => {
      // Keep background services alive
      // eslint-disable-next-line no-undef
      chrome.runtime.sendMessage({ name: FORCE_ACTIVE })
    }, FORCE_ACTIVE_INTERVAL)
  }, [])

  return (
    <Provider store={store}>
      <PersistGate
        loading={<></>}
        persistor={persistor}>
        <QueryClientProvider client={queryClient}>
          <ErrorBoundary
            FallbackComponent={({ error }) => <ErrorFallback error={error} />}>
            <Router>
              <App />
              <Modal />
            </Router>
          </ErrorBoundary>
        </QueryClientProvider>
      </PersistGate>
    </Provider>
  )
}
export default Popup
