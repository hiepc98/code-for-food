import { uniqueId } from '../../utils'
import { SafeEvent } from '../../utils/safeEvent'
import { type IProviderOptions, type IBaseProvider } from './types'

export class BaseProvider extends SafeEvent implements IBaseProvider {
  isConnect: boolean = false
  isFixedChain: boolean = false
  isKaiWallet: boolean = true
  isNiftyWallet: boolean = true
  isMetaMask: boolean = true
  isDesktop: true = true

  publicConfigStore: any
  currentChain: string = ''
  autoRefreshOnNetworkChange: boolean = false

  // #Legacy Support
  selectedAddress: string = ''
  chainId?: string
  networkVersion?: number

  constructor (options?: IProviderOptions) {
    super()
    this.autoRefreshOnNetworkChange = options?.autoRefreshOnNetworkChange ?? false
    // Always default as evm
    this.currentChain = options?.chain ?? 'evm'

    // Supported Override Celo Wallet
    this.isDesktop = true
    this.publicConfigStore = {
      on: this.on
    }
  }

  public isConnected (): boolean {
    return this.isConnect
  }

  public connect (): void {
    this.isConnect = true
    return this.request({
      method: 'eth_requestAccounts',
      params: []
    })
  }

  public disconnect (): void {
    this.isConnect = false
    return this.request({
      method: 'disconnect'
    })
  }

  public request (args: any, callback?: any): any {
    const { method, params, callback: callbackFunction } = typeof args === 'object'
      ? args
      : {
          method: arguments[0],
          params: arguments[1],
          callback: arguments[2]
        }

    if ((!args && typeof args !== 'object')) {
      throw new Error('Invalid arguments')
    }

    if (typeof method !== 'string' || !method || method.length === 0) {
      throw Error('Invalid Method')
    }

    const santinizedParams = this.transformData(params)

    return new Promise((resolve, reject) => {
      const requestId = uniqueId()

      this.once(requestId, data => {
        console.log('response from request id', data)
        const executeFunction = callback ?? callbackFunction
        if (typeof executeFunction === 'function') {
          executeFunction(data)
        }

        if (data?.error) {
          reject(data?.error); return
        }

        resolve(data)
      })

      this.stream.write({
        id: requestId,
        data: {
          chain: this.currentChain,
          method,
          params: santinizedParams
        }
      })
    })
  }

  private transformData<T>(data: T): T {
    return data
  }

  getOfflineSignerAmino () {}

  getOfflineSignerDirect () {}

  getOfflineSignerAuto () {}
}
