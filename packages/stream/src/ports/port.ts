import uniqueId from 'lodash/uniqueId'
import { type IStreamPayload, StreamPayloadItem, type StreamPayload } from '../types'
type ContextType = 'CS' | 'BGSW'

interface IPortStream {
  name: string
  target: string
}

interface PortStreamOption {
  name: string
  target: string
  context: ContextType
}

interface PortStreamContainerOptions {
  name: string
  instance: PortStream
  context: ContextType
}

type EventName = 'data' | 'error' | string

type EventListener = (data?: any, writer?: PortWriter, sender?: chrome.runtime.MessageSender | undefined) => any

interface PortEventInterface {
  id?: string
  name: EventName
  callback: EventListener
  isOnce?: boolean
}

interface IPortWriter {
  id: any
  stream: PortStream
  write: (data: any, sender: chrome.runtime.MessageSender) => void
}

class PortWriter implements IPortWriter {
  id: any
  stream: PortStream
  constructor (id: string, stream: PortStream) {
    this.id = id
    this.stream = stream
  }

  public write (data: any, sender: chrome.runtime.MessageSender): any {
    const tabId = sender.tab?.id
    const port = this.stream.getPort(tabId)
    const streamPayload = new StreamPayloadItem(this.stream.target, {
      id: this.id,
      name: this.id,
      data,
      sender: port.sender
    })
    port.postMessage(streamPayload)
  }
}

class PortStreamContainer {
  protected streams = new Map<string, PortStream>()
  protected ports = new Map<any, chrome.runtime.Port>()
  static instance: PortStreamContainer
  constructor (options: PortStreamContainerOptions) {
    const { name, instance, context } = options

    if (!this.streams.has(name)) {
      this.streams.set(name, instance)
    }

    if (PortStreamContainer.instance) {
      return PortStreamContainer.instance
    }

    if (context === 'BGSW') {
      chrome.runtime.onConnect.addListener(connectPort => {
        connectPort.onMessage.addListener((message: StreamPayload, currentPort): any => {
          if (!currentPort.name.includes('Coin98')) return false
          this.ports.set(currentPort.sender?.tab?.id, connectPort)
          const { target, payload } = message
          const targetInstance = this.getTargetInstance(target)

          if (!targetInstance) return false

          const { sender } = currentPort
          targetInstance.emit(payload.name ?? 'data', payload, sender)
        })

        connectPort.onDisconnect.addListener(currentPort => {
          this.ports.delete(currentPort.sender?.tab?.id)
        })
      })
    } else {
      instance.port?.onMessage.addListener((message: StreamPayload, currentPort): any => {
        const { target, payload } = message
        const targetInstance = this.getTargetInstance(target)

        if (!targetInstance) return false
        targetInstance.emit(payload.name ?? 'data', payload, currentPort.sender)
      })
    }

    PortStreamContainer.instance = this
    return this
  }

  public getTargetInstance (name: string): PortStream | undefined {
    return this.streams.get(name)
  }

  public getTargetPort (name: string | number): chrome.runtime.Port | undefined {
    return this.ports.get(name)
  }

  public write (name: string, _target: string, _payload: any): any {
    const _stream = this.streams.get(name)
    if (!_stream) return false
  }
}

export class PortStream implements IPortStream {
  name: string
  target: string
  public readonly container: PortStreamContainer
  public port: chrome.runtime.Port | undefined
  private readonly events: PortEventInterface[] = []
  private readonly context: ContextType
  constructor (options: PortStreamOption) {
    const { name, target, context } = options
    this.name = name
    this.target = target
    this.context = context

    if (this.context === 'CS') {
      this.autoReconnect(name)
      // this.port = chrome.runtime.connect({ name })

      // this.port.onDisconnect.addListener(() => {
      //   console.log('disconnect')
      //   this.port = chrome.runtime.connect({ name })
      // })
    }

    this.container = new PortStreamContainer({ name, instance: this, context })
  }

  public emit (evName: string, payload: any, sender?: chrome.runtime.MessageSender): void {
    const filteredEvent = this.events?.filter(e => e.name === evName)
    const onceIds: string[] = []
    filteredEvent.forEach((ev) => {
      const { id, data } = payload
      ev.callback(data, new PortWriter(id, this), sender)
      if (ev.isOnce) {
        onceIds.push(ev.id as string)
        this.events.splice(this.events?.findIndex(e => e.id === ev.id), 1)
      }
    })
  }

  public on (evName: EventName, callback: EventListener): void {
    this.events.push({ id: uniqueId(), name: evName, callback })
  }

  public once (evName: EventName, callback: EventListener): void {
    this.events.push({ id: uniqueId(), name: evName, isOnce: true, callback })
  }

  public async write (payload: IStreamPayload): Promise<any> {
    const _port = this.getPort()

    return await new Promise((resolve, _reject) => {
      this.once(String(payload.id), data => {
        resolve(data)
      })
      // Dispatching Event
      // Make sure that portstream will handle data for both cs & bgsw
      const payloadItem = new StreamPayloadItem(this.target, payload)
      _port.postMessage(payloadItem)
    })
  }

  public getPort (tabId?: string | number): chrome.runtime.Port {
    const port = this.context === 'CS' ? this.port : this.container.getTargetPort(tabId ?? this.name)
    if (port) {
      return port
    }
    throw new Error('Port does not exists')
  }

  public autoReconnect = (name: string): void => {
    this.port = chrome.runtime.connect({ name })

    this.port.onDisconnect.addListener(() => {
      this.autoReconnect(name)
    })
  }
}
