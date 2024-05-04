import debounce from 'lodash/debounce'
import { useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'
import { useDeepCompareEffect } from 'react-use'
import { onChangeGetStarted, onUpdateActivity, store, useAppDispatch, useAppSelector } from 'store'

import { useWallet } from '~controllers/contexts/WalletContext'

// import { useService } from '~src/context/BaseProvider'
const GlobalService = () => {
  const history = useHistory()
  const { services, integrationService } = useWallet()
  const wallets = useAppSelector((state) => state.wallet.wallets)

  const dispatch = useAppDispatch()

  const clearToastOnClick = () => {
    toast.dismiss()
  }

  const keepExtensionAlive = debounce(() => {
    const { user } = store.getState()

    if (!user.authentication.isLock) {
      dispatch(onUpdateActivity())
    }
  }, 1000)

  useEffect(() => {
    // Default goback event for all pages;
    window.goBack = history?.goBack
    window.addEventListener('click', clearToastOnClick)
    window.addEventListener('click', keepExtensionAlive)
    return () => {
      window.removeEventListener('click', clearToastOnClick)
      window.removeEventListener('click', keepExtensionAlive)
    }
  }, [history?.goBack])

  useEffect(() => {
    if (services && services.isReady) {
      window.walletServices = services.wallet
      window.integrationServices = integrationService
    }
  }, [JSON.stringify(services)])

  const handleWalletChange = async () => {
    // @ts-expect-error
    if (wallets.length <= 0 && !window.isFixed) {
      console.log('vao r 1');
      await new Promise((resolve, reject) => {
        setTimeout(resolve, 2000)
      })
      if (window.location.href.includes('welcome.html')) {
        dispatch(onChangeGetStarted(false))
        return history.replace('/get-started')
      }

      // eslint-disable-next-line no-undef
      const popupUrl = chrome.runtime.getURL('tabs/welcome.html')
      // eslint-disable-next-line no-undef
      chrome.tabs
        .create({
          url: popupUrl
        })
        .then(window.close)
    }
  }

  // useDeepCompareEffect(() => {
  //   handleWalletChange()
  // }, [wallets])

  return null
}

export default GlobalService
