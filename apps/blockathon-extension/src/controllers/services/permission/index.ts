import { IPermissionService, PutAccessParams, Wallet } from '@wallet/core'
import { store } from 'store'

// import {
//   onPutAccess,
//   onRemoveAccess
// } from '~src/controllers/Redux/reducers/Storages/userSlice'
// import { store } from '~src/controllers/Redux/store'
// import { IConnection } from '~src/controllers/types/authTypes'

class Permission implements IPermissionService {
  putAccess: (params: PutAccessParams) => void
  removeAccess: (origin: string, wallet: Wallet) => void
  get permissions() {
    const { connections } = store.getState().user.authentication
    return connections
  }

  isAccess(origin: string, wallet: Wallet): boolean {
    return this.permissions.some(
      (pms) =>
        pms.origin.startsWith(origin) &&
        pms.permissions.wallet.address === wallet.address
    )
  }

  // putAccess(params: PutAccessParams) {
  //   const { name, favicon, origin, wallet, accessList = ['full'] } = params

  //   const pmsPayload: IConnection = {
  //     // Temp name for
  //     name,
  //     origin,
  //     favicon,
  //     permissions: {
  //       chain: wallet?.meta.chain,
  //       wallet,
  //       accessList
  //     }
  //   }
  //   store.dispatch(onPutAccess(pmsPayload))
  // }

  // removeAccess(origin: string, wallet: Wallet) {
  //   store.dispatch(onRemoveAccess({ origin, wallet }))
  // }
}

export default Permission
