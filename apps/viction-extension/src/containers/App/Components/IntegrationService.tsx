//! Tempory Solutions for changes data
import { Wallet } from '@wallet/core'
import { useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useDeepCompareEffect } from 'react-use'

import { useAppSelector } from 'store'

// Only side effect here
const IntegrationService = () => {
  const isFirst = useRef<boolean>(true)
  const dispatch = useDispatch()

  const [activeWallet, activeNetwork] = useAppSelector((state) => [
    state.wallet.activeWallet,
    state.setting.activeNetwork
  ])
  const currentWallet = useRef<Wallet>(activeWallet)

  const onSendMessage = (props: any) => {
    const { event, data } = props
    // eslint-disable-next-line no-undef
    chrome.runtime.sendMessage({
      event,
      data,
      id: Math.random().toString()
    })
  }

  useDeepCompareEffect(() => {
    if (!isFirst.current) {
      onSendMessage({
        event: 'networkChanged',
        data: activeNetwork
      })
    } else {
      isFirst.current = false
    }
  }, [activeNetwork])

  useDeepCompareEffect(() => {
    if (!isFirst.current) {
      if (
        activeWallet &&
        currentWallet.current &&
        currentWallet.current?.address !== activeWallet?.address
      ) {
        currentWallet.current = activeWallet

        onSendMessage({
          event: 'accountsChanged',
          data: {
            name: activeWallet.name,
            algo: 'secp256k1',
            bech32Address: activeWallet.address,
            // address: getAddressCosmosFromPrivateKey(activeWallet.privateKey as string, prefix, true),
            // pubKey: secp256k1PublicKeyCreate(Buffer.from(wallet.privateKey as string, 'hex'), true),
            // Implement later for ledger
            isNanoLedger: false
          }
        })
      }
    } else {
      isFirst.current = false
    }
  }, [activeWallet])

  return null
}

export default IntegrationService
