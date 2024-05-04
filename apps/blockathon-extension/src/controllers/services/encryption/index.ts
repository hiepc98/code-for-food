import { Wallet } from '@wallet/core'
import crypto from 'crypto-js'

// import { Wallet } from '~controllers/core/wallet'
import { store } from 'store'

/* !TODO:
 Old Compatible first then upgrade later
 Huge update will come to town :)
 Migration Button is required for this functions;
*/

interface IEncryptOptions {
  salt?: string
  usingPassword?: boolean
}

class Encryption {
  encoder: any = crypto.enc.Utf8

  public encrypt = (
    value: string,
    options: IEncryptOptions = { usingPassword: true }
  ): string => {
    const { password, token } = this.requireUserInformation()

    if (!options.usingPassword) {
      return crypto.AES.encrypt(value, token).toString()
    }
    try {
      const salt =
        options?.salt ??
        crypto.AES.decrypt(password, token).toString(this.encoder)
      return crypto.AES.encrypt(value, salt).toString()
    } catch (e) {
      console.log(e)
    }
  }

  public decrypt = (
    value: string,
    options: IEncryptOptions = { usingPassword: true }
  ): string => {
    const { token, password } = this.requireUserInformation()

    if (!options.usingPassword) {
      return crypto.AES.decrypt(value, token).toString(this.encoder)
    }
    try {
      const salt =
        options?.salt ??
        crypto.AES.decrypt(password, token).toString(this.encoder)
      return crypto.AES.decrypt(value, salt).toString(this.encoder)
    } catch (e) {
      console.log(e)
      return null
    }
  }

  private requireUserInformation = (): { password: string; token: string } => {
    // Get password from storage first
    const { password, token } = store.getState().user.authentication

    return { password, token }
  }

  // Utilities functions
  public decryptWallet = (
    wallet: Wallet,
    isInitialized: boolean = true
  ): Wallet => {
    // check if is initialized, if yes, then using password, otherwise, false
    const privateKey = this.decrypt(wallet.privateKey as string, {
      usingPassword: isInitialized
    })
    const mnemonic = this.decrypt(wallet.mnemonic as string, {
      usingPassword: isInitialized
    })
    return Wallet.fromObject({ ...wallet, privateKey, mnemonic })
  }
}

export const encryptService = new Encryption()
