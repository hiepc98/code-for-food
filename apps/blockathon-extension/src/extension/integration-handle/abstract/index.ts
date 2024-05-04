// import { proxyStore as store } from '~src/controllers/Redux/store/proxyStore'
import { store } from 'store'

import type { BaseIntegrationRequest } from '../types'

// import { BaseIntegrationRequest } from '../types'

export abstract class IntegrationBackgroundEngine {
  abstract isAuthorized(request: BaseIntegrationRequest): boolean
  abstract hasMethod(method: string): boolean
  abstract isStrictMethod(
    request: BaseIntegrationRequest,
    origin: string
  ): boolean

  abstract isClient(type: string): boolean

  checkAccess (origin: string) {
    const { activeWallet } = store.getState().wallet
    if (!activeWallet) return false
    const isCanAccess = activeWallet.connections?.some(
      (connection) => connection.origin === origin
    )
    return isCanAccess
  }
}
