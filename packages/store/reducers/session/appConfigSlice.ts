import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export type KeyTab = 'home' | 'nft' | 'swap' | 'services' | 'connection'

export interface AppState {
  keyTabActive: KeyTab
  isHideBalance: boolean
}

export const initialState: AppState = {
  keyTabActive: 'home',
  isHideBalance: false
}

export const appSlice = createSlice({
  name: 'AppConfig',
  initialState,
  reducers: {
    toggleHideBalance: (state) => {
      state.isHideBalance = !state.isHideBalance
    },
    onChangeTabActive: (state, action: PayloadAction<KeyTab>) => {
      state.keyTabActive = action.payload
    }
  }
})

export const { onChangeTabActive, toggleHideBalance } = appSlice.actions

export const AppConfigReducer = appSlice.reducer
