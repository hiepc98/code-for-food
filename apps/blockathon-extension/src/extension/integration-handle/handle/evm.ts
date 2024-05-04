// import * as ethUtil from '@metamask/eth-sig-util'
import {
  type BaseIntegrationRequest,
  type Wallet
} from '@wallet/core'
// import { get } from 'lodash'
import Web3 from 'web3'

// import { recoverPersonalSignature } from '~common/functions'
// import { COIN98_SYSTEM } from '../constants/internal'
// import { proxyStore as store } from '~src/controllers/Redux/store/proxyStore'
import { encryptService } from '~controllers/services/encryption'
import { store } from 'store'

import { IntegrationBackgroundEngine } from '../abstract'
import { STRICT_METHODS } from '../constants/evm'
import { recoverPersonalSignature } from '@wallet/screen/common/functions'
import { IntegrateError } from '../constants/integrationError'

export class EvmBackgroundIntegrationHandle extends IntegrationBackgroundEngine {
  type: string = 'evm'
  chain: string

  private getCurrentWallet (): Wallet {
    const {
      setting: { activeNetwork },
      // custom: {
      //   network: customNetwork
      // },
      wallet: { activeWallet }
    } = store.getState()
    this.chain = activeNetwork.chain

    // console.log('activeWallet', { activeWallet, activeNetwork, chain: this.chain })

    // const activeChain = get(activeNetwork, 'chain', 'evm')

    // const chainsCustom = customNetwork?.evm ? customNetwork.evm.map(item => item.chain) : []

    // const currentWallet = activeWallet.wallets.find(wallet => {
    //   return wallet.meta?.chain === this.chain && (activeChain.includes(this.chain) || chainsCustom.includes(this.chain))
    // })
    // if (!currentWallet) return undefined
    const decryptedWallet = encryptService.decryptWallet(activeWallet)

    return decryptedWallet
  }

  checkAccess (origin: string) {
    const {
      wallet: { activeWallet }
    } = store.getState()

    if (!activeWallet) return false

    const isCanAcess = activeWallet.connections?.some((connection) =>
      connection.origin.includes(origin)
    )
    return isCanAcess
  }

  isAuthorized (request: BaseIntegrationRequest) {
    const isCanAcess = this.checkAccess(request.sender.origin)

    // return !(!isCanAcess && !STRICT_METHODS.includes(request.method))
    return isCanAcess || !STRICT_METHODS.includes(request.method)
  }

  isStrictMethod (request: BaseIntegrationRequest, origin: string): boolean {
    const { activeNetwork } = store.getState().setting
    const { customTokens: token } = store.getState().wallet
    this.chain = activeNetwork?.chain

    const methods = []
    switch (request.method) {
      case 'wallet_watchAsset': {
        const { options } = request.params as any
        const findToken = token[this.chain]?.find(
          (it) => it.address.toLowerCase() === options?.address.toLowerCase()
        )
        if (!findToken) {
          methods.push(request.method)
        }
        break
      }
      case 'wallet_switchEthereumChain': {
        // singlechain -> no network switch for now

        // const { chainId } = request.params[0]
        // const isCurrentChain = this.checkNetwork(chainId)

        // if (!isCurrentChain) {
        //   methods.push('wallet_switchEthereumChain')
        // }
        break
      }
      case 'eth_requestAccounts': {
        console.log('do eth_requestAccounts')

        const isCanAcess = this.checkAccess(origin)

        console.log('isCanAcess', isCanAcess)

        if (!isCanAcess) {
          methods.push('eth_requestAccounts')
        }
        break
      }
      case 'wallet_addEthereumChain': {
        // const { network } = store.getState().setting

        // const { chainId } = request.params[0]

        // const chainList = ChainData.concat(network.evm as unknown as Chain)
        // const findChain = chainList.find(it => it.chainId === chainId)
        // if (findChain) {
        //   const isCurrentChain = this.checkNetwork(chainId)
        //   if (!isCurrentChain) {
        //     request.method = 'wallet_switchEthereumChain'
        //     methods.push('wallet_switchEthereumChain')
        //   }
        // } else {
        //   methods.push('wallet_addEthereumChain')
        // }
        break
      }
      case 'eth_accounts': {
        // const isInternal = COIN98_SYSTEM.some(url => origin.includes(url))
        // if (isInternal) {
        //   const isCanAcess = this.checkAccess(origin)
        //   if (!isCanAcess) {
        //     request.method = 'eth_requestAccounts'
        //     methods.push('eth_requestAccounts')
        //   }
        // }
        // methods.push('eth_accounts')

        request.method = 'eth_accounts'
        break
      }
      default:
        break
    }

    return !!STRICT_METHODS.concat(methods).includes(request.method)
  }

  isClient (type: string) {
    return type === this.type
  }

  hasMethod (method: string) {
    const executeFunction = this[method]
    return executeFunction && typeof executeFunction === 'function'
  }

  checkNetwork (chainId: string) {
    const { activeNetwork } = store.getState().setting
    if (!activeNetwork) return false
    return activeNetwork.chainId === chainId
  }

  get_chainId () {
    // const { network } = store.getState().user
    // return network.evm.chainId
    try {
      const { activeNetwork } = store.getState().setting
      return activeNetwork.chainId
    } catch (e) {
      return null
    }
  }

  wallet_switchEthereumChain () {
    // return true
    throw IntegrateError.resourceNotFound
  }

  eth_accounts (request: BaseIntegrationRequest) {
    // const wallet = this.getCurrentWallet()
    const { activeWallet } = store.getState().wallet
    const isCanAccess = this.checkAccess(request.sender.origin)
    const address = activeWallet?.address.toLowerCase()
    return isCanAccess ? [address] : []
  }

  eth_requestAccounts () {
    const currentWallet = this.getCurrentWallet()
    const address = currentWallet?.address.toLowerCase()
    return [address]
  }

  wallet_getPermissions (request: BaseIntegrationRequest) {
    const currentWallet = this.getCurrentWallet()
    const response = [
      {
        caveats: [
          { type: 'restrictReturnedAccounts', value: [currentWallet.address] }
        ],
        date: new Date().getTime(),
        id: request.id,
        invoker: request.sender.origin,
        parentCapability: 'eth_accounts'
      }
    ]
    return response
  }

  personal_ecRecover (request: BaseIntegrationRequest) {
    try {
      const [msgParams, signature] = request.params

      // const recoveredAddress = ethUtil.recoverPersonalSignature({
      //   data: Web3.utils.toHex(msgParams),
      //   signature
      // })

      const recoveredAddr = recoverPersonalSignature({
        data: Web3.utils.toHex(msgParams),
        sig: signature
      })

      return recoveredAddr
    } catch (e) {
      console.log('err rui', e)
    }
  }
  // Extension Exclusive Request info

  // Start: Internal Dapp
  // Code convention break for this kidn of method, others people does not follow this code
  // public connect_coin98 = () => {
  //   const { user } = store.getState()
  //   console.log('🐳 -> user', user)
  //   return user.deviceId
  // }

  // public sync_wallet = () => {
  //   const { walletData } = store.getState()
  //   const { originalWallets, activeWallet } = walletData

  //   const resultWallets = originalWallets.slice().map(walletData => {
  //     return walletData.wallets.slice().map(it => {
  //       return { ...it, chain: it.meta?.chain, isHardwareWallet: !!it.meta?.hardware, isActive: !!activeWallet.wallets.find(wallet => wallet.address === it.address) }
  //     })
  //   }).flat().filter(item => item)

  //   console.log('resultWallets', resultWallets.filter(it => it.name === '21'))

  //   return resultWallets
  // }

  // public get_type_password = () => {
  //   const { user } = store.getState()
  //   return user.authentication.type
  // }

  // public get_session = () => {
  //   const { user } = store.getState()
  //   return !user.authentication.isLock
  // }

  // public compare_passwords = (request: BaseIntegrationRequest) => {
  //   const { type, password } = request.params as any
  //   return authenticateService.unlock(type, password)
  // }

  // public active_wallet = () => {
  //   // Disable for security reason
  //   return true
  // }

  // public aes_decrypt_coin98 = async (request: BaseIntegrationRequest) => {
  //   const { data, deviceId, uuid } = request.params as never as any
  //   // Check deviceId, uuid
  //   console.log('decrypt for ', { deviceId, uuid })
  //   return encryptService.decrypt(data)
  // }
}
