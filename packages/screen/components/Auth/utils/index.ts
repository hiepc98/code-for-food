import {
  resetIntegrationSlice,
  resetSettingSlice,
  resetUserSlice,
  resetWalletSlice,
  store
} from 'store'

export const resetAllReduxStore = () => {
  const arrFunc = [
    resetIntegrationSlice,
    // resetCustomSlice,
    resetSettingSlice,
    resetUserSlice,
    resetWalletSlice
  ]
  arrFunc.forEach((func :any) => {
    store.dispatch(func())
  })
}
