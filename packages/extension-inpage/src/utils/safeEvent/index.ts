import { EventEmitter } from 'events'
import { MessageStream } from '../../messageStream'
import type { ISafeEventOptions } from './types'
import { PORT_CONTENT, PORT_INPAGE } from '../contants/port'

export class SafeEvent extends EventEmitter {
  static stream?: MessageStream
  protected stream: MessageStream
  constructor (options?: ISafeEventOptions) {
    super()
    // Remove singleton pattern
    // if (SafeEvent.instance != null) {
    //   return SafeEvent.instance
    // }
    // SafeEvent.instance = this

    this.setMaxListeners(options?.maxListener ?? 100)

    if (!SafeEvent.stream) {
      SafeEvent.stream = new MessageStream({
        name: PORT_INPAGE,
        target: PORT_CONTENT
      })
    }

    SafeEvent.stream?.on('data', (data, writer) => {
      this.emit(writer?.id, data)
    })

    this.stream = SafeEvent.stream
  }
}
