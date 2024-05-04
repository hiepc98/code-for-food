import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import type { Wallet } from '@wallet/core'
import get from 'lodash/get'

import { CHAIN_SUPPORT } from '../../constants'
import { BaseAPI, InfoAPI } from '../../service/BaseAPI'

export type RecentAddressState = {
  wallet: Wallet
  address: string
}
export interface ChainInfoState {
  defaultTokens: any[]
  services: any[]

  rpcConfig: Record<string, string>
  coinLocal: Record<string, any[]>
  coinGecko: any[]
  nftLocal: Record<string, any[]>


  // Main Crypto Price
  bitcoin: number
  ethereum: number
  recentContactList: any
}

const initialState: ChainInfoState = {
  defaultTokens: [],
  services: [],

  rpcConfig: {},
  coinLocal: {},
  coinGecko: [],
  nftLocal: {},


  bitcoin: 0,
  ethereum: 0,

  recentContactList: {}
}

// export const getRpcSetting = createAsyncThunk('info/RpcSetting', async (options, thunkAPI) => {
//   try {
//     const response: any[] = await BaseAPI.get('settingV6')
//     // @ts-expect-error
//     return response || thunkAPI.getState().info.rpcConfig
//   } catch (e) {
//     return []
//   }
// })

export const getCoinLocal = createAsyncThunk(
  'info/CoinLocal',
  async (options, thunkAPI) => {
    try {
      const response: any = await InfoAPI.get('/coinLocal')

      // const solanaTokens: any = await BaseAPI.get('/solanaToken')
      // const formatSolTokens = solanaTokens.map((item) => ({
      //   ...item,
      //   address: get(item, 'mintAddress', ''),
      //   image: get(item, 'icon'),
      //   chain: 'solana'
      // }))

      // const { data: networks } = await (await fetch(`${process.env.PLASMO_PUBLIC_API}/baryon/token/list?chain=binanceSmart`)).json()

      if (response.data) {
        const dataObj = response.data

        // return object with key is chain name and value is array of token from dataObj
        const finalData = Object.keys(dataObj).reduce((acc, key) => {
          if (CHAIN_SUPPORT.includes(key)) {
            acc[key] = dataObj[key]
          }
          return acc
        }, {})

        return finalData
      }
      // @ts-expect-error
      return thunkAPI.getState().info.coinLocal
    } catch (e) {
      return []
    }
  }
)

export const getCoinGeckoPrices = createAsyncThunk(
  'info/CoinGeckoPrices',
  async (options, thunkAPI) => {
    try {
      const response: any = await InfoAPI.get('/coinGecko')
      if (!response) return []
      // return response
      // @ts-expect-error
      return response.data || thunkAPI.getState().info.coinGecko
    } catch (e) {

      console.log('err', e);
      
      return []
    }
  }
)

export const getNftLocal = createAsyncThunk(
  'info/NftSupport',
  async (options, thunkAPI) => {
    try {
      const response: any[] = await BaseAPI.get('nft/supported/v2')
      // @ts-expect-error
      return response || thunkAPI.getState().info.nftLocal
    } catch (e) {
      console.log({e})
      return []
    }
  }
)

export const infoSlice = createSlice({
  name: 'info',
  initialState,
  reducers: {
    updateListRecentContact: (state, action) => {
      const { address, data } = action.payload
      state.recentContactList[address] = data
    },
    clearRecentContactByAddress: (state, action) => {
      delete state.recentContactList[action.payload]
    }
  },

  extraReducers: (builder) => {
    builder.addCase(
      getCoinGeckoPrices.fulfilled,
      (state, action: PayloadAction<any[]>) => {
        state.coinGecko = action.payload
      }
    )
    builder.addCase(
      getCoinLocal.fulfilled,
      (state, action: PayloadAction<Record<string, any[]>>) => {
        state.coinLocal = action.payload
      }
    )
    builder.addCase(
      getNftLocal.fulfilled,
      (state, action: any) => {
        state.nftLocal = action.payload
      }
    )
  }
})

export const { updateListRecentContact, clearRecentContactByAddress } =
  infoSlice.actions

export default infoSlice.reducer
