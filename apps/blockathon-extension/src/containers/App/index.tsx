import { cx } from '@wallet/utils'
import { useMemo } from 'react'
import { Redirect, useLocation } from 'react-router-dom'
import { ToastContainer, cssTransition } from 'react-toastify'
import { useAppSelector } from 'store'

import GlobalService from '~containers/App/Components/GlobalService'
import MenuFooter from '~containers/App/Components/MenuFooter'
import { WalletProvider } from '~controllers/contexts/WalletContext'

import Routing from './Components/Routing'

const zoomEffect = cssTransition({
  enter: 'animate__animated animate__faster animate__fadeInDownBig',
  exit: 'animate__animated animate__faster animate__fadeOutUpBig'
})

const App = () => {
  const hasWallet = useAppSelector((state) => state.wallet.wallets.length > 0)
  const { pathname } = useLocation()

  const IndexRoutes = useMemo(() => {
    if (!hasWallet) {
      return <Redirect to="/startup" />
    }
    return <Redirect to="/home" />
  }, [hasWallet])

  const isShowMenuFooter = useMemo(() => {
    return !pathname.includes('startup')
  }, [pathname])

  return (
    <>
      <WalletProvider>
        <main className={cx('relative h-screen')}>
          {IndexRoutes}
          <Routing />
          <GlobalService />
          {isShowMenuFooter && <MenuFooter />}
        </main>
      </WalletProvider>

      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar
        newestOnTop={true}
        closeOnClick
        limit={1}
        rtl={false}
        theme={'light'}
        closeButton={false}
        transition={zoomEffect}
      />
    </>
  )
}

export default App
