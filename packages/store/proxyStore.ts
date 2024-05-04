/* eslint-disable no-undef */
import EventEmitter from 'events'
import { persistConfig, store, type RootState } from '.'

export class ProxyStore extends EventEmitter {
  state: RootState
  key = `persist:${persistConfig.key}`
  constructor () {
    super()
    this.state = store.getState()

    // @ts-ignore
    chrome.storage.local.onChanged.addListener(changes => {
      if (changes[this.key]) {
        const rootState = JSON.parse(changes[this.key].newValue)
        const updateObject = {}
        Object.entries(rootState).forEach((entry) => {
          const [key, value] = entry
           // @ts-ignore
          updateObject[key] = typeof value === 'string' ? JSON.parse(value) : value
        })

        this.state = updateObject as RootState

        this.emit('subscribe', this.state)
      }
    })
  }

  init () {
    // @ts-ignore
    chrome.storage.local.get([this.key], (response) => {
      if (response[this.key]) {
        const rootState = JSON.parse(response[this.key])
        const updateObject = {}
        Object.entries(rootState).forEach((entry) => {
          const [key, value] = entry
           // @ts-ignore
          updateObject[key] = typeof value === 'string' ? JSON.parse(value) : value
        })

        this.state = updateObject as RootState
      }
    })
  }

  getState () {
    return this.state
  }

  subscribe (callback: any) {
    return this.on('subscribe', callback)
  }
}

export const proxyStore = typeof window !== 'undefined' ? store : new ProxyStore()
