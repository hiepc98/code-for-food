import {
  makeADR36AminoSignDoc,
  verifyADR36AminoSignDoc
} from '@keplr-wallet/cosmos'
import {
  CHAIN_DATA,
  type Chain,
  ChainConfigsCosmos,
  ChainData,
  type Wallet
} from '@wallet/core'
import isBuffer from 'lodash/isBuffer'
import { publicKeyCreate as secp256k1PublicKeyCreate } from 'secp256k1'

import { encryptService } from '~controllers/services/encryption'
import { store } from '~controllers/stores/configureStore'

import { IntegrationBackgroundEngine } from '../abstract'
// import { BaseIntegrationRequest } from '../types'
import {
  BACKGROUND_METHODS,
  CONNECT_METHOD,
  STRICT_METHODS
} from '../constants/cosmos'
import type { BaseIntegrationRequest } from '../types'
import { encode, getAddressCosmosFromPrivateKey } from '../utils'

// import { proxyStore as store } from '~src/controllers/Redux/store/proxyStore'

const tou8 = (buf: any): any => {
  if (!buf) return undefined
  if (buf.constructor.name === 'Uint8Array' || buf.constructor === Uint8Array) {
    return buf
  }
  // eslint-disable-next-line n/no-deprecated-api
  if (typeof buf === 'string') buf = new Buffer(buf)
  const a = new Uint8Array(buf.length)
  for (let i = 0; i < buf.length; i++) a[i] = buf[i]
  return a
}

export class CosmosBackgroundIntegrationHandle extends IntegrationBackgroundEngine {
  type: string = 'cosmos'

  getWallet(chainId: string): Wallet {
    const {
      walletData: { activeWallet }
    } = store.getState()
    const chainInfo = this.getChainInfo(chainId)
    const findWallet = activeWallet.wallets.find(
      (w) => w.meta?.chain === chainInfo.chain
    )
    const decryptWallet = encryptService.decryptWallet(findWallet)
    return decryptWallet
  }

  checkAccess(origin: string): boolean {
    const {
      wallet: { activeWallet }
    } = store.getState()
    if (!activeWallet.wallets.length) return false
    const findWallet = activeWallet.wallets.find(
      (w) => CHAIN_DATA[w.meta?.chain]?.isFactory
    )
    const isCanAcess = activeWallet.connections?.some(
      (connection) => connection.origin === origin
    )
    return findWallet && isCanAcess
  }

  getChainInfo(chainId: string): Chain {
    const { network } = store.getState().custom
    const findChain = ChainData.concat(network.cosmos as any).find(
      (it) => it.chainId === chainId
    )
    return findChain
  }

  hasMethod(method: string): boolean {
    const executeFunction = this[method]
    return executeFunction && typeof executeFunction === 'function'
  }

  isStrictMethod(request: BaseIntegrationRequest, origin: string): boolean {
    const methods = []
    switch (request.method) {
      case 'experimentalSuggestChain': {
        const chainId = request.params[2].chainId
        const chainInfo = this.getChainInfo(chainId)
        if (!chainInfo) methods.push('experimentalSuggestChain')
        break
      }
      case 'enable':
      case 'getKey': {
        const isCanAcess = this.checkAccess(origin)
        if (!isCanAcess) methods.push('enable', 'getKey')
        break
      }
      default:
        break
    }

    return !!STRICT_METHODS.concat(methods).includes(request.method)
  }

  isClient(type: string): boolean {
    return this.type === type
  }

  enable = async () => {
    return true
  }

  isAuthorized(request: BaseIntegrationRequest) {
    if (BACKGROUND_METHODS.includes(request.method)) return true

    const isCanAcess = this.checkAccess(request.sender.origin)
    return !(!isCanAcess && !CONNECT_METHOD.includes(request.method))
  }

  getKey = (request: BaseIntegrationRequest) => {
    const chainId = request.params[0]
    const wallet = this.getWallet(chainId)
    const chainInfo = this.getChainInfo(chainId)

    const response = {
      name: wallet.name,
      algo: 'secp256k1',
      bech32Address: wallet.address,
      address: tou8(
        getAddressCosmosFromPrivateKey(
          wallet.privateKey as string,
          chainInfo.prefix,
          true
        )
      ),
      pubKey: secp256k1PublicKeyCreate(
        Buffer.from(wallet.privateKey as string, 'hex'),
        true
      ),
      isNanoLedger: false
    }
    if (typeof response === 'object') {
      Object.keys(response).forEach((k) => {
        if (isBuffer(response[k]) || ArrayBuffer.isView(response[k])) {
          response[k] = {
            isEncoded: true,
            encodedString: encode(response[k])
          }
        }
      })
    }

    return response
  }

  async verifyArbitrary(request: BaseIntegrationRequest) {
    const { params } = request
    try {
      // const chainId = params[0]
      const signer = params[1]
      let data = params[2]
      if (typeof data === 'object') {
        data = Buffer.from(data).toString('base64')
      }
      const signature = params[3]

      const [key] = await Promise.all([this.getKey(request)])
      const prefix = 'sei'
      const pubKey = key.pubKey

      if (signer !== key.bech32Address) {
        return {
          error: 'Signer mismatched'
        }
      }
      if (signature.pub_key.type !== 'tendermint/PubKeySecp256k1') {
        return {
          error: `Unsupported type of pub key: ${signature.pub_key.type}`
        }
      }

      if (Buffer.from(pubKey).toString('base64') !== signature.pub_key.value) {
        return {
          error: 'Pub key unmatched'
        }
      }
      const signDoc = makeADR36AminoSignDoc(signer, data)
      return verifyADR36AminoSignDoc(
        prefix,
        signDoc,
        Uint8Array.from(Buffer.from(signature.pub_key.value, 'base64')),
        Uint8Array.from(Buffer.from(signature.signature, 'base64'))
      )
    } catch (e) {
      console.log(e)
      return false
    }
  }

  getChainInfosWithoutEndpoints() {
    const { network } = store.getState().custom
    return ChainConfigsCosmos.concat((network?.cosmos as any) ?? [])
  }

  // No implemetation
  experimentalSuggestChain = () => {
    return true
  }
}
