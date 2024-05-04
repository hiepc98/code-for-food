//! Evm only

import { IntegrateError } from '@wallet/core'
import EventEmitter from 'events'
import concat from 'lodash/concat'
import pick from 'lodash/pick'
import uniqueId from 'lodash/uniqueId'
import { completeRequest, pushRequest, setCurrentMethod, store } from 'store'
import Web3 from 'web3'

// import { pushRequest } from '~src/controllers/Redux/reducers/Storages/integrationSlice'
// import { store } from '~src/controllers/Redux/store'

//
const RESTRICT_METHOD = ['eth_sign', 'eth_sendTransaction', 'eth_requestAccounts']

const FROM_STORE_METHOD = ['eth_accounts']

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
  'wallet_watchAsset' // add custom network
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
  sender?:any
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

export class DefaultIntegrationService {
  eth_accounts = async () => {
    return true
  }

  eth_requestAccounts = async () => {
    return true
  }
}

export class EvmIntegrationRouting extends EventEmitter {
  private clients = new Map<string, Web3>()

  windows: WindowType[] = []

  port = new Map<any, chrome.runtime.Port>()

  timer: any

  client: DefaultIntegrationService

  constructor () {
    super()
    this.client = new DefaultIntegrationService()

    // eslint-disable-next-line no-undef
    chrome.runtime.onConnect.addListener(connectedPort => {
      const PORT_NAME = 'Tomo:EventScript'
      if (connectedPort.name !== PORT_NAME) return false

      const FORCE_ALIVE = 'FORCE_ALIVE'
      const timer = setInterval(() => {
        connectedPort.postMessage({
          name: FORCE_ALIVE,
          data: FORCE_ALIVE,
          id: FORCE_ALIVE,
          event: FORCE_ALIVE
        })
      }, 5000)

      const portId = `${connectedPort.sender.frameId}${connectedPort.sender.tab.id}`
      this.port.set(portId, connectedPort)

      connectedPort.onDisconnect.addListener(currentPort => {
        const portId = `${currentPort.sender.frameId}${currentPort.sender.tab.id}`
        this.port.delete(portId)
        clearInterval(timer)
      })
    })

    // eslint-disable-next-line no-undef
    chrome.windows.onRemoved.addListener(windowId => {
      store.dispatch(setCurrentMethod(''))
      const findWindows = this.windows.find(it => it.window.id === windowId)
      if (findWindows?.id) {
        this.emit(findWindows.id, { error: IntegrateError.reject })
        // store.dispatch(completeRequest())
      }
    })
  }

  public handle = async (request: IRequest) => {
    // before popup
    const { id, method, params = [] } = request

    const { requests, currentMethod } = store.getState().integration

    // const canExec = !!this[method]

    // if (canExec) {
    //   const result = this[method](...params)
    //   return this.serialize(request, result)
    // }

    if (FROM_STORE_METHOD.includes(method)) {
      return this[method]()
    }

    const isProcessOnPopup = POPUP_METHOD.includes(method)

    if (!isProcessOnPopup) {
      try {
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
      } catch (e) {
        console.log('err', e)
      }
    }

    if (requests.length === 0) {
      clearTimeout(this.timer)
      return new Promise((resolve) => {
        // Debounce
        this.timer = setTimeout(async () => {
          const { id } = request
          const requestId = id || uniqueId()

          console.log('method', method)

          if ((currentMethod !== method) || method !== 'eth_requestAccounts') {
            store.dispatch(pushRequest({
              id: requestId,
              request: request as any
            }))
            console.log('not block')
          }
          console.log('block')
          this.once(requestId, resolve)

          this.createWindow(requestId)
        }, 250)
      })
    } else {
      console.log('second time')

      // await this.client[method](request)

      return true
    }
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
    // const { wallet } = this.getCurrentNetworkInformation()
    const state = store.getState()
    const activeWallet = state.wallet.activeWallet
    return [activeWallet?.address]
  }

  // eth_requestAccounts () {
  //   // Check permission & request for connection
  //   // Get account with request for account permissions
  //   return this.eth_accounts()
  // }

  private getCurrentNetworkInformation () {
    const state = store.getState()
    const activeNetwork = state.setting.activeNetwork
    const wallet = state.wallet.wallets.find(
      (wallet) => wallet.meta.chain === activeNetwork.chain
    )
    const client = this.getClient(activeNetwork.chain)

    return {
      network: activeNetwork,
      wallet,
      client
    }
  }

  private getClient (chain: string) {
    if (this.clients.has(chain)) return this.clients.get(chain)

    const state = store.getState()
    const rpcConfig =
      state.info.rpcConfig[chain] || state.setting.activeNetwork.chain
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
