import uniqueId from 'lodash/uniqueId'
import { type IStreamPayload } from '../types'

export interface PortStreamOptions {
  name: string
  target: string
}

export interface Message<T = any> {
  target: string
  data: T
}

export interface PortEventInterface {
  id?: string
  name: string
  callback: EventListener
  isOnce?: boolean
}

export type Responsder = (...args: any) => any

export type EventListener = (data?: any, writer?: Responsder, sender?: chrome.runtime.MessageSender | undefined) => any

export class MessagePortStream {
  name: string
  target: string
  private readonly events: PortEventInterface[] = []

  constructor (options: PortStreamOptions) {
    this.name = options.name
    this.target = options.target
  }

  public handle (message: Message, sender: any, response: any): any {
    if (message.target === this.name) {
      this.emit('data', message.data, sender, response)
    }
  }

  public emit (evName: string, payload: any, sender?: chrome.runtime.MessageSender, writer?: Responsder): void {
    const filteredEvent = this.events?.filter(e => e.name === evName)
    const onceIds: string[] = []
    filteredEvent.forEach((ev) => {
      const { data } = payload
      ev.callback(data, writer, sender)
      if (ev.isOnce) {
        onceIds.push(ev.id as string)
        this.events.splice(this.events?.findIndex(e => e.id === ev.id), 1)
      }
    })
  }

  public on (evName: string, callback: EventListener): void {
    this.events.push({ id: uniqueId(), name: evName, callback })
  }

  public once (evName: string, callback: EventListener): void {
    this.events.push({ id: uniqueId(), name: evName, isOnce: true, callback })
  }

  public async write (data: IStreamPayload): Promise<any> {
    return await (new Promise(resolve => {
      chrome.runtime.sendMessage({
        target: this.target,
        data
      }, response => {
        resolve(response)
      })
    }))
  }
}
