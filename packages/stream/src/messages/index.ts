import { type StreamPayload, StreamPayloadItem, type IStreamPayload } from '../types'

interface StreamOptions {
  name: string
  target: string
  targetWindow?: Window | undefined
}

interface MessageEventInterface {
  name: EventName
  callback: (data?: any, writer?: Writer) => any
}

interface ContainerOptions {
  name: string
  instance: MessageStream
  context?: string
}

type EventName = 'data' | 'error'

interface IMessageStream {
  name: string
  target: string
  targetWindow: Window | undefined

  emit: (evName: string, payload: any) => void
  on: (evName: EventName, callback: (payload: any, writer?: Writer) => any) => void
  write: (payload: IStreamPayload) => void
}

interface IWriter {
  id: any
  stream: IMessageStream
  write: (data: any) => void
}

export class Writer implements IWriter {
  id: any
  stream: MessageStream
  constructor (id: any, stream: MessageStream) {
    this.id = id
    this.stream = stream
  }

  public write (data: any): void {
    this.stream.write({
      id: this.id,
      data
    })
  }
}

class MessageStreamContainer {
  protected msgStreamList = new Map<string, MessageStream>()
  protected window = typeof window !== 'undefined' ? window : globalThis
  protected context = new Set<string>()

  constructor (options: ContainerOptions) {
    const { name, instance } = options

    if (!this.msgStreamList.has(name)) {
      this.msgStreamList.set(name, instance)
    }

    const currentContext = this.getContext()

    if (!this.context.has(currentContext)) {
      this.context.add(currentContext)
      this.window.addEventListener('message', (ev: MessageEvent<StreamPayload>): any => {
        const { target, payload, isCoin98 } = ev.data
        if (!isCoin98) return false
        const targetInstance = this.getTargetInstance(target)
        if (targetInstance == null) return false
        const { name = 'data' } = payload
        targetInstance.emit(name, payload)
      })
    }
  }

  public getTargetInstance (name: string): MessageStream | undefined {
    return this.msgStreamList.get(name)
  }

  public getContext (): string {
    if (typeof chrome.runtime === 'undefined') {
      return 'in-page'
    }

    return 'content-script'
  }
}

export class MessageStream implements IMessageStream {
  public readonly name: string
  public readonly target: string
  public readonly targetWindow: Window | undefined
  private readonly events: MessageEventInterface[] = []
  // @ts-expect-error Init only
  private readonly container: MessageStreamContainer

  constructor (_options: StreamOptions) {
    const { name, target, targetWindow } = _options
    this.name = name
    this.target = target
    this.targetWindow = targetWindow
    this.container = new MessageStreamContainer({ name, instance: this })
  }

  public emit (evName: string, payload: any): void {
    const filteredEvent = this.events?.filter(e => e.name === evName) || []
    filteredEvent.forEach(ev => {
      const { id, data } = payload
      ev.callback(data, new Writer(id, this))
    })
  }

  public on (evName: EventName, callback: (payload: any, writer?: Writer) => any): void {
    this.events.push({
      name: evName,
      callback
    })
  }

  public write (payload: IStreamPayload): void {
    const writableData = new StreamPayloadItem(this.target, payload)
    window.postMessage(writableData, '*')
  }
}
