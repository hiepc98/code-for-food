/*
Everything about custom
- Custom Network
- Custom Token
- Network Selection
- Web3 Selection
*/

import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import { TokenInfo } from '@wallet/core'
import uniqBy from 'lodash/uniqBy'

import { ICosmos, IEvm, INetwork } from '../../types'

export interface CustomState {
  network: INetwork
  token: Record<string, Partial<TokenInfo>[]>
}

export interface CustomTokenPayload {
  chain: string
  token: Partial<TokenInfo>
}

type CustomNetworkPayload =
  | {
      type: 'cosmos'
      data: ICosmos
    }
  | {
      type: 'evm'
      data: IEvm
    }

interface CustomRemoveNetworkPayload {
  type: 'cosmos' | 'evm'
  index: number
}

const initialState: CustomState = {
  network: {
    cosmos: [],
    evm: []
  },
  token: {}
}

export const customSlice = createSlice({
  name: 'custom',
  initialState,
  reducers: {
    onAddCustomToken: (state, action: PayloadAction<CustomTokenPayload>) => {
      const { chain, token } = action.payload

      const arrTokenChain = state.token[chain] || []
      const arrTokenNew = uniqBy([...arrTokenChain, token], (t) => t.address)
      state.token = { ...state.token, [chain]: arrTokenNew }
    },
    onRemoveCustomToken: (
      state,
      action: PayloadAction<Pick<CustomTokenPayload, 'token'>>
    ) => {
      const { token } = action.payload
      const { chain } = token
      if (!chain) return
      const arrTokenChain = state.token[chain] || []
      const arrTokenNew = arrTokenChain.filter(
        (t) => t.address !== token.address
      )
      state.token = { ...state.token, [chain]: arrTokenNew }
    },
    onUpdateCustomToken: (
      state,
      action: PayloadAction<Pick<CustomTokenPayload, 'token'>>
    ) => {
      const { token } = action.payload
      const { chain } = token
      if (!chain) return
      const arrTokenChain = state.token[chain] || []
      const findIndex = arrTokenChain.findIndex(
        (t) => t.address === token.address
      )
      arrTokenChain[findIndex] = token
      state.token = { ...state.token, [chain]: arrTokenChain }
    },
    onUpdateCustomNetwork: (
      state,
      action: PayloadAction<CustomNetworkPayload>
    ) => {
      const { type, data } = action.payload
      state.network[type].push(data as any)
    },
    onRemoveCustomNetwork: (
      state,
      action: PayloadAction<CustomRemoveNetworkPayload>
    ) => {
      const { type, index } = action.payload
      const oldNetwork = [...state.network[type]]
      const newNetwork = [
        ...oldNetwork.slice(0, index),
        ...oldNetwork.slice(index + 1)
      ]
      state.network[type] = newNetwork as any
    },
    onClearCustomToken: (state) => {
      state.token = {}
    },
    resetCustomSlice: () => {
      return initialState
    }
  }
})

export const {
  onAddCustomToken,
  onRemoveCustomToken,
  onUpdateCustomToken,
  onClearCustomToken,
  onUpdateCustomNetwork,
  onRemoveCustomNetwork,
  resetCustomSlice
} = customSlice.actions

export default customSlice.reducer
