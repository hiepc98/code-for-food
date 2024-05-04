// import customSlice from './customSlice'
// import feederSlice from './feederSlice'
import infoSlice from './infoSlice'
import integrationSlice from './integrationSlice'
import settingSlice from './settingSlice'
import userSlice from './userSlice'
import walletSlice from './walletSlice'

export * from './infoSlice'
export * from './integrationSlice'
export * from './settingSlice'
export * from './userSlice'
export * from './walletSlice'

export const storageReducers = {
  setting: settingSlice,
  user: userSlice,
  info: infoSlice,
  wallet: walletSlice,
  integration: integrationSlice
}
