/**
 * Only routing and submit event
 */
import EventEmitter from 'events'
import { get } from 'lodash'
import debounce from 'lodash/debounce'
import uniqueId from 'lodash/uniqueId'

import { IntegrateError } from './integration-handle/constants/integrationError'
import {
  BaseBackgroundIntegrationHandle,
  EvmBackgroundIntegrationHandle
} from './integration-handle/handle'
import type { BaseIntegrationRequest } from './integration-handle/types'
import { completeRequest, pushRequest, store } from 'store'
import { generateId } from '@wallet/screen/common/functions'
import { PORT_EVENT } from '~common/port'

// import { BitcoinBackgroundIntegrationHandle } from './integration-handle/handle/bitcoin'
// import { requestManager } from './services'
// import { AptosBackgroundIntegrationHandle } from './integration-handle/handle/aptos'
// import { SuiBackgroundIntegrationHandle } from './integration-handle/handle/sui'

interface WindowType {
  id: string
  // eslint-disable-next-line no-undef
  window: chrome.windows.Window
}

const engines = [
  EvmBackgroundIntegrationHandle
  // SolanaBackgroundIntegrationHandle,
  // CosmosBackgroundIntegrationHandle

  // BitcoinBackgroundIntegrationHandle,
  // AptosBackgroundIntegrationHandle,
  // SuiBackgroundIntegrationHandle
]

export class IntegrationRoutingV2 extends EventEmitter {
  // eslint-disable-next-line no-use-before-define
  static instance: IntegrationRoutingV2

  baseBackgroundIntegrationHandle: BaseBackgroundIntegrationHandle
  // eslint-disable-next-line no-undef
  windows: WindowType[] = []
  // eslint-disable-next-line no-undef
  port = new Map<any, chrome.runtime.Port>()

  throttle: any

  constructor () {
    super()
    if (IntegrationRoutingV2.instance) {
      return IntegrationRoutingV2.instance
    }
    IntegrationRoutingV2.instance = this

    // @ts-expect-error
    this.baseBackgroundIntegrationHandle = new BaseBackgroundIntegrationHandle(
      engines
    )
    // Watch for changes and get result from Strict Request

    // eslint-disable-next-line no-undef
    chrome.runtime.onConnect.addListener((connectedPort) => {
      // const PORT_NAME = 'Ramper:EventScript'
      if (connectedPort.name !== PORT_EVENT) return false

      const FORCE_ALIVE = 'FORCE_ALIVE'
      const timer = setInterval(() => {
        connectedPort.postMessage({
          name: FORCE_ALIVE,
          data: FORCE_ALIVE,
          id: FORCE_ALIVE,
          event: FORCE_ALIVE
        })
      }, 5000)

      const tabId = get(connectedPort, 'sender.tab.id') || generateId(true)
      const frameId = get(connectedPort, 'sender.frameId') || generateId(true)

      const portId = `${frameId}${tabId}`
      this.port.set(portId, connectedPort)

      connectedPort.onDisconnect.addListener((currentPort) => {
        const tabId = get(currentPort, 'sender.tab.id') || generateId(true)
        const portId = `${currentPort.sender.frameId}${tabId}`
        this.port.delete(portId)
        clearInterval(timer)
      })
    })

    // eslint-disable-next-line no-undef
    chrome.windows.onRemoved.addListener((windowId) => {
      const findWindows = this.windows.find((it) => it.window.id === windowId)
      if (findWindows?.id) {
        this.emit(findWindows.id, { error: IntegrateError.reject })
        store.dispatch(completeRequest(findWindows.id))
        // requestManager.complete(String(windowId))
      }
    })

    this.throttle = debounce(this.createWindow, 500, { maxWait: 2000 })
  }

  public handle = async <T extends BaseIntegrationRequest>(
    request: T
  ): Promise<any> => {
    const { id, sender, method } = request

    try {
      const isAuthorized =
        this.baseBackgroundIntegrationHandle.checkAuthorized(request)

      if (!isAuthorized) {
        return {
          error: IntegrateError.authorized
        }
      }

      const isStrictMethod =
        this.baseBackgroundIntegrationHandle.isStrictMethod(
          request,
          sender.origin
        )

      const requestId = (id || uniqueId()).toString()

      // console.log('isStrictMethod', isStrictMethod)

      if (isStrictMethod) {
        // const countRequest = await requestManager.getRequests() as any
        const { requests, currentMethod } = store.getState().integration

        // console.log('check methods', {requests, currentMethod, method});

        if (requests?.length > 0) {
          this.bringUpWindow()
          if ((currentMethod !== method) || method !== 'eth_requestAccounts') {
            return { error: IntegrateError.requestLimitExceed }
          }
          return new Promise((resolve) =>
            setTimeout(async () => {
              resolve(await this.handle(request))
            }, 250)
          )
        }

        store.dispatch(
          pushRequest({
            id: requestId,
            request: request as any
          })
        )
        // await requestManager.push({
        //   id: requestId,
        //   request: request as any
        // })

        return new Promise((resolve) => {
          this.once(requestId, resolve)
          // this.createWindow(requestId)
          this.throttle(requestId)
        })
      }

      const result = await this.baseBackgroundIntegrationHandle.handle(request)

      return result
    } catch (e) {
      console.log('handle integration err', e)
      const errors = get(e, 'message', 'error')
      return errors.toString()
    }
  }

  public createWindow = async (id: string) => {
    const countRequest = store.getState().integration.requests?.length
    if (countRequest < 1) return false
    // const countRequest = await requestManager.getRequests() as any
    // if (countRequest?.length < 1) return false
    // eslint-disable-next-line no-undef
    const popupUrl = chrome.runtime.getURL('popup.html?type=dapp-confirmation')
    // eslint-disable-next-line no-undef
    chrome.tabs.query({ url: popupUrl }, async (tabs) => {
      if (tabs.length > 0) {
        // Force focused tab or windows if opened
        // eslint-disable-next-line no-undef
        chrome.tabs.update(tabs[0].id, { active: true }).catch()
        // eslint-disable-next-line no-undef
        chrome.windows.update(tabs[0].windowId, { focused: true }).catch()
        return false
      }
      // eslint-disable-next-line no-undef
      const cWindow = await chrome.windows.create({
        url: popupUrl,
        type: 'panel',
        focused: true,
        // height: 625,
        // width: 365
        height: 670,
        width: 390
      })
      this.windows.push({
        id,
        window: cWindow
      })
    })
  }

  public bringUpWindow = () => {
    // eslint-disable-next-line no-undef
    const popupUrl = chrome.runtime.getURL('popup.html?type=dapp-confirmation')
    // eslint-disable-next-line no-undef
    chrome.tabs.query({ url: popupUrl }, async (tabs) => {
      if (tabs.length > 0) {
        // Force focused tab or windows if opened
        // eslint-disable-next-line no-undef
        chrome.tabs.update(tabs[0].id, { active: true }).catch()
        // eslint-disable-next-line no-undef
        chrome.windows.update(tabs[0].windowId, { focused: true }).catch()
        return false
      }
    })
  }
}
