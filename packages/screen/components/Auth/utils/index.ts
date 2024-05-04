import {
  resetIntegrationSlice,
  resetSettingSlice,
  resetUserSlice,
  resetWalletSlice,
  store
} from 'store'

export const extract2D = function extract2d(array, x1, y1, x2, y2) {
  const result = []
  for (let y = y1; y <= y2; y++) {
    result.push(array[y].slice(x1, x2))
  }
  return result
}

export const resetAllReduxStore = () => {
  const arrFunc = [
    resetIntegrationSlice,
    // resetCustomSlice,
    resetSettingSlice,
    resetUserSlice,
    resetWalletSlice
  ]
  arrFunc.forEach((func) => {
    store.dispatch(func())
  })
}
