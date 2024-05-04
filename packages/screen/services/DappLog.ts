import {
  LibVersion,
  DappTransactionRecord,
  IntegrationTransaction
} from '../types'

class DappLog {
  private dappLogInstance: DappTransactionRecord
  static requiredKeys: (keyof DappTransactionRecord)[] = [
    'url',
    'method',
    'wallet',
    'meta',
    'chain',
    'os',
    'source'
  ]

  static emptyKeys: (keyof DappTransactionRecord)[] = ['hash']
  constructor() {
    this.dappLogInstance = {} as DappTransactionRecord
  }

  setOS = (os: string) => {
    this.dappLogInstance.os = os
    return this
  }

  setSource = (source: string) => {
    this.dappLogInstance.source = source
    return this
  }

  private isValidated = (): [result: boolean, missingKey?: string] => {
    for (const k of DappLog.requiredKeys) {
      const _k = k as keyof DappTransactionRecord
      if (
        this.dappLogInstance[_k] === null ||
        this.dappLogInstance[_k] === undefined
      ) {
        return [false, _k]
      }
    }
    for (const k of DappLog.emptyKeys) {
      const _k = k as keyof DappTransactionRecord
      if (!this.dappLogInstance[_k] && this.dappLogInstance[_k] !== '') {
        return [false, _k]
      }
    }
    return [true, undefined]
  }

  setTx = (dappTx: IntegrationTransaction) => {
    this.dappLogInstance.transaction = dappTx
    return this
  }

  setMeta = (lib: LibVersion[] | string, version: string) => {
    this.dappLogInstance.meta = {
      libVersion: lib,
      version: version
    }
    return this
  }

  setHash = (hash: string = '') => {
    this.dappLogInstance.hash = hash
    return this
  }

  setUrl = (url: string) => {
    this.dappLogInstance.url = url
    return this
  }

  setMethod = (method: string) => {
    this.dappLogInstance.method = method
    return this
  }

  setWallet = (senderAddress: string) => {
    this.dappLogInstance.wallet = senderAddress
    return this
  }

  setChain = (chain: string) => {
    this.dappLogInstance.chain = chain
    return this
  }

  finish = () => {
    const [valid, missingKey] = this.isValidated()
    if (!valid) {
      throw new Error(`dapp log is invalid, missing this field: ${missingKey}`)
    }
    return this.dappLogInstance
  }
}

export default DappLog
