import type { Wallet } from '@wallet/core'
import { get } from 'lodash'
import isEqual from 'lodash/isEqual'
import uniqWith from 'lodash/uniqWith'
import { RecentAddressState, clearRecentContactByAddress, updateListRecentContact, useAppDispatch, useAppSelector } from 'store'
// import { useDispatch } from 'react-redux'

// import { useWallet } from '~controllers/contexts/WalletContext'
// import { useAppSelector } from '~controllers/stores/configureStore'
// import {
//   type RecentAddressState,
//   clearRecentContactByAddress,
//   updateListRecentContact
// } from '~controllers/stores/reducers/storages/infoSlice'

const useReceiveAddress = () => {
  const dispatch = useAppDispatch()
  const [recentContactList, activeWallet] = useAppSelector(
    (state) => [state.info.recentContactList, state.wallet.activeWallet]
  )

  const addRecentContact = (data: RecentAddressState) => {
    const { wallet, address } = data

    const engines = window.walletServices.getChainEngine(get(wallet, 'meta.chain', 'vic'))
    const networkType = engines && engines.constructor.name
    const newItem = { networkType, address }

    const recentListCurrent = recentContactList[activeWallet.address]

    if (!recentListCurrent) {
      const payload = {
        address: activeWallet.address,
        data: [newItem]
      }
      return dispatch(updateListRecentContact(payload))
    }

    let newRecentList = recentListCurrent.filter(
      (item) => item.networkType === networkType
    )

    newRecentList.unshift(newItem)
    newRecentList = uniqWith(newRecentList, isEqual)

    newRecentList = newRecentList.slice(0, 3)

    const oldRecentList = recentListCurrent.filter(
      (item) => item.networkType !== networkType
    )

    const list = [...oldRecentList, ...newRecentList]

    const payload = {
      address: activeWallet.address,
      data: list
    }
    dispatch(updateListRecentContact(payload))
  }

  const removeRecentContact = (address: string) => {
    dispatch(clearRecentContactByAddress(address))
  }

  const getRecentContactList = (wallet: Wallet) => {
    const engines = window.walletServices.getChainEngine(get(wallet, 'meta.chain', 'vic'))
    const type = engines && engines.constructor.name
    // for each service in services, get type of wallet
    const list = recentContactList[activeWallet.address]
    if (!list) return []
    return list.filter((item) => item.networkType === type)
  }

  return {
    addRecentContact,
    removeRecentContact,
    getRecentContactList
  }
}

export default useReceiveAddress
