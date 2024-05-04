/* eslint-disable @typescript-eslint/ban-types */
import { BaseProvider } from '../base'
import { type SendPayload } from './types'

export class EvmProvider extends BaseProvider {
  bnbSign (address: string, message: any): any {
    return this.request({
      method: 'eth_sign',
      params: [message, address]
    })
  }

  /**
     * @deprecated Legacy function will be removed in future version
     */
  public async enable (): Promise<void> {
    this.deprecated()
    return await this.connect()
  }

  public send (method: string, params: any[]): any
  public send (payload: SendPayload, callback?: Function): any
  public send (methodOrPayload: string | SendPayload, paramsOrCallback?: any[] | Function): any {
    if (typeof methodOrPayload === 'string' && (!paramsOrCallback || Array.isArray(paramsOrCallback))) {
      return this.request({ method: methodOrPayload, params: paramsOrCallback }, null)
    }

    if (methodOrPayload && typeof methodOrPayload === 'object' && typeof paramsOrCallback === 'function') {
      return this.request(methodOrPayload, paramsOrCallback)
    }

    return this.sendSync(methodOrPayload)
  }

  public sendAsync (payload: string | SendPayload, callback: Function): any {
    return this.request(payload, callback)
  }

  public sendSync (payload: string | SendPayload): any {
    let result: string[] | string | number | null = null

    const requestMethod = typeof payload === 'object' ? payload.method : payload

    switch (requestMethod) {
      case 'eth_accounts':
        result = [this.selectedAddress]
        break
      case 'eth_coinbase':
        result = this.selectedAddress ?? null
        break
      case 'net_version':
        result = this.networkVersion ?? null
        break
      case 'eth_chainId':
        result = this.chainId ?? null
        break
    }

    return {
      // @ts-expect-error Not implementation
      id: payload.id,
      // @ts-expect-error Not implementation
      jsonrpc: payload.jsonrpc,
      result
    }
  }

  private deprecated (): void {
    console.warn('This method is deprecated and will be remove soon, implement `request` method instead')
  }
}
