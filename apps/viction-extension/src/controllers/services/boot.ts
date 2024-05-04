import { nanoid } from '@reduxjs/toolkit'
import { mapSeries } from 'async'
import * as bip39 from 'bip39'
import { utils } from 'ethers'
import { onLoginUser, onUpdateDeviceId, onUpdateToken, store } from 'store'

import { BaseAdapter } from '~controllers/apis/BaseAPI'
// import { store } from '~controllers/stores/configureStore'
// import {
//   onLoginUser,
//   onUpdateDeviceId,
//   onUpdateToken
// } from '~controllers/stores/reducers/storages/userSlice'

// Boot Services
// User device specific token
const generateUserToken = async () => {
  const { user } = store.getState()
  const { authentication } = user
  const isTokenExist = user.authentication.token

  if (!isTokenExist) {
    const pathNode = utils.HDNode.fromMnemonic(
      bip39.generateMnemonic()
    ).derivePath("m/44'/60'/0'/0/948202")
    const spamToken = pathNode.privateKey
    store.dispatch(onLoginUser(spamToken))
  }

  let { deviceId } = user
  if (!deviceId) {
    deviceId = nanoid()
    store.dispatch(onUpdateDeviceId(deviceId))
  }

  if (!authentication.adapterToken) {
    const response: any = await BaseAdapter.post('user/device', {
      device: deviceId
    })

    if (response) {
      const {
        code: adapterToken,
        challenge: apiToken,
        verify: verifyToken = ''
      } = response
      store.dispatch(
        onUpdateToken({
          apiToken,
          adapterToken,
          verifyToken
        })
      )
    }
  }
}

// Migration Services
export const bootup = async () => {
  console.log('[Boot]: Starting....')
  const arrBoot = [generateUserToken]
  console.log('arrBoot', arrBoot)

  await mapSeries(arrBoot, async (func: Function) => await func())
  console.log('[Boot]: Complete')
}
