import type { Wallet } from '@wallet/core'

import { store } from '~controllers/stores/configureStore'

// import { proxyStore as store } from '~src/controllers/Redux/store/proxyStore'
import { IntegrationBackgroundEngine } from '../abstract'
// import { BaseIntegrationRequest } from '../types'
import { STRICT_METHODS } from '../constants/solana'
import type { BaseIntegrationRequest } from '../types'

export class SolanaBackgroundIntegrationHandle extends IntegrationBackgroundEngine {
  type: string = 'solana'
  chain: string

  private getCurrentWallet(): Wallet {
    const {
      user: { network },
      walletData: { activeWallet }
    } = store.getState()
    this.chain = network.solana.chain

    const currentWallet = activeWallet.wallets.find((wallet) => {
      return wallet.meta?.chain === this.chain
    })
    return currentWallet
  }

  isAuthorized() {
    return true
  }

  checkAccess(origin: string) {
    const {
      walletData: { activeWallet },
      user: {
        setting: { activeChain }
      }
    } = store.getState()
    const isChainActivated = activeChain.includes(this.type)
    if (!isChainActivated) return false
    if (!activeWallet.wallets.length) return false
    const isCanAccess = activeWallet.connections?.some(
      (connection) => connection.origin === origin
    )
    return isCanAccess
  }

  hasMethod(method: string) {
    const executeFunction = this[method]
    return executeFunction && typeof executeFunction === 'function'
  }

  isStrictMethod(request: BaseIntegrationRequest, origin: string): boolean {
    const methods = []
    switch (request.method) {
      case 'sol_accounts':
      case 'sol_requestAccounts': {
        const isCanAcess = this.checkAccess(origin)
        if (!isCanAcess) {
          methods.push('sol_requestAccounts', 'sol_accounts')
        }
      }
    }
    return !!STRICT_METHODS.concat(methods).includes(request.method)
  }

  isClient(type: string): boolean {
    return type === this.type
  }

  sol_accounts(request: BaseIntegrationRequest): string[] {
    const wallet = this.getCurrentWallet()
    const isCanAccess = this.checkAccess(request.sender.origin)

    return isCanAccess ? [wallet.address] : []
  }

  sol_requestAccounts(): string[] {
    const currentWallet = this.getCurrentWallet()
    return [currentWallet?.address]
  }
}
