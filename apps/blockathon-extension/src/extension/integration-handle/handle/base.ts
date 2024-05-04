import type {
  BaseIntegrationRequest,
  Chain,
  IntegrationBackgroundEngine
} from '@wallet/core'
import pick from 'lodash/pick'
import uniqueId from 'lodash/uniqueId'
import Web3 from 'web3'

import { store } from 'store'

import { IntegrateError } from '../constants/integrationError'

// import { InternalDappHandle } from './internal'
// import { INTERNAL_REQUEST } from '../constants/internal'
// import { proxyStore as store } from '~src/controllers/Redux/store/proxyStore'

type ChainName = string
type ChainHex = string
type NetVersion = number

export class BaseBackgroundIntegrationHandle {
  clients: IntegrationBackgroundEngine[]
  // internalClient: InternalDappHandle

  eth_chainId = new Map<ChainName, ChainHex>()
  net_version = new Map<ChainName, NetVersion>()
  web3Clients = new Map<ChainName, Web3>()

  constructor (engines: IntegrationBackgroundEngine[]) {
    // @ts-expect-error
    this.clients = engines.map((Engine) => new Engine())

    // this.internalClient = new InternalDappHandle()
  }

  async handle (request: BaseIntegrationRequest) {
    const {
      chain, // type: evm | solana | cosmos
      method
    } = request

    const client = this.getClient(request.chain, request.method)
    if (client.hasMethod(method)) {
      const result = await client[method](request)
      if (typeof result !== 'undefined' && result !== null) return result
    }

    // Support EVM Only
    const {
      setting: { activeNetwork }
    } = store.getState()
    const currentNetwork = activeNetwork

    const METHOD_CACHE = ['eth_chainId', 'net_version']

    if (METHOD_CACHE.includes(method)) {
      if (!currentNetwork) {
        return { error: IntegrateError.resourceNotFound }
      }

      this[method].set(currentNetwork.name, currentNetwork.chainId)
      return this[method].get(currentNetwork.name)
    }

    const web3Client = this.genWeb3(currentNetwork)

    return new Promise((resolve, reject) => {
      // @ts-expect-error nothing
      web3Client.currentProvider.send(
        {
          id: request.id ?? uniqueId(),
          jsonrpc: '2.0',
          method,
          params: request.params
        },
        (err: Error | undefined, response: any) => {
          if (err) {
            reject(err)
            return
          }
          const { result } = response
          const finalResponse = this.serialize(request, result)

          if (METHOD_CACHE.includes(method)) {
            this[method].set(currentNetwork.chain, finalResponse)
          }
          resolve(finalResponse)
        }
      )
    })
  }

  // Support Evm Only
  private serialize (request: any, result: any) {
    // Serialize for JSON Response
    if (request.jsonrpc) {
      return { ...pick(request, ['id', 'jsonrpc'], result) }
    }
    // Raw format
    return result
  }

  private readonly genWeb3 = (chain: Chain): Web3 => {
    if (!this.web3Clients.has(chain.chain)) {
      const rpcConfig = chain.rpcURL as string
      return new Web3(new Web3.providers.HttpProvider(rpcConfig))
    }

    return this.web3Clients.get(chain.chain)
  }
  // Support Evm Only

  checkAuthorized (request: BaseIntegrationRequest) {
    const client = this.getClient(request.chain, request.method)
    return client.isAuthorized(request)
  }

  public isStrictMethod (request: BaseIntegrationRequest, origin): boolean {
    const client = this.getClient(request.chain, request.method)
    return client.isStrictMethod(request, origin)
  }

  getClient (type: string, method?: string): IntegrationBackgroundEngine {
    // if (method && INTERNAL_REQUEST.includes(method)) {
    //   return this.internalClient
    // }

    const client = this.clients.find((client) => {
      return client.isClient(type)
    })
    if (!client) return null
    return client
  }
}
