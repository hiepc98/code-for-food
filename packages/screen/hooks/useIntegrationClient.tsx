import type { Wallet } from '@wallet/core'
import { useState } from 'react'
import { putConnection, useAppDispatch, useAppSelector } from 'store'

import type { RequestType } from '../types'
import { useDeepCompareEffect } from 'react-use'

const UNSUPPORTED_METHODS = ['eth_requestAccounts']

const SIGNING_METHOD = [
  'eth_signTypedData',
  'eth_signTypedData_v1',
  'eth_signTypedData_v3',
  'eth_signTypedData_v4'
]

const useIntegrationClient = () => {
  const dispatch = useAppDispatch()
  const [activeNetwork, activeWallet] = useAppSelector((state) => [
    state.setting.activeNetwork,
    state.wallet.activeWallet
  ])

  const [client, setClient] = useState<any>()

  useDeepCompareEffect(() => {
    init()
  }, [window.integrationServices])

  const init = async () => {
    const IntegrationEngine = window.integrationServices
    // const { EvmIntegrationHandle } = await import('@wallet/evm')
    // setClient(new IntegrationEngine(activeNetwork))
    if (IntegrationEngine) {
    setClient(IntegrationEngine)
    }
  }

  const handle = async (
    request: RequestType,
    wallet: Wallet,
    options: any
  ): Promise<any> => {
    // Santinized to array like params;
    const requestParams =
      !Array.isArray(request.params) && typeof request.params === 'object'
        ? Object.values(request.params)
        : request.params || []

    const [, signer, ...params] = requestParams

    // if (chainId !== activeNetwork.chainId) { throw Error(`Invalid chainId, must be: ${activeNetwork.chainId}`) }

    // if (signer && signer !== wallet.address && request.method !== 'sendTx') { throw Error('Invalid signer address') }

    try {
      if (SIGNING_METHOD.includes(request.method)) {
        options.advance = {
          ...options.advance,
          msgParams: options.advance.data
        }
        return client.signTypedData(requestParams, request.method, options)
      }

      if (client[request.method]) {
        if (request.method === 'sendTx') {
          const [, tx, mode] = request.params
          return client[request.method](wallet, tx, mode)
        }

        if (request.method === 'eth_getEncryptionPublicKey') {
          return client[request.method](wallet, ...requestParams, options)
        }
        if (request.method === 'eth_decrypt') {
          return client[request.method]([...requestParams], wallet, options)
        }
        if (UNSUPPORTED_METHODS.includes(request.method)) {
          dispatch(putConnection({
            wallet: activeWallet,
            connection: {
              title: request.sender?.tab.title,
              origin: request.sender?.origin,
              favicon: request.sender?.tab.favIconUrl,
              accessList: ['full']
            }
          }))
          return ethRequestAccounts()
        }

        return client[request.method](wallet, ...[...params, options])
      }
    } catch (e) {
      console.log('err', e)
    }
  }

  const ethRequestAccounts = () => {
    // Without request for connection permissions
    return [activeWallet?.address.toLowerCase()]
  }

  return {
    client,
    handle
  }
}

export default useIntegrationClient
