import type { Wallet } from '@wallet/core'
import get from 'lodash/get'
import { BaseAdapter } from 'store/service/BaseAPI'
import { AxiosInstance } from 'axios'
import { store } from 'store'

import { BaseMessage } from 'store/service/BaseAPI'
const SOURCE = process.env.PLASMO_PUBLIC_SOURCE || 'C98VICSGWLS'

interface WalletCreateSync {
  wallets: Wallet[],
  deviceId: string,
  options: {
    isCreate: boolean
    kind: string
    isMultiChain: boolean
  }
}

export const postSyncWallet = async ({
  wallets,
  deviceId,
  options,
}: WalletCreateSync) => {
  try {
    if (!wallets || (Array.isArray(wallets) && wallets?.length === 0)) return
    // @ts-ignore
    await BaseMessage.register({
      wallets,
      multichain: get(options, 'isMultiChain'),
      hardwareWallet: false,
      deviceId, 
      kind: get(options, 'kind'),
      name: SOURCE,
      isCreate: get(options, 'isCreate', false),
    })
  
  } catch (error) {
    throw error
  }
  
}

export * from './encryption'
