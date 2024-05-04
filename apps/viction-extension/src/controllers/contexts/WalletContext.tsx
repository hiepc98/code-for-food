import loadable from '@loadable/component'
import type { BaseWallet } from '@wallet/base'
import {
  Collection,
  type Chain,
  type EngineConfiguration,
  // type Token,
  type Wallet
} from '@wallet/core'
import type { EvmEngine } from '@wallet/evm'
import type { AxiosInstance } from 'axios'
// import get from 'lodash/get'
import keys from 'lodash/keys'
import concat from 'lodash/concat'
import uniqBy from 'lodash/uniqBy'
import uniq from 'lodash/uniq'
import React, {
  type FC,
  type PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react'
import { useDebounce, useDeepCompareEffect } from 'react-use'

import { BaseAPI, BaseAdapter } from '~controllers/apis/BaseAPI'

import { CHAIN_DATA } from '@wallet/constants'

import {
  getCoinGeckoPrices,
  getCoinLocal,
  type RootState,
  useAppDispatch,
  useAppSelector,
  getNftLocal
  , onReloadBalance
} from 'store'

export interface ServiceState {
  chain: string
  service: EvmEngine
}
export interface ServicesState {
  isReady: boolean
  isServiceLoaded: boolean
  wallet: any
}
interface WalletContextInterface {
  service?: EvmEngine
  services?: ServicesState
  integrationService: any
  listService?: ServiceState[]
  walletNfts?: any[]
  serviceInit?: (network?: Chain) => void
  reloadBalance?: (baseWallet?: BaseWallet) => void
  fetchCollections?: (baseWallet?: BaseWallet) => void
  // fetchToken?: (address: string, chain: string) => any
  // getChainService?: (chain: string) => any
  // setWalletNfts?: (list: any[]) => any
}

const InitService = loadable(() => import('./InitService'))

// @ts-ignore:next-line
const WalletContext = React.createContext<WalletContextInterface>({})
export const WalletProvider: FC<PropsWithChildren> = ({ children }) => {
  const [
    networks,
    activeNetwork,
    activeWallet,
    customTokens,
    walletsByUser,
    coinLocal,
    isLoading,
    isReloadBalance,
    tokens
  ] = useAppSelector((state) => [
    state.setting.networks,
    state.setting.activeNetwork,
    state.wallet.activeWallet,
    state.wallet.customTokens,
    state.wallet.walletsByUser,
    state.info.coinLocal,
    state.wallet.isLoading,
    state.wallet.isReloadBalance,
    state.wallet.tokens
  ])

  const [services, setServices] = useState<any>()
  const [integrationService, setIntegrationService] = useState<any>()
  // const [walletNfts, setWalletNfts] = useState<any[]>()
  const [listService, setListService] = useState<ServiceState[]>([])

  const [isReady, setIsReady] = useState<boolean>(false)

  const [isInitialize, setIsInitialize] = useState<boolean>(false)

  const dispatch = useAppDispatch()

  const isFirstTime = useRef<boolean>(true)

  // @ts-ignore
  const info: EngineConfiguration = useAppSelector((state: RootState) => {
    const uniqKey = uniq(
      keys(state.wallet.customTokens).concat(keys(state.info.coinLocal))
    )
    const tokenInfos = uniqKey.reduce((finalInfos = {}, currentKey: string) => {
      const localItems = state.info.coinLocal[currentKey] || []
      const customItems = state.wallet.customTokens[currentKey] || []
      const result = uniqBy(concat(localItems, customItems), (t) =>
        t.address?.toLowerCase()
      )
      return {
        ...finalInfos,
        [currentKey]: result
      }
    }, {})

    const nftInfos = state.info.nftLocal
    // const networkState = state.custom.network

    const customNetworks = {
      evm: {},
      cosmos: {},
      solana: {}
    }

    // get rpc config for each network in setting
    const rpcConfig = [CHAIN_DATA['tomo']].reduce((final, current) => {
      const { chain, rpcURL } = current
      // create object with key is chain name
      return {
        ...final,
        [chain]: rpcURL
      }
    }, {})

    const listMarketInfo = state.info.coinGecko

    return {
      network: rpcConfig,
      tokenInfos,
      nftInfos,
      marketInfos: listMarketInfo,
      provider: {
        api: BaseAPI as AxiosInstance,
        adapter: BaseAdapter as AxiosInstance
      },
      // Should enable in development mode
      enableLogger: true,
      service: {
        // notifications: notificationService
      },
      custom: {
        networks: customNetworks
      }
    }
  })

  const OnInit = async () => {
    try {
      const arrInit = [getCoinGeckoPrices, getCoinLocal, getNftLocal]
      await Promise.all(arrInit.map(func => dispatch(func()))).catch(() => {
        //   logger.debug(e)
      })
      // if data is finished
      setIsReady(true)
    } catch (e) {
      console.log('err', e)
    }
  }

  // const fetchTokenInfo = async (chain: any, token: any) => {
  //   if (!token.symbol || !token.decimal || !token.image) {
  //     const listCoinLocalChain = coinLocal[token.chain]
  //     let findToken = listCoinLocalChain.find((item) => {
  //       return lowerCase(item.address) === lowerCase(token.address)
  //     })

  //     if (!findToken) {
  //       const findTokenUnknown = await window.walletServices.getTokenInfo({
  //         chain,
  //         address: token.address
  //       })

  //       if (findTokenUnknown) findToken = findTokenUnknown
  //     }

  //     if (!findToken) return token

  //     return {
  //       ...token,
  //       image: findToken.image,
  //       name: findToken.name,
  //       symbol: findToken.symbol,
  //       decimal: findToken.decimal
  //     }
  //   }
  //   return token
  // }

  // const fetchToken = async (address: string, chain: string) => {
  //   if (!services) return []

  //   try {
  //     let tokens = []
  //     tokens = await services.wallet.tokens({ address, chain })

  //     const cvToken = await await Promise.all(
  //       tokens.map((token) => fetchTokenInfo(chain, token))
  //     )

  //     return cvToken
  //   } catch (e) {
  //     return []
  //   }
  // }

  const initialize = async (baseWallet: BaseWallet, baseIntegration: any) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))

    //! Refactor to use ref instead of state
    setServices({
      isReady: true,
      isServiceLoaded: true,
      wallet: baseWallet
    })

    setIntegrationService(baseIntegration)
    setIsInitialize(true)
    // await reloadBalance(baseWallet)
    // await fetchCollections(baseWallet)
  }

  // const reloadBalance = async (baseWallet?: BaseWallet) => {
  //   if (!activeWallet) {
  //     isFirstTime.current = false
  //     return
  //   }
  //   const service = baseWallet || services.wallet
  //   dispatch(onLoadingState(true))
  //   // isLoading && dispatch(onResetTokenList())

  //   // const walletsByNetwork: Wallet[] = walletsByUser[activeWallet.address]
  //   // const walletsAvailable = activeNetwork ? [activeWallet] : walletsByNetwork
  //   await service
  //     ?.reload({
  //       wallets: [activeWallet],
  //       callback (tokensAdded: Token[]) {
  //         // dispatch(onUpdateTokenList(tokensAdded))
  //         dispatch(saveTokens(tokensAdded))
  //       }
  //     })
  //     .catch((e) => {
  //       console.log('Error while init', e)
  //     })
  //     .finally(() => {
  //       isFirstTime.current = false
  //       dispatch(onLoadingState(false))
  //     })
  // }

  const reloadCondition = async () => {
    if (services && !services.isServiceLoaded) return
    if (!activeWallet) return

    if (isFirstTime.current) return
    if (isInitialize) {
      // await reloadBalance()
    }
  }

  // const fetchCollections = async (baseWallet?: BaseWallet) => {
  //   if (!activeWallet) {
  //     isFirstTime.current = false
  //     return
  //   }
  //   const service = get(services, 'wallet', baseWallet)
  //   await service?.fetchCollections({
  //     wallets: [activeWallet],
  //     callback (collections: Collection[]) {
  //       console.log('collections', collections)
  //       formatCollection(collections)
  //       // dispatch(onSaveListCollections(collections))
  //     }
  //   })
  //     .catch((e) => {
  //       console.log('Error while init', e)
  //     })
  //     .finally(() => {
  //       isFirstTime.current = false
  //     })
  // }

  useDebounce(
    async () => {
      await reloadCondition()
    },
    1000,
    [
      JSON.stringify(activeWallet),
      JSON.stringify(activeNetwork),
      JSON.stringify(walletsByUser)
    ]
  )

  useDeepCompareEffect(() => {
    // This for update custom token with balance
    // update config for wallet base
    if (services && !services.isServiceLoaded) return
    // if (Object.keys(customTokens).length === 0) return
    // if (isFirstTime.current) return
    ;(async () => {
      await services?.wallet?.engines.forEach((engine) => {
        if (engine?.updateConfig) {
          console.log('update config engine')
          engine.updateConfig(info)
        }
      })
      if (!isReloadBalance) {
        dispatch(onReloadBalance(true))
        return
      }
      await reloadCondition()
    })()
  }, [customTokens])

  useEffect(() => {
    OnInit()
  }, [])

  return (
    <>
      <InitService isReady={isReady} info={info} initialize={initialize} />
      <WalletContext.Provider
        value={{
          services,
          integrationService,
          listService
          // walletNfts,
          // setWalletNfts,
          // reloadBalance,
          // fetchCollections,
          // fetchToken,
          // getChainService
        }}>
        {children}
      </WalletContext.Provider>
    </>
  )
}

export const useWallet = () => {
  return useContext(WalletContext)
}
