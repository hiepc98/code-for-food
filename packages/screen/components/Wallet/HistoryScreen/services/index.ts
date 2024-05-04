import { type Token, type Wallet } from '@wallet/core'
import axios from 'axios'
import get from 'lodash/get'

// import { CHAIN_TYPE, DefaultNetworks } from '~config/networks'
import { BaseAPI, BaseAdapter } from '~controllers/apis/BaseAPI'
import { encryptService } from '../../../../services/encryption'
import { store } from 'store'
// import type { INftItem } from ''
import { ADDRESS_ZERO } from '../utils/constants'
import { INftItem } from '../../../../types'
import { CHAIN_TYPE } from '@wallet/constants'
export interface PaginationOptions {
  page: number
  size: number
  totalPage?: number
  decimal?: string | number
  chain?: string
  denom?: string
  address?: string
}

interface ContractObj {
  address: string
  decimals: string | number
}
export interface HistoryItem {
  from: string
  to: string
  hash: string
  amount: number
  image?: string
  contract: ContractObj
  timestamp: string
  date?: string
  chain: string
}

export const fetchHistoryTokenDetail =
  (wallet: Wallet, pagination: PaginationOptions) => async (): Promise<any> => {
    if (!wallet) return []
    const { page, size, address, chain: changeParam } = pagination

    const chain =
      changeParam || get(store.getState(), 'setting.activeNetwork.chain')

    const tokens = [
      ...store.getState().wallet.tokens,
      ...(store.getState().wallet.customTokens[chain] || [])
    ]

    let findToken: Token
    if (address === ADDRESS_ZERO) {
      const listMain = tokens.filter((item) => item.isMain)
      const mainToken = listMain.find((item) => item.chain === chain)
      findToken = mainToken
    } else {
      const tokenInfo = tokens.find(
        (token) => token.address === address && token.chain === chain
      )
      findToken = tokenInfo
    }

    const addressToken = get(findToken, 'address', '')

    const payload = {
      address: get(wallet, 'address'),
      page,
      size,
      token: {
        address: addressToken,
        chain,
        decimal: get(findToken, 'decimal', '')
      }
    }

    const data: any = await BaseAPI.post('wallet/history', payload)

    if (data) {
      const history = !addressToken
        ? data.filter((item) => !item.functionName)
        : data
      const totalPage = get(data, 'totalPage', 1)
      return { data: history, totalPage }
    }

    return { data: [], totalPage: 1 }
  }

export const fetchHistorySei =
  (wallet: Wallet, pagination: PaginationOptions) => async (): Promise<any> => {
    if (!wallet) return []

    const { page, size, denom: token } = pagination

    const payload = { chain: wallet.meta.chain, page, size, token }

    const data: any = await BaseAdapter.get(
      `record/history/${wallet.address}`,
      { params: payload }
    )

    if (!data) return []

    const history = get(data, 'history')
    return { data: history }
  }

export const fetchAllHistory = (wallet: Wallet) => async (): Promise<any> => {
  try {
    if (!wallet) return []
    const chain = get(wallet, 'meta.chain', 'tomo')

    let params = {
      address: wallet.address,
      chain,
      size: 50
    }
    const data: any = await BaseAdapter.get('wallet/approval', { params })
    let { url, query } = data
    if (!url) return { data: [] }

    if (chain === CHAIN_TYPE.tomo) {
      query.account = wallet.address
    }
    // const paramsArray = [query, { ...query, action: 'tokentx' }]

    const fetchTxsList = async () => {
      let offset = 0
      let page = 1
      const totalSize = await axios.get(url, { params: {...query, offset: 0, page: 1} }).then(response => response.data.total)
      const maxPages = Math.ceil(totalSize / params.size)
      const promisesRequest = []
      for(let i = 0; i < maxPages; i++) {
        promisesRequest.push(axios.get(url, { params: {...query, offset, page} }).then(response => response.data.data))
        offset += 50
        page++
      }
      return (await Promise.all(promisesRequest)).flat()
    }
    const fetchTxsToken = async () => {
      let urlToken = url
      urlToken = urlToken.replace('/transaction', '/tokentx')
      let offset = 0
      let page = 1
      const totalSize = await axios.get(urlToken, { params: {...query, offset: 0, page: 1} }).then(response => response.data.total)
      const maxPages = Math.ceil(totalSize / params.size)
      const promisesRequest = []
      for(let i = 0; i < maxPages; i++) {
        promisesRequest.push(axios.get(urlToken, { params: {...query, offset, page} }).then(response => response.data.data))
        offset += 50
        page++
      }
      return (await Promise.all(promisesRequest)).flat()
    }
    const lastData = await Promise.all([fetchTxsList(), fetchTxsToken()] )
    return { data: lastData }
  } catch (error) {
    console.log({error})
    return { data: [] }
  }
}
export const fetchListNFT =
  (wallet: Wallet, chain: string) => async (): Promise<INftItem[]> => {
    try {
      const url = `/wallet/nfts/${wallet.address}?chain=${chain}`
      const response: any = await BaseAdapter.get(url)
      const data = Array.isArray(response)
        ? response
        : get(response, 'data', [])
      return data
    } catch (error) {
      return []
    }
  }

export const fetchAllNft = async (
  activeWallet: Wallet,
  services: any // Factory
): Promise<INftItem[]> => {
  const wallet = encryptService.decryptWallet(activeWallet)
  const client = await services.getClientV2(wallet)
  const codeId = 27
  const allCollection = await client.getContracts(codeId)

  const response = await Promise.all(
    allCollection.map(async (collectionAddress) => {
      const totalNFTInCollection = await client.queryContractSmart(
        collectionAddress,
        {
          tokens: {
            owner: wallet.address
          }
        }
      )

      const infoNFT = await Promise.all(
        get(totalNFTInCollection, 'tokens', []).map(async (tokenId) => {
          const info = await client.queryContractSmart(collectionAddress, {
            nft_info: {
              token_id: tokenId
            }
          })
          return {
            ...info,
            token_id: tokenId,
            address: collectionAddress,
            chain: 'sei',
            id: tokenId,
            name: get(info, 'extension.name'),
            image:
              get(info, 'extension.image_data') || get(info, 'extension.image'),
            description: get(info, 'extension.description')
            // description: get(info, 'extension.description'),
          }
        })
      )
      return infoNFT
    })
  )
  const listNft = response.filter((item) => item.length > 0).flat(2)
  return listNft
}

export const mappingDataHistory = (
  data: any[],
  chain: string,
  screen: HistoryFromScreen
) => {
  return data.map((item) => {
    // only case tomo
    const contractAddress =
      item.tokenSymbol && chain === CHAIN_TYPE.tomo
        ? item.address
        : item.contractAddress

    const date = getDateFormat(item, chain, screen)
    const result = {
      ...item,
      contractAddress,
      date,
      chain
    }

    return result
  })
}

const getDateFormat = (data: any, chain: string, screen: number | string) => {
  switch (screen) {
    case 'tokenDetail': {
      return data.date || data.timestamp
    }

    case 'allHistory':
      const cv = Number(data.timestamp || data.timeStamp)
      return isNaN(cv) ? data.timestamp : dayjs.unix(cv)

    default:
      break
  }
}
