import { type Wallet, CHAIN_TYPE } from '@wallet/core'
import TokenDetailScreen from '@wallet/screen/components/Token/screens/TokenDetailScreen'
import axios from 'axios'
import { get } from 'lodash'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { BaseAdapter } from 'store/service/BaseAPI'

const TestTokenDetailScreen = () => {
  const { t } = useTranslation()

  const fetchAllHistory = async (wallet: Wallet) => {
    try {
      if (!wallet) return []
      const chain = get(wallet, 'meta.chain', 'tomo')

      const params = {
        address: wallet.address,
        chain,
        size: 50
      }

      const data: any = await BaseAdapter.get('wallet/approval', { params })

      const { url, query } = data

      if (!url) return []

      if (chain === CHAIN_TYPE.tomo) {
        query.account = wallet.address
      }
      // const paramsArray = [query, { ...query, action: 'tokentx' }]

      // const fetchTxsList = async () => {
      //   let offset = 0
      //   let page = 1
      //   const totalSize = await axios.get(url, { params: { ...query, offset: 0, page: 1 } }).then(response => response.data.total)
      //   const maxPages = Math.ceil(totalSize / params.size)
      //   const promisesRequest = []
      //   for (let i = 0; i < maxPages; i++) {
      //     promisesRequest.push(axios.get(url, { params: { ...query, offset, page } }).then(response => response.data.data))
      //     offset += 50
      //     page++
      //   }
      //   return (await Promise.all(promisesRequest)).flat()
      // }
      const fetchTxsToken = async () => {
        let urlToken = url
        urlToken = urlToken.replace('/transaction', '/tokentx')
        let offset = 0
        let page = 1
        const totalSize = await axios.get(urlToken, { params: { ...query, offset: 0, page: 1 } }).then(response => response.data.total)
        const maxPages = Math.ceil(totalSize / params.size)
        const promisesRequest = []
        for (let i = 0; i < maxPages; i++) {
          promisesRequest.push(axios.get(urlToken, { params: { ...query, offset, page } }).then(response => response.data.data))
          offset += 50
          page++
        }
        const resultTx = (await Promise.all(promisesRequest)).flat()
        const formatResult = resultTx.map(item => ({ ...item, amount: item.value }))
        return formatResult
      }
      const lastData = await Promise.all([fetchTxsToken()])

      // return { data: lastData }
      return lastData.flat()
    } catch (error) {
      return { data: [] }
    }
  }

  return (

    <TokenDetailScreen t={t}/>
  )
}

export default TestTokenDetailScreen
