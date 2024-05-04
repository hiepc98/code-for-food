import { type IntegrationRequestType } from '@wallet/core'
import { getChromeStorage, setChromeStorage } from '@wallet/utils'

export const RequestManagerKey = 'Blockathon:RequestManager'

export class RequestManager {
  requests: IntegrationRequestType[] = []

  push = (request: IntegrationRequestType) => {
    if (this.requests?.length > 0) return false
    // Tmp for single request
    this.requests = [request]
    return setChromeStorage(RequestManagerKey, this.requests)
  }

  complete = (_id: string) => {
    this.requests = []
    // const requests = getChromeStorage(RequestManagerKey)
    // return setChromeStorage(RequestManagerKey, this.requests)
    return setChromeStorage(RequestManagerKey, this.requests)
  }

  update = (requests: IntegrationRequestType[]) => {
    return setChromeStorage(RequestManagerKey, requests)
  }

  empty = () => {
    this.requests = []
  }

  getRequests = () => {
    return getChromeStorage(RequestManagerKey)
  }
}

export const requestManager = new RequestManager()
