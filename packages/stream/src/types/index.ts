export interface IStreamPayload<T = any> {
  id: string
  name?: string
  data: T
  sender?: chrome.runtime.MessageSender
}

export interface StreamPayload<T = any> {
  target: string
  payload: IStreamPayload<T>
  isCoin98: boolean
}

export class StreamPayloadItem implements StreamPayload {
  target: string
  payload: IStreamPayload
  isCoin98: boolean = true

  constructor (target: string, payload: IStreamPayload) {
    this.target = target
    this.payload = payload
  }

  santinize (): void {

  }
}
