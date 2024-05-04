import useRefreshTimer from '../../../hooks/useRefreshTimer'
import { DisplayTokensParam } from '../../../types'
import type { Wallet, Collection, Token } from '@wallet/core'
import { get } from 'lodash'
import {
  type FC,
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
  useRef
} from 'react'
import { useDebounce, useEffectOnce } from 'react-use'
import {
  getCoinGeckoPrices,
  getCoinLocal,
  onLoadingState,
  onSaveCurrentNft as onSaveCurrentNFTStore,
  onSaveListCollections,
  saveTokens,
  useAppDispatch,
  useAppSelector
} from 'store'

interface MainContextInterface {
  fetchCollections?: () => void
  activeWallet?: Wallet
  listCollections?: Collection[]
  loadingFetchNFTs?: boolean
  activeTypeDisplay?: DisplayTokensParam
  tokens?: Token[]
  onDisplayTokens?: (type: DisplayTokensParam) => void
  isDarkTheme?: boolean
  showBalance?: boolean
  isLoading?: boolean
  activeNetwork?: any
  wallets?: Wallet[]
  tokensLocal?: Token[]
  onChangeLockState?: (isLock: boolean) => void
  onToggleBalance?: () => void
  reloadBalance?: (wallet?: Wallet) => void
  onSaveCurrentNft?: (nft: any) => void
}

interface MainProviderProps {
  listCollections?: Collection[]
  isDarkTheme?: boolean
  reloadBalance?: () => void
  onSaveCurrentNft?: (nft: any) => void
}

const defaultValues: MainContextInterface = {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
}

export const MainContext = createContext(defaultValues)

export const MainProvider: FC<PropsWithChildren<MainProviderProps>> =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({
    children,
    isDarkTheme
    // onSaveCurrentNft
  }) => {
    const [activeWallet, activeNetwork] = useAppSelector((state) => {
      return [state.wallet.activeWallet, state.setting.activeNetwork]
    })

    const dispatch = useAppDispatch()

    const [listCollections, setListCollections] = useState<any[]>()
    const [loadingFetchNFTs, setLoadingFetchNFTs] = useState<boolean>(false)

    const isFirstTime = useRef<boolean>(true)

    const onSaveCurrentNft = (item: any) => {
      dispatch(onSaveCurrentNFTStore(item))
    }

    // const formatCollection = async (listCollection) => {
    //   const newListCollection = await Promise.all(listCollection.map(async item => {
    //     const listNFt = get(item, 'data', [])

    //     const newList = await Promise.all(
    //       listNFt.map(async it => {
    //         try {
    //           if (!get(it, 'image')) {
    //             const tokenUri = get(it, 'tokenURI', '')
    //             const data = await (await fetch(tokenUri)).json()
    //             it.metaData = data
    //           }
    //           return it
    //         } catch (e) {
    //         }
    //       })
    //     )

    //     return {
    //       collection: item.collection,
    //       data: newList
    //     }
    //   }))

    //   dispatch(onSaveListCollections(newListCollection))
    //   setListCollections(newListCollection)
    // }

    const fetchCollections = async () => {
      setLoadingFetchNFTs(true)
      if (!activeWallet) {
        isFirstTime.current = false
        return
      }
      await window.walletServices
        ?.fetchCollections({
          wallets: [activeWallet],
          callback(collections: Collection[]) {

            setListCollections(collections)
            dispatch(onSaveListCollections(collections))
            setLoadingFetchNFTs(false)
          }
        })
        .catch((e: any) => {
          console.log('Error while init', e)
        })
        .finally(() => {
          isFirstTime.current = false
        })

      setLoadingFetchNFTs(false)
      
    }

    // const handleSaveCurrentNft = (nft: any) => {
    //   dispatch(onSaveCurrentNft(nft))
    // }

    const reloadBalance = async () => {
      if (!activeWallet) {
        isFirstTime.current = false
        return
      }
      const service = window.walletServices
      dispatch(onLoadingState(true))
      // isLoading && dispatch(onResetTokenList())

      // const walletsByNetwork: Wallet[] = walletsByUser[activeWallet.address]
      // const walletsAvailable = activeNetwork ? [activeWallet] : walletsByNetwork
      await service
        ?.reload({
          wallets: [activeWallet],
          callback(tokensAdded: Token[]) {
            // dispatch(onUpdateTokenList(tokensAdded))
            dispatch(saveTokens(tokensAdded))
          }
        })
        .catch((e: any) => {
          console.log('Error while init', e)
        })
        .finally(() => {
          isFirstTime.current = false
          dispatch(onLoadingState(false))
        })
    }

    const reloadCondition = async () => {
      if (!activeWallet) return
      await reloadBalance()
    }

    useDebounce(
      async () => {
        await reloadCondition()
      },
      1000,
      [
        JSON.stringify(activeWallet),
        JSON.stringify(activeNetwork),
      ]
    )

    return (
      <MainContext.Provider
        value={{
          fetchCollections,
          reloadBalance,
          listCollections,
          loadingFetchNFTs,
          isDarkTheme,
          onSaveCurrentNft
        }}>
        {children}
      </MainContext.Provider>
    )
  }

export const useMainContext = () => {
  return useContext(MainContext)
}
