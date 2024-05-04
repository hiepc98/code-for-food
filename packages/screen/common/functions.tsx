import { CHAIN_DATA } from '@wallet/constants'
import { formatNumberBro } from '@wallet/utils'
import { get } from 'lodash'

const ethUtil = require('ethereumjs-util')

interface signMsgParams {
  sig: any
  data: any
}

const getEndPointScan = (chain: string) => {
  const endpoint: any = {
    sei: 'txs',
    injective: 'transaction'
  }
  return endpoint[chain] || 'tx'
}

export const viewScan = (
  hash: string,
  isReturnScan?: boolean,
  chain: string = 'ether'
): string | Window | null => {
  // const url = `${CHAIN_DATA.sei.scan}/txs/${hash}`;
  const url = `${CHAIN_DATA[chain].scan}/${getEndPointScan(chain)}/${hash}`
  if (isReturnScan) {
    return url
  }
  return window.open(url)
}

export const formatSeiDenomToAddress = (denom: string) => {
  if (!denom) return
  if (denom.includes('/')) {
    return denom.replaceAll('/', '_')
  }
  return denom
}

export const sleep = (ms = 500) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve()
    }, ms)
  })
}

export const getLength = (str: any) => {
  if (!str) return 0
  if (typeof str === 'object' && !Array.isArray(str)) {
    return Object.keys(str).length
  }
  return str.length || 0
}

export const lowerCase = (value: string) => {
  return value && value?.toLowerCase ? value.toLowerCase() : value
}

export const upperCase = (value: string) => {
  return value ? value.toUpperCase() : value
}

export const generateId = (isNumbersOnly: boolean = false) => {
  let text = ''
  const possible = isNumbersOnly
    ? '0123456789'
    : 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < 16; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

export const isValidAddress = (address: string): boolean => {
  const reg = /^(0x)[0-9A-Fa-f]{40}$/
  return reg.test(address)
}

export const truncate = (
  original: string,
  options?: {
    length?: number
    separator?: string
  }
) => {
  const { length = 5, separator = '...' } = options || {}

  const strLength = original.length

  if (strLength < length) {
    return original
  }

  const firstCountLetter = original.slice(0, length)
  const lastCountLetter = original.slice(strLength - length, strLength)

  return `${firstCountLetter}${
    typeof separator === 'string' ? separator : '...'
  }${lastCountLetter}`
}

export const truncateText = (original: string, length: number = 5) => {
  if (!length) return original
  return original.length > length
    ? original.substring(0, length) + '...'
    : original
}
export const renderGasFee = (
  feeTxs?: number | string,
  tokens?: any,
  multiplier?: number
) => {
  const mainToken = tokens.find((item) => !item.address)
  let lasAmount: number | string = 0
  const price = get(mainToken, 'prices.price', null)
  if (price) {
    lasAmount = formatNumberBro(Number(feeTxs) * price * (multiplier || 1), 4)
  }
  return lasAmount
}

function recoverPublicKey(hash, sig) {
  const signature = ethUtil.toBuffer(sig)
  const sigParams = ethUtil.fromRpcSig(signature)
  return ethUtil.ecrecover(hash, sigParams.v, sigParams.r, sigParams.s)
}

function getPublicKeyFor(msgParams: signMsgParams) {
  const message = ethUtil.toBuffer(msgParams.data)
  const msgHash = ethUtil.hashPersonalMessage(message)
  return recoverPublicKey(msgHash, msgParams.sig)
}

export const recoverPersonalSignature = (msgParams: signMsgParams) => {
  const publicKey = getPublicKeyFor(msgParams)
  const sender = ethUtil.publicToAddress(publicKey)
  const senderHex = ethUtil.bufferToHex(sender)
  return senderHex
}

export const upperCaseFirstLetter = (lower) => {
  if (!lower) return lower;
  const upper = lower.replace(/^\w/, (chr) => chr.toUpperCase());
  return upper;
};

export const upperCaseAfterSpace = (str) => {
  const splitStr = str.toLowerCase().split(" ");
  const upperStr = splitStr.map((item) => upperCaseFirstLetter(item));
  return upperStr.join(" ");
};
