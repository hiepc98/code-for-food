import {
  type BaseIntegrationRequest,
  type IntegrationRequestType,
  Wallet
} from '@wallet/core'
import { base58 } from '@wallet/utils'
import first from 'lodash/first'
import isBuffer from 'lodash/isBuffer'
import React, { type FC, useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { useDeepCompareEffect } from 'react-use'
import { postRecord } from 'store/service/ApiUtils'
// import useIntegrationClient from '../../../hooks/useIntegrationClient'
import useIntegrationClientV2 from '../../../hooks/useIntegrationClientV2'
import {
  useAppDispatch,
  useAppSelector,
  updateResponse,
  completeRequest,
  store,
  setCurrentMethod
} from 'store'
import { get } from 'lodash'
import EmptyData from '../../shared/EmptyData'
import { IntegrateError } from '@wallet/constants'

export type RequestType =
  IntegrationRequestType<BaseIntegrationRequest>['request']

interface IntegrationContextInterface {
  activeWallet?: Wallet
  request: RequestType
  requests: RequestType[]
  isLoading: boolean
  // Func
  onAcceptRequest: (options?: any) => any
  onRejectRequest: () => any
  onRejectAllRequest: () => any
}

interface IntegrationProviderProps {
  encryptService: any
  services: any
  children: any
}

const IntegrationContext = React.createContext<IntegrationContextInterface>({
  request: {} as IntegrationRequestType['request'],
  requests: [],
  isLoading: false,
  onAcceptRequest: () => {},
  onRejectRequest: () => {},
  onRejectAllRequest: () => {}
})

const REQUEST_TYPE = {
  eth_accounts: 'connect',
  eth_getEncryptionPublicKey: 'messages',
  eth_decrypt: 'messages'
}

// Currently only works for evm
export const IntegrationProvider = (props: IntegrationProviderProps) => {
  const {
    encryptService,
    children,
    services
  } = props
  // const { client, handle } = useIntegrationClient()
  const { client, handle, render } = useIntegrationClientV2(services)

  // const client = window.integrationServices
  const history = useHistory()

  const [requests, activeWallet, activeNetwork] = useAppSelector((state) => [
    state.integration.requests,
    state.wallet.activeWallet,
    state.setting.activeNetwork,

  ])
  const currentRequest : any = first(requests)
  const [isLoading, setIsLoading] = useState(false)

  // const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const santinizedRequest = currentRequest?.request

  const walletHandle = async () => {
    // Tempory solutions for wallet methods
    // const { method } = santinizedRequest
    return true
  }

  const onAcceptRequest = async (options?: any) => {
    setIsLoading(true)
    // Every Engine have to implement their handler
    // Wallet Special method

    let response: any

    setIsLoading(true)

    try {
      if (santinizedRequest.method.startsWith('wallet_')) {
        response = await walletHandle()
      } else {
        response = await handle(
          santinizedRequest,
          options,
          encryptService.decryptWallet(activeWallet)
        )
        const formatSender = get(santinizedRequest, 'sender')
        delete formatSender.tab
        const logData = {
          signer: get(activeWallet, 'address'),
          sender: formatSender,
          method: get(santinizedRequest, 'method'),
          ...response
        }

        await postRecord(logData)
      }
    } catch (e) {
      console.log('err handle request', e)
    }

    dispatch(completeRequest(currentRequest.id))

    setTimeout(() => {
      sendResponse(response)
    }, 500)
  }

  const onRejectRequest = () => {
    dispatch(completeRequest(currentRequest.id))
    setTimeout(() => {
      sendResponse({ error: IntegrateError.reject })
    }, 500)
  }

  const onRejectAllRequest = () => {
    // Disable Reject ALl
    // window.openModal({
    //   type: 'confirm',
    //   content: `${t('rejectAllRequest', { count: requests.length })} ?`,
    //   onOk: async () => {
    //     const { requests } = store.getState().integration
    //     setIsLoading(true)
    //     requests.forEach(it => {
    //       dispatch(updateResponse({
    //         id: it.id,
    //         response: {
    //           code: 4001,
    //           message: 'User rejected the request.'
    //         }
    //       }))
    //     })
    //   }
    // })
    // persistor.subscribe(() => {
    //   const isAllResult = requests.every(it => it.response)
    //   if (isAllResult) {
    //     setIsLoading(false)
    //     window.close()
    //   }
    // })
  }

  const sendResponse = (response: any) => {
    // Format request
    if (typeof response === 'object') {
      Object.keys(response).forEach(k => {
        if (isBuffer(response[k]) || ArrayBuffer.isView(response[k])) {
          response[k] = {
            isEncoded: true,
            encodedString: base58.encode(response[k])
          }
        }
      })
    }

    chrome.runtime.sendMessage({
      id: currentRequest.id,
      response,
      type: 'FROM_EXT'
    })

    // dispatch(updateResponse({ id: currentRequest.id, response }))
  }

  const handleCurrentRequest = async () => {
    // Temp solutions

    try {

      if (services && client && currentRequest) {
        // const renderRequest = window.integrationServices.render(santinizedRequest)
        // const options = {
        //   isRenderOnly: true,
        //   chain: get(activeNetwork, 'chain'),
        //   chainInfo: activeNetwork
        // }


        const renderRequest = await render(santinizedRequest)


        const requestType = get(REQUEST_TYPE, `${renderRequest.type}`) || renderRequest.type

        if (renderRequest) {

          history.push(`/integration/${requestType}`, { renderRequest })
        }
      }
    } catch (e) {
      console.log('err', e)
    }
  }

  useEffect(() => {
    handleCurrentRequest()
  }, [JSON.stringify(currentRequest), JSON.stringify(client), JSON.stringify(services)])

  useDeepCompareEffect(() => {

    const findId = requests.find((it) => it.id === currentRequest.id)


    if (findId?.response) {
      store.dispatch(setCurrentMethod(''))
      setTimeout(window.close, 250)
      setIsLoading(false)
    }

    const currentUrl = window.location.toString() || ''
    const isMainPopup = !currentUrl.includes('popup.html?type=dapp-confirmation')

    if (!findId && !currentRequest && isMainPopup) {
      setTimeout(() => {
        setIsLoading(false)
        history.push('/main')
      }, 500)
    }
  }, [requests, currentRequest])

  const value = {
    activeWallet,
    request: currentRequest?.request,
    requests,
    isLoading,

    onAcceptRequest,
    onRejectRequest,
    onRejectAllRequest
  }

  return (
    // @ts-expect-error
    <IntegrationContext.Provider value={value}>
      {!currentRequest ? <EmptyData isFullScreen isLoading/> : children}
    </IntegrationContext.Provider>
  )
}

export const useIntegrationContext = () => {
  return React.useContext(IntegrationContext)
}
