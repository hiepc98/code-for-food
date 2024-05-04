import type { Wallet } from '@wallet/core'
import get from 'lodash/get'
import { BaseAdapter } from 'store/service/BaseAPI'
import { AxiosInstance } from 'axios'
import { store } from 'store'

export const postSyncWallet = async (wallet: Wallet) => {
  try {
    if (!wallet) return
    const { name, address, meta } = wallet
    const chain = get(meta, 'chain', 'ether')
    const activeNetwork = store.getState().setting.activeNetwork


    const req = {
      wallet: { chain: get(activeNetwork, 'chain'), address },
      name
    }

    const res = await BaseAdapter.post('wallet/sync', req)

    return res?.data
  } catch (error) {
    throw error
  }
  
}

export * from './encryption'
