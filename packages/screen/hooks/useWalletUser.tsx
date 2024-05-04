import { Wallet } from '@wallet/core'
import lowerCase from 'lodash/lowerCase'

import { useAppSelector } from 'store'

const useWalletUser = () => {
  const walletsByUser = useAppSelector((state) => state.wallet.walletsByUser)
  const activeWallet = useAppSelector((state) => state.wallet.activeWallet)

  // get wallet by chain
  // const getWalletByChain = (chain: string, wallet?: Wallet) => {
  //   const walletCurrent = wallet || activeWallet
  //   if (!chain) return walletCurrent
  //   const walletsByNetwork: Wallet[] = walletsByUser[walletCurrent.address]
  //   // console.log({ walletuser: walletCurrent.address, walletsByUser })
  //   const walletByChain = walletsByNetwork.find(
  //     (wallet) => wallet.meta.chain === chain
  //   )
  //   return walletByChain
  // }

  const getWalletByAddress = (address: string) => {
    if (!address) return
    const wallet = Object.values(walletsByUser)
      .flat(2)
      .find(
        (wallet: Wallet) =>
          wallet.address.toLowerCase() === address.toLowerCase()
      )
    return wallet || {}
  }

  return { activeWallet, walletsByUser, getWalletByAddress }
}

export default useWalletUser
