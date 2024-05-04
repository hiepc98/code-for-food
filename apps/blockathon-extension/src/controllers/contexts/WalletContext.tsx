import loadable from '@loadable/component'
import {
  type Chain,
  type EngineConfiguration
} from '@wallet/core'
import type { EvmEngine } from '@wallet/evm'
import type { AxiosInstance } from 'axios'
// import get from 'lodash/get'
import concat from 'lodash/concat'
import keys from 'lodash/keys'
import uniq from 'lodash/uniq'
import uniqBy from 'lodash/uniqBy'
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
  type FC,
  type PropsWithChildren
} from 'react'
import { useDebounce, useDeepCompareEffect } from 'react-use'

import { BaseAPI, BaseAdapter } from '~controllers/apis/BaseAPI'

import type { BaseWallet } from '@wallet/base'
import { CHAIN_DATA } from '@wallet/constants'
import {
  getCoinGeckoPrices,
  getCoinLocal,
  getNftLocal,
  onReloadBalance,
  useAppDispatch,
  useAppSelector,
  type RootState
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
    const customNetworks = {
      evm: {},
      cosmos: {},
      solana: {}
    }

    const listMarketInfo = state.info.coinGecko

    return {
      network: CHAIN_DATA,
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
  }

  const reloadCondition = async () => {
    if (services && !services.isServiceLoaded) return
    if (!activeWallet) return

    if (isFirstTime.current) return
    if (isInitialize) {
      // await reloadBalance()
    }
  }

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
    if (services && !services.isServiceLoaded) return
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
        }}>
        {children}
      </WalletContext.Provider>
    </>
  )
}

export const useWallet = () => {
  return useContext(WalletContext)
}
