import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'
import { Collection, Wallet, type IConnection, type TokenInfo } from '@wallet/core'
// import { lowerCase } from '@wallet/utils'
import uniqBy from 'lodash/uniqBy'

import type { TomoWallet, INftItem } from '../../types'

export interface CustomTokenPayload {
  chain: string
  token: Partial<TokenInfo>
}

// All About Tokens & Wallets will be store here
export interface DisplayTokensParam {
  typeToken: string
  typeDisplay: string | boolean
}
export interface WalletState {
  // Status
  isLoading: boolean
  isLoadingFetchOnly: boolean
  isReloadBalance: boolean
  // List of wallet
  wallets: TomoWallet[]
  activeWallet: TomoWallet
  //
  walletsByUser: any
  // Current tokens list
  tokens: any[]
  customTokens?: {}
  // Temp any list use for send screen only
  tokensFetchOnly?: any[]
  mainBalanceRaw: string
  totalBalance: string
  currentNFT?: INftItem
  listCollections?: Collection[]
  activeTypeDisplay?: DisplayTokensParam
  chainActive?: string
  manageHiddenTokenByUser: string[]
}

export interface ChangeProfileParams {
  address: string
  changes: {
    name?: string
    avatar?: string
    // Other for color or something
  }
}
export interface ActiveWalletParams {
  name: string
  chain?: string
  isActive: boolean
  isMulti?: boolean
}

export interface PutAccessParams {
  wallet: TomoWallet
  connection: IConnection
}

export interface RemoveAccessParams {
  wallet: TomoWallet
  connection: IConnection
}

export interface RenameParams {
  wallet: TomoWallet
  name: string
}

const initialState: WalletState = {
  isLoading: false,
  isLoadingFetchOnly: false,
  isReloadBalance: true,
  // @ts-ignore
  wallets: [],
  walletsByUser: {},
  // @ts-ignore
  activeWallet: null,
  tokens: [],
  customTokens: {},
  tokensFetchOnly: [],
  mainBalanceRaw: '0',
  totalBalance: '0',
  currentNFT: null,
  listCollections: [],
  manageHiddenTokenByUser: []
}

export const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    onLoadingState: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },

    onReloadBalance: (state, action: PayloadAction<boolean>) => {
      state.isReloadBalance = action.payload
    },
    // Ramper
    onImportWallet: (state, action: PayloadAction<TomoWallet>) => {
      if (action.payload) {
        // Encrypt Key
        state.wallets = [
          ...state.wallets.filter(
            (wallet) => wallet.address !== action.payload.address
          ),
          action.payload
        ]

        // Automatically active last import wallet
        state.activeWallet = action.payload
      }
    },
    onActiveWallet: (state, action: PayloadAction<TomoWallet>) => {
      state.activeWallet = action.payload
    },
    onUpdateWallet: (state, action: PayloadAction<ChangeProfileParams>) => {
      const { address, changes } = action.payload
      state.wallets = state.wallets.map((wallet) => {
        if (wallet.address === address) {
          const oldName = wallet.name
          const oldAvatar = wallet.avatar

          wallet.avatar = changes?.avatar ?? wallet.avatar
          wallet.name = changes?.name ?? wallet.name

          if (state.activeWallet?.name === oldName) {
            state.activeWallet = wallet
          }
          if (state.activeWallet?.avatar === oldAvatar) {
            state.activeWallet = wallet
          }
        }
        return wallet
      })
    },
    onMigrateWallet: (state, action: PayloadAction<TomoWallet[]>) => {
      state.wallets = action.payload
    },
    removeWallet: (state, action: PayloadAction<TomoWallet>) => {
      state.wallets = state.wallets.filter(
        (wallet) => wallet.address !== action.payload.address
      )

      delete state.walletsByUser[action.payload.address]
      // delete state.manageHiddenTokenByUser

      if (
        action.payload.address === state.activeWallet?.address &&
        state.wallets.length > 0
      ) {
        state.activeWallet = state.wallets[0]
      }
    },
    resetWalletSlice: () => {
      return initialState
    },
    saveTokens: (state, action) => {
      if (action.payload) {
        state.tokens = action.payload
      }
    },
    updateBalanceTokens: (state, action) => {
      state.tokens = state.tokens.map((token) => {
        const findToken = action.payload.find((newToken: any) => {
          if (token.address) {
            return newToken.address === token.address
          }
          return newToken.isMain && newToken.chain === token.chain // case main token
        })
        return findToken || token
      })
    },
    saveCustomTokens: (state, action: PayloadAction<CustomTokenPayload>) => {
      const { chain, token } = action.payload
      const arrTokenChain = state.customTokens && state.customTokens[chain] || []
      const arrTokenNew = uniqBy([...arrTokenChain, token], (t: any) => t.address)
      state.customTokens = { ...state.customTokens, [chain]: arrTokenNew }
    },
    // @ts-ignore
    onRemoveCustomToken: (
      state,
      action: PayloadAction<CustomTokenPayload, 'token'>
    ) => {
      const { token } = action.payload
      const { chain } = token

      if (!chain) return
      const arrTokenChain = state.customTokens && state.customTokens[chain] || []
      const arrTokenNew = arrTokenChain.filter(
        (t: any) => t.address.toLowerCase() !== (token.address || '').toLowerCase()
      )
      state.customTokens = { ...state.customTokens, [chain]: arrTokenNew }
      state.isReloadBalance = false
    },
    saveMainBalance: (state, action) => {
      state.mainBalanceRaw = action.payload
    },
    saveTotalBalance: (state, action) => {
      state.totalBalance = action.payload
    },
    onSaveCurrentNft: (state, action) => {
      if (action.payload) {
        state.currentNFT = action.payload
      }
    },

    onSaveListCollections: (state, action) => {
      if (action.payload) {
        state.listCollections = action.payload
      }
    },

    onDisplayTokens: (state, action) => {
      if (action.payload) {
        state.activeTypeDisplay = action.payload
      }
    },

    onUpdateTokenList: (state, action) => {
      const finalTokenList =
        uniqBy(
          [...action.payload, ...state.tokens],
          (token: any) => `${token.id}${token.name}`
        ) || []
      const cvTokenList = finalTokenList
        .map((token: any) => ({
          ...token,
          isMain: !token.address
        }))
        .filter(
          (token: any) =>
            token.isMain || (token.address && Number(token.rawBalance) !== 0)
        )
      state.tokens = cvTokenList.sort(
        (a: { prices: { total: any } }, b: { prices: { total: any } }) => Number(b.prices.total) - Number(a.prices.total)
      )
    },

    onResetTokenList: (state) => {
      state.tokens = []
    },

    onAddWalletsByUser: (state, action) => {
      if (action.payload.wallets.length) {
        const { wallets } = action.payload
        const newObj: any = {}
        if (state.walletsByUser) {
          state.walletsByUser[wallets[0].address] = wallets
        } else {
          newObj[wallets[0].address] = wallets
          state.walletsByUser = newObj
        }
      }
    },

    onUpdateWalletsByUser (state, action) {
      state.walletsByUser = action.payload
    },

    updateTokenHiddenByUser: (state, action) => {
      state.manageHiddenTokenByUser = action.payload
    },

    // Connection Support
    clearConnection: (state, action: PayloadAction<TomoWallet>) => {
      const { name } = action.payload
      state.wallets = state.wallets.map((currentWallet) => {
        if (name === currentWallet.name) {
          currentWallet.connections = []
          if (currentWallet.name === state.activeWallet?.name) {
            state.activeWallet = currentWallet
          }
        }

        return currentWallet
      })
    },
    putConnection: (state, action: PayloadAction<PutAccessParams>) => {
      const { wallet, connection } = action.payload
      state.wallets = state.wallets.map((currentWallet) => {
        if (currentWallet.name === wallet.name) {
          currentWallet.connections = currentWallet.connections || []
          currentWallet.connections = uniqBy(
            [...currentWallet.connections, connection],
            (cnn: any) => cnn.origin
          )

          if (currentWallet.name === state.activeWallet?.name) {
            state.activeWallet = currentWallet
          }
        }

        return currentWallet
      })
    },
    removeConnection: (state, action: PayloadAction<RemoveAccessParams>) => {
      const { wallet, connection } = action.payload
      state.wallets = state.wallets.map((currentWallet) => {
        if (wallet.name === currentWallet.name) {
          currentWallet.connections = currentWallet.connections.filter(
            (cnn) => cnn.origin !== connection.origin
          )

          if (currentWallet.name === state.activeWallet?.name) {
            state.activeWallet = currentWallet
          }
        }
        return currentWallet
      })
    }
  }
})

export const {
  onLoadingState,
  onReloadBalance,
  onImportWallet,
  onUpdateWallet,
  onMigrateWallet,
  onActiveWallet,
  removeWallet,
  resetWalletSlice,
  saveTokens,
  saveCustomTokens,
  onRemoveCustomToken,
  saveMainBalance,
  updateBalanceTokens,
  saveTotalBalance,
  onSaveCurrentNft,
  onSaveListCollections,
  onDisplayTokens,
  removeConnection,
  putConnection,
  clearConnection,
  onAddWalletsByUser,
  onUpdateTokenList,
  onResetTokenList,
  onUpdateWalletsByUser,
  updateTokenHiddenByUser
} = walletSlice.actions

export default walletSlice.reducer
