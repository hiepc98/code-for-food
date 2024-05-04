import { type PayloadAction, createSlice } from '@reduxjs/toolkit'
import type { Chain } from '@wallet/core'

import { DefaultNetworks } from '../../constants'
import type { ThemeType } from '../../types'

export interface ISettingResponse {
  networks: Chain[]
  activeNetwork?: Chain
}

export interface SettingState extends ISettingResponse {
  language: string
  showBalance: boolean

  theme: ThemeType

  notification: boolean
  showSmallBalance: boolean
  showUnknownTokens: boolean

  lastForce?: {
    chainId: string
    rpc: string
  }
  // Loading State
  isFetchingSetting: boolean
  isGetStarted: boolean
  isFullScreen: boolean
}

export const initialState: SettingState = {
  networks: DefaultNetworks,
  activeNetwork: DefaultNetworks[0],
  language: 'en',
  showBalance: true,

  theme: 'dark',

  notification: true,
  showSmallBalance: true,
  showUnknownTokens: true,

  // Status
  isFetchingSetting: false,
  isGetStarted: false,
  isFullScreen: false
}

export const settingSlice = createSlice({
  name: 'setting',
  initialState,
  reducers: {
    onChangeLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload
    },
    onUpdateNetworks: (state, action: PayloadAction<Chain[]>) => {
      state.networks = action.payload
    },
    onSelectNetwork: (state, action: PayloadAction<Chain>) => {
      state.activeNetwork = action.payload
    },
    onToggleBalance: (state) => {
      state.showBalance = !state.showBalance
    },
    onChangeTheme: (state, action: PayloadAction<ThemeType>) => {
      state.theme = action.payload
    },
    onChangeNotification: (state) => {
      state.notification = !state.notification
    },
    onChangeShowSmallBalance: (state) => {
      state.showSmallBalance = !state.showSmallBalance
    },
    onChangeShowUnknownTokens: (state) => {
      state.showUnknownTokens = !state.showUnknownTokens
    },
    onChangeGetStarted: (state, action: PayloadAction<boolean>) => {
      state.isGetStarted = action.payload
    },
    onChangeFullScreen: (state, action: PayloadAction<boolean>) => {
      state.isFullScreen =  action.payload
    },
    resetSettingSlice: () => {
      return initialState
    }
  }
})

export const {
  onChangeLanguage,
  onUpdateNetworks,
  onSelectNetwork,
  resetSettingSlice,
  onToggleBalance,
  onChangeTheme,
  onChangeNotification,
  onChangeShowSmallBalance,
  onChangeShowUnknownTokens,
  onChangeGetStarted,
  onChangeFullScreen
} = settingSlice.actions

export default settingSlice.reducer
