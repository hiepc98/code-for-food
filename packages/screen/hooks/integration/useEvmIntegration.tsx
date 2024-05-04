import { BaseIntegrationRequest, Chain, Wallet } from '@wallet/core'
// import { IntegrationEncryptDecryptOptions, IntegrationSendTransactionOptions, IntegrationSignOptions, IntegrationSignTypedDataOptions } from '@wallet/evm'
import { encryptService } from '../../services/encryption'
import { useTranslation } from 'react-i18next'
// import { onUpdateNetwork } from '~src/controllers/Redux/reducers/Storages/userSlice'
// import { onAddCustomNetwork, onAddCustomToken } from '~src/controllers/Redux/reducers/Storages/customSlice'
// import { onUpdateWalletCustomNetwork, putConnections } from '~src/controllers/Redux/reducers/Storages/walletDataSlice'
import { putConnection, useAppDispatch, useAppSelector } from 'store'
import { get } from 'lodash'
import { CHAIN_DATA } from '@wallet/constants'

const useEvmIntegration = (services?:any) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const [activeNetwork, activeWallet] = useAppSelector((state) => [
    state.setting.activeNetwork,
    state.wallet.activeWallet
  ])
  // const { wallet: walletService } = useService()
  const chain = get(activeNetwork, 'chain')

  const currentWallet = encryptService.decryptWallet(activeWallet)

  const walletService = window.integrationServices || services

  const getDecryptedKey = () => {
    const originalPrivateKey = currentWallet?.privateKey.toString()
    const santizedPrivateKey = originalPrivateKey.startsWith('0x') ? originalPrivateKey.slice(2) : originalPrivateKey
    const mnemonic = activeWallet?.mnemonic && encryptService.decrypt(activeWallet.mnemonic)

    return {
      privateKey: santizedPrivateKey,
      privateKeyBuffer: Buffer.from(santizedPrivateKey, 'hex'),
      mnemonic
    }
  }

  const getSignData = (params: any[]) => {
    const msgParams = params.find(param => (typeof param === 'string' ? param.toLowerCase() : param) !== currentWallet?.address.toLowerCase())
    const address = params.find(param => (typeof param === 'string' ? param.toLowerCase() : param) === currentWallet?.address.toLowerCase()) || params.length === 1

    if (!address) {
      throw new Error('Address does not match with current active wallet')
    }

    return {
      address,
      msgParams
    }
  }

  const ethRequestAccounts = async (_params: any[], request: BaseIntegrationRequest) => {
    if (!currentWallet) {
      const chainData = CHAIN_DATA[chain]
      return await new Promise((resolve) => {
        window.openModal({
          type: 'error',
          className: 'mx-5',
          content: t('pleaseActivePriorityWallet', { current_chain: chainData.name, chain: chainData.name }),
          onCancel: () => {
            resolve([])
          }
        })
      })
    } else {
      const { sender } = request
      const name = sender?.tab.title
      const origin = sender?.origin
      const favicon = sender?.tab.favIconUrl ?? `http://www.google.com/s2/favicons?domain=${origin}`

      // Put access
      dispatch(putConnection({
        connection: {
          origin,
          title: name,
          favicon
        },
        wallet: activeWallet
      }))
      return [currentWallet?.address.toLowerCase()]
    }
  }

  const ethSendTransaction = async (_params: any[], request: BaseIntegrationRequest, options: any) => {
    options.advance = {
      ...options.advance,
      wallet: currentWallet
    }
    options.chainInfo = activeNetwork

    const result = await walletService.handle(request, options)

    return result
  }

  const ethSign = async (params: [string, string, string], request: BaseIntegrationRequest, options: any) => {
    const { msgParams } = getSignData(params)
    const { privateKeyBuffer } = getDecryptedKey()

    if (privateKeyBuffer) {
      options.advance = {
        ...options.advance,
        data: msgParams,
        privateKeyBuffer
      }

      options.chainInfo = activeNetwork

      const result = await walletService.handle(request, options)

      return result
    }
    throw new Error('Key is not available')
  }

  const signTypedData = (params: any[], request: BaseIntegrationRequest, options: any) => {
    const { msgParams } = getSignData(params)
    const { privateKeyBuffer } = getDecryptedKey()
    options.advance = {
      ...options.advance,
      // msgParams,
      msgParams: options.advance.data,
      privateKeyBuffer
    }

    return walletService.handle(
      request,
      options
    )
  }

  const ethEncryptDecryptKey = (_: any[], request: BaseIntegrationRequest, options: any) => {
    options.advance = {
      ...options.advance,
      wallet: currentWallet
    }
    options.chainInfo = activeNetwork

    return walletService.handle(
      request,
      options
    )
  }

  const walletRequestPermissions = (_: any, request: BaseIntegrationRequest) => {
    return [{
      caveats: [{ type: 'restrictReturnedAccounts', value: [currentWallet?.address] }],
      date: new Date().getTime(),
      id: request.id,
      invoker: request.sender.origin,
      parentCapability: 'eth_accounts'
    }]
  }

  const handle = async (request: BaseIntegrationRequest, options: any) => {
    options.chainInfo = activeNetwork
    return await walletService.handle(
      request,
      options
    )
  }

  return {
    eth_requestAccounts: ethRequestAccounts,
    eth_sendTransaction: ethSendTransaction,
    eth_sign: ethSign,
    eth_signTypedData: signTypedData,
    eth_signTypedData_v4: signTypedData,
    eth_signTypedData_v3: signTypedData,
    eth_signTypedData_v2: signTypedData,
    eth_signTypedData_v1: signTypedData,
    eth_decrypt: ethEncryptDecryptKey,
    eth_getEncryptionPublicKey: ethEncryptDecryptKey,
    personal_sign: ethSign,
    // wallet_switchEthereumChain: walletSwitchEthereumChain,
    // wallet_addEthereumChain: walletAddEthereumChain,
    wallet_requestPermissions: walletRequestPermissions,
    // wallet_watchAsset: walletWatchAsset,

    handle
  }
}

export default useEvmIntegration
