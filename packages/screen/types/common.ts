import { type IconType } from '@wallet/ui'
import type {
  BaseIntegrationRequest,
  IntegrationRequestType,
  Wallet
} from '@wallet/core'

export enum StepType {
  From = 'from',
  To = 'to',
  Confirm = 'confirm'
}

export enum STAKE_STEP {
  Select = 'select',
  Review = 'review',
  Confirm = 'confirm'
}

export enum SORT_TYPE {
  APR = 'apr',
  ALPHABET = 'alphabet',
  AMOUNT_STAKED = 'amountStaked'
}

export type RecentAddressState = {
  wallet: Wallet | null
  address: string
}

export interface IToken {
  address: string
  cgkId: string
  chain: string
  decimal?: string | number
  isDefault?: boolean
  image?: string
  name: string
  symbol: string
  rawBalance?: string
  hidden?: boolean
  price?: any
}

export type TokenList = IToken[]

// All About Tokens & Wallets will be store here
export interface DisplayTokensParam {
  typeToken: string
  typeDisplay: string | boolean
}

export enum WalletType {
  Create = 'create',
  Restore = 'restore'
}

export type WalletParams = {
  type: WalletType
}

export type HistoryFromScreen = 'tokenDetail' | 'allHistory'

export type RequestType =
  IntegrationRequestType<BaseIntegrationRequest>['request']

export interface IListItem {
  key: string
  icon: IconType
  type?: string
  route?: string
  title?: string
  description?: string
}
