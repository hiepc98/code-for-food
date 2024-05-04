//! Evm only

import { IntegrateError } from '@wallet/core'
import EventEmitter from 'events'
import concat from 'lodash/concat'
import pick from 'lodash/pick'
import uniqueId from 'lodash/uniqueId'
import { completeRequest, pushRequest, store } from 'store'
import Web3 from 'web3'

// import { pushRequest } from '~src/controllers/Redux/reducers/Storages/integrationSlice'
// import { store } from '~src/controllers/Redux/store'

//
const RESTRICT_METHOD = ['eth_sign', 'eth_sendTransaction', 'eth_accounts']
const SIGNING_METHOD = [
  'personal_sign',
  'eth_signTypedData_v4',
  'eth_signTypedData',
  'eth_signTypedData_v1',
  'eth_signTypedData_v3',
  'eth_signTypedData_v4'
]
const UNRESTRICT_METHOD = ['eth_decrypt', 'eth_getEncryptionPublicKey']
const WALLET_METHOD = [
  'wallet_getPermissions',
  'wallet_requestPermissions',
  'wallet_addEthereumChain',
  'wallet_switchEthereumChain',
  'wallet_registerOnboarding',
  'wallet_watchAsset'
]
const POPUP_METHOD = concat(
  RESTRICT_METHOD,
  SIGNING_METHOD,
  UNRESTRICT_METHOD,
  WALLET_METHOD
)
// const DEPRECATED_METHOD = ['eth_decrypt', 'eth_getEncryptionPublicKey']
interface IRequest {
  id: string
  jsonrpc: string | '2.0'
  method: string
  params: string[] | object[]
}

interface JsonRpcResponse {
  id: string
  jsonrpc: string | '2.0'
  result: any
}

interface WindowType {
  id: string
  // eslint-disable-next-line no-undef
  window: chrome.windows.Window
}

export class EvmIntegrationRouting extends EventEmitter {
  private clients = new Map<string, Web3>()

  windows: WindowType[] = []

  port = new Map<any, chrome.runtime.Port>()

  timer: any

  constructor () {
    super()

    chrome.runtime.onConnect.addListener(connectedPort => {
      if (connectedPort.name !== 'Tomo:EventScript') return false

      this.port.set(connectedPort.sender.tab.id, connectedPort)

      const timer = setInterval(() => {
        const FORCE_LIVE = 'FORCE_LIVE'
        connectedPort.postMessage({
          name: FORCE_LIVE,
          data: FORCE_LIVE,
          id: FORCE_LIVE
        })
      }, 5000)

      connectedPort.onDisconnect.addListener((currentPort) => {
        this.port.delete(currentPort.sender.tab.id)
        clearInterval(timer)
      })
      // // keep bgsw
    })

    chrome.windows.onRemoved.addListener(windowId => {
      const findWindows = this.windows.find(it => it.window.id === windowId)
      if (findWindows?.id) {
        this.emit(findWindows.id, { error: IntegrateError.reject })
        store.dispatch(completeRequest(findWindows.id))
      }
    })
  }

  public handle = (request: IRequest) => {
    const { id, method, params = [] } = request

    // const canExec = !!this[method]

    // if (canExec) {
    //   const result = this[method](...params)
    //   return this.serialize(request, result)
    // }

    const isProcessOnPopup = POPUP_METHOD.includes(method)

    if (!isProcessOnPopup) {
      const { client } = this.getCurrentNetworkInformation()
      //   return client[module][callMethod](...params)
      return new Promise((resolve, reject) => {
        // @ts-expect-error nothing
        client.currentProvider.send(
          {
            id: id || uniqueId(),
            jsonrpc: '2.0',
            method,
            params
          },
          (err: Error | undefined, response: JsonRpcResponse) => {
            if (err) return reject(err)
            const { result } = response
            resolve(this.serialize(request, result))
          }
        )
      })
    }

    const requestId = id || uniqueId()

    store.dispatch(
      pushRequest({
        id: requestId,
        request
      })
    )
    this.createWindow(requestId)
  }

  serialize (request: IRequest, result: any) {
    // Serialize for JSON Response
    if (request.jsonrpc) {
      return { ...pick(request, ['id', 'jsonrpc'], result) }
    }
    // Raw format
    return result
  }

  eth_accounts () {
    // Without request for connection permissions
    const { wallet } = this.getCurrentNetworkInformation()
    return [wallet.address]
  }

  eth_requestAccounts () {
    // Check permission & request for connection
    // Get account with request for account permissions
    return this.eth_accounts()
  }

  private getCurrentNetworkInformation () {
    const state = store.getState()
    const network = state.user.network?.evm
    const wallet = state.wallet.wallets.find(
      (wallet) => wallet.meta.chain === network.chain
    )
    const client = this.getClient(network.chain)

    return {
      network,
      wallet,
      client
    }
  }

  private getClient (chain: string) {
    if (this.clients.has(chain)) return this.clients.get(chain)

    const state = store.getState()
    const rpcConfig =
      state.info.rpcConfig[chain] || state.wallet.activeNetwork.chain
    // HTTP Config Only
    const client = new Web3(new Web3.providers.HttpProvider(rpcConfig))
    this.clients.set(chain, client)

    return client
  }

  public createWindow = (id: string) => {
    // Check that window is already exists

    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      // eslint-disable-next-line no-undef
      const popupUrl = chrome.runtime.getURL('popup.html#integration')
      // eslint-disable-next-line no-undef
      chrome.tabs.query({ windowType: 'popup' }, async tabs => {
        console.log('tabs', tabs)

        if (tabs.length === 1) {
          return false
        } else {
          // eslint-disable-next-line no-undef
          const cWindow = await chrome.windows.create({
            url: popupUrl,
            type: 'panel',
            focused: true,
            height: 670,
            width: 390
            // top: 120 (when use use dapp full screen, this fields made the 'windows.create' unexecuteable)
          })
          this.windows.push({
            id,
            window: cWindow
          })
        }
      })
    }, 350)
  }
}
