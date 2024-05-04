import {
  type Chain,
  type DecryptedKey,
  Keyring,
  type KeyringGetWalletParams,
  Wallet
} from '@wallet/core'
import { Buffer } from 'buffer'

// import { store } from '~controllers/stores/configureStore'

import { encryptService } from '../encryption'
import { store } from 'store'

export class KeyringService extends Keyring {
  // eslint-disable-next-line no-use-before-define
  static instance: KeyringService
  constructor() {
    super()

    // Singleton
    if (KeyringService.instance) {
      return KeyringService.instance
    }

    KeyringService.instance = this
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getConfigRPC(_chain: string): string {
    throw new Error('Method not implemented.')
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getCurrentNetwork(_type?: string): Chain {
    throw new Error('Method not implemented.')
  }

  getCurrentWallet = (
    _chain: string,
    options?: KeyringGetWalletParams
  ): Wallet => {
    const { activeWallet } = store.getState().wallet

    if (!activeWallet || options?.isGetOriginal) return activeWallet

    const decryptedWallet = encryptService.decryptWallet(activeWallet)

    return decryptedWallet
  }

  getDecryptedKey = (chain: string): DecryptedKey => {
    const wallet = this.getCurrentWallet(chain)

    const originalPrivateKey = wallet.privateKey.toString()
    const santizedPrivateKey = originalPrivateKey.startsWith('0x')
      ? originalPrivateKey.slice(2)
      : originalPrivateKey

    return {
      privateKey: santizedPrivateKey,
      privateKeyBuffer: Buffer.from(santizedPrivateKey, 'hex'),
      mnemonic: wallet.mnemonic?.toString()
    }
  }
}
