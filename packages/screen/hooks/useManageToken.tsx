import type { Token, Wallet } from '@wallet/core'
import { convertWeiToBalance } from '@wallet/utils'
import get from 'lodash/get'
import { useMemo } from 'react'
import { updateTokenHiddenByUser, useAppDispatch, useAppSelector } from 'store'

const useManageToken = () => {
  const dispatch = useAppDispatch()

  const [activeWallet, tokensStore, customTokens, activeNetwork, manageHiddenTokenByUser] =
    useAppSelector((state) => [
      state.wallet.activeWallet,
      state.wallet.tokens,
      state.wallet.customTokens,
      state.setting.activeNetwork,
      state.wallet.manageHiddenTokenByUser
    ])
  const addIdToHiddenArray = (token: Token) => {
    const id = token.chain + '/' + (token.address || '')

    const idArrayCurrent = manageHiddenTokenByUser
    if (!idArrayCurrent) {
      return dispatch(updateTokenHiddenByUser([id]))
  }

    const newIdArray = [...idArrayCurrent, id]

    dispatch(updateTokenHiddenByUser(newIdArray))
  }

  const removeIdToHiddenArray = (token) => {
    const id = token.chain + '/' + (token.address || '')

    const idArrayCurrent = manageHiddenTokenByUser || []
    const newIdArray = idArrayCurrent.filter((item) => item !== id)

    dispatch(updateTokenHiddenByUser(newIdArray))
  }

  const getIdHiddenArrayByUser = (): any[] => {
    return manageHiddenTokenByUser
  }

  const showAll = () => {
    let arrayIdHidden = []
    if (activeNetwork) {
      const chain = activeNetwork.chain
      arrayIdHidden = getIdHiddenArrayByUser().filter(
        (item) => !item.includes(chain)
      )
    }
    dispatch(updateTokenHiddenByUser(arrayIdHidden))
  }

  const hiddenAll = (data: any) => {
    dispatch(updateTokenHiddenByUser(data))
  }

  const filterTokenHidden = (array: any[]) => {
    return array.filter((token) => {
      const id = token.chain + '/' + (token.address || '')
      return !Object.values(manageHiddenTokenByUser).includes(id)
    })
  }

  const tokensManage = !activeNetwork
    ? tokensStore
    : tokensStore.filter((token) => token.chain === activeNetwork.chain)

  const customTokensList = useMemo(() => {
    let resultList = []
    if (activeNetwork) {
      resultList = (customTokens[get(activeNetwork, 'chain', 'tomo')] || []).map((item: any) => ({
        ...item,
        isCustomToken: true
      }))
    } else {
      resultList = Object.values(customTokens)
        .flat(2) // @ts-ignore
        .map((item) => ({ ...item, isCustomToken: true }))
    }

    return resultList
  }, [activeNetwork, customTokens])

  const uniqListToken = (arrayTokens: any[], arrCustomTokens: any[]) => {
    const arrAddressDuplicate = arrayTokens.reduce((a, b) => {
      const find = arrCustomTokens.find(
        (item) =>
          item.address?.toLowerCase() === b.address?.toLowerCase() &&
          item.chain === b.chain
      )
      if (find) a.push(find.address?.toLowerCase())
      return a
    }, [])

    return [
      ...arrayTokens.map((item) => {
        if (arrAddressDuplicate.includes(item.address?.toLowerCase())) {
          const findImage = arrCustomTokens.find((customToken) => {
            return (
              customToken.address?.toLowerCase() === item.address?.toLowerCase() &&
              customToken.chain === item.chain
            )
          })
          return {
            ...item,
            isCustomToken: true,
            image: findImage ? findImage.image : item.image
          }
        }
        return item
      }),
      ...arrCustomTokens.filter(
        (x) => !arrAddressDuplicate.includes(x.address?.toLowerCase())
      )
    ]
  }

  const getMainTokenBalanceByWallet = async (wallet: Wallet, chain: string) => {
    const tokensWallet = await window.walletServices.tokens({ address: wallet?.address, chain })
    // filter the main token which doesn't have address
    const mainToken = tokensWallet.find((item) => !item.address)
    return {
      mainToken,
      mainBalance: parseFloat(
        convertWeiToBalance(
          get(mainToken, 'rawBalance'),
          get(mainToken, 'decimal')
        )
      )
    }
  }
  const tokens = uniqListToken(
    filterTokenHidden(tokensStore),
    filterTokenHidden(customTokensList)
  )


  const listTokenManagePage = uniqListToken(tokensManage, customTokensList)

  return {
    tokens, // use all page
    listTokenManagePage, // use only at manage token page
    addIdToHiddenArray,
    removeIdToHiddenArray,
    getIdHiddenArrayByUser,
    showAll,
    hiddenAll,
    getMainTokenBalanceByWallet
  }
}

export default useManageToken
