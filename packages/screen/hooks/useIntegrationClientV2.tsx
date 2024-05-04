import { useDeepCompareEffect } from 'react-use'
import { RequestType } from '../types'
import useEvmIntegration from './integration/useEvmIntegration'
import { IntegrationHandleOptions } from '@wallet/core'
import { useEffect, useState } from 'react'
import { store, useAppSelector } from 'store'
import { get } from 'lodash'
// import useIntegrationClient from './useIntegrationClient'

// const EXTENSION_METHODS = ['']

export const SWITCH_CHAIN_METHODS = ['wallet_switchEthereumChain']
export const ENCRYPT_DECRYPT_METHOD = [
  'eth_decrypt',
  'eth_getEncryptionPublicKey'
]


const useIntegrationClientV2 = (services: any) => {
  // const { wallet: walletService } = useService()
  // const network = useAppSelector(state => state.user.network)
  const evmHandle = useEvmIntegration(services)
  // const solanaHandle = useSolanaIntegration()
  // const cosmosHandle = useCosmosIntegration()
  // const bitcoinHandle = useBitcoinIntegration()
  // const internalHandle = useIntegrationClient()

  // const render = async (request: RequestType, type?: string): Promise<any> => {
  //   const options: IntegrationHandleOptions = {
  //     isRenderOnly: true,
  //     chain: undefined,
  //     chainInfo: undefined
  //   }
  //   switch (type) {
  //     case 'cosmos':{
  //       const chainInfo = ChainData.find(it => it.chain === request.params[0])
  //       options.chain = chainInfo?.chain ?? network[type].chain
  //       options.chainInfo = chainInfo ?? network[type]
  //       break
  //     }
  //     case 'evm':
  //     case 'solana':
  //     default: {
  //       options.chain = network[type]?.chain ?? type
  //       options.chainInfo = network[type] ?? CHAIN_DATA[type]
  //       break
  //     }
  //   }

  //   if (INTERNAL_CONNECT.includes(request.method)) {
  //     return {
  //       type: 'connect',
  //       data: {
  //         sender: request.sender
  //       }
  //     }
  //   }

  //   return await walletService.integrationHandle(
  //     request,
  //     options
  //   )
  // }

  const [client, setClient] = useState<any>()

  const [ activeNetwork] = useAppSelector((state) => [
    state.setting.activeNetwork
  ])

  useEffect(() => {
    if(services){
      init()
    }
  }, [services])

  const init = async () => {

    try{
      const IntegrationEngine = window.integrationServices || services
      // const { EvmIntegrationHandle } = await import('@wallet/evm')
      // setClient(new IntegrationEngine(activeNetwork))
      if (IntegrationEngine) {
        setClient(IntegrationEngine)
      }
    }catch(e){
      console.log('er', e);
    }
  }

  const getType = () => {
    const activeNetwork :any = store.getState().setting.activeNetwork

    let type = 'evm'
    if (activeNetwork.isCosmos) {
      type = 'cosmos'
    } else if (activeNetwork.isWeb3) {
      type = 'evm'
    } else {
      type = activeNetwork.id
    }

    return type
  }

  const getEngine = () => {

    const type = getType()
    let engineHandle: any
    switch (type) {
      case 'evm': {
        engineHandle = evmHandle
        break
      }
      // case 'solana': {
      //   engineHandle = solanaHandle
      //   break
      // }
      // case 'cosmos': {
      //   engineHandle = cosmosHandle
      //   break
      // }
      // case 'bitcoin':
      //   engineHandle = bitcoinHandle
      //   break
      default:
        break
    }

    return engineHandle
  }

  const handle = async (request: RequestType, options?: IntegrationHandleOptions, wallet?:any): Promise<any> => {
    try {
      request.params = !Array.isArray(request.params) && typeof request.params === 'object' ? Object.values(request.params) : request.params
      const engineHandle = getEngine()

      // if (typeof internalHandle[request.method] === 'function') {
      //   const result = await internalHandle[request.method](request)
      //   return result
      // }

      if (options?.isRenderOnly) {
        return await engineHandle.handle(
          request,
          options
        )
      }



      if (typeof engineHandle[request.method] === 'function') {
        // const executeFunction = engineHandle[request.method]
        // const params = get(request, 'params[0]')
        const params = !Array.isArray(request.params) && typeof request.params === 'object' ? Object.values(request.params) : request.params
        if(options?.advance?.txData){
          params.data = options?.advance?.txData
        }

        if(options?.gas){
          if(Array.isArray(params)){
            params[0].gas = options?.gas
          }
          else params.gas = options?.gas
        }

        const result = await engineHandle[request.method](params || request.params, request, options)
        return result
      }

      const res = await engineHandle.handle(
        request,
        options
      )
      return res
    } catch (error) {
      console.log('error', error)

      throw new Error(error)
    }
  }

  const render = async (santinizedRequest: RequestType) => {
    const engineHandle = getEngine()


    let renderRequest = await engineHandle.handle(santinizedRequest, {
      isRenderOnly: true
    })

    if (SWITCH_CHAIN_METHODS.includes(renderRequest.type)) {
      renderRequest.type = 'switch-network'
    }

    if (ENCRYPT_DECRYPT_METHOD.includes(renderRequest.type)) {
      renderRequest.type = 'messages'
    }

    return renderRequest
  }

  return {
    handle,
    client,
    render
  }
}

export default useIntegrationClientV2
