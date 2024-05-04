import { useQuery } from '@tanstack/react-query'
import { Icon, Image, MainLayout } from '@wallet/ui'
import { cx, truncate } from '@wallet/utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import get from 'lodash/get'
import groupBy from 'lodash/groupBy'
import isEqual from 'lodash/isEqual'
import uniqBy from 'lodash/uniqBy'
import uniqWith from 'lodash/uniqWith'
import { Key, useEffect, useMemo, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import { abiDecoder } from '@wallet/evm'
import mergeWith from 'lodash/mergeWith'

// import useManageToken from '../../../hooks/useManageToken'
import useTokenLocal from '../../../hooks/useTokenLocal'
// import { default as HistoryItemComponent } from '~pages/Token/components/HistoryItem'
import { sortLastestTimeToRender } from './utils/helper'
import { convertHistoryData } from './utils/transform'
import EmptyData from '../../shared/EmptyData'
import Loader from '../../shared/Loader'
import WalletSelectorModal from '../../shared/WalletSelectorModal'

import {
  type PaginationOptions,
  fetchAllHistory,
  HistoryItem
} from './services'
import { useAppSelector } from 'store'
import { Wallet } from '@wallet/core'
import { CHAIN_TYPE } from '@wallet/constants'
import { CHAIN_SUPPORT } from 'store/constants'
import { HISTORY_TYPE } from './utils/constants'
import HistoryItemComponent from './components/HistoryItem'
import { TomoWallet } from 'store/types'
import { ADDRESS_ZERO } from '../../../constants'
import useManageToken from '../../../hooks/useManageToken'
import { isEmpty } from 'lodash'
import { useTranslation } from 'react-i18next'
import withI18nProvider from '../../../provider'
import useTheme from '../../../hooks/useTheme'

dayjs.extend(relativeTime)

const defaultPagination = { page: 1, size: 100, totalPage: 1 }

const HistoryScreen = () => {
  const { t } = useTranslation()
  const { isDarkTheme } = useTheme()
  // const { tokens } = useManageToken()

  const activeWallet = useAppSelector((state) => state.wallet.activeWallet)
  const tokens = useAppSelector((state) => state.wallet.tokens)
  const activeNetwork = useAppSelector((state) => state.setting.activeNetwork)
  const walletsByUser = useAppSelector((state) => state.wallet.walletsByUser)
  // const { getWalletByChain } = useWalletUser()
  const { getInfoTokenByAddress } = useTokenLocal()

  // console.log('tokens', tokens);

  const [currentWallet, setCurrentWallet] = useState<TomoWallet>(activeWallet!)
  const [pagination, setPagination] =
    useState<PaginationOptions>(defaultPagination)
  const [listHistory, setListHistory] = useState([])
  const [isTriggerRefresh, setIsTriggerRefresh] = useState(false)
  const [isLoadingManual, setIsLoadingManual] = useState(false)
  const [listToken, setListToken] = useState(tokens)

  const formatHistoryData = (listData: any) => {
    const allDataArray = get(listData, 'data', [])
      .map((item: any) => item)
      .flat()
      .map((item) => ({
        ...item,
        hash: get(item, 'hash') || get(item, 'transactionHash')
      }))

    const combineArray = allDataArray.map((item: any) => {
      // check if two item with same hash in the array
      const similar = allDataArray.filter((it: any) => it.hash === item.hash)
      if (similar) {
        return mergeWith({}, ...similar, item, (a: any, b: any) =>
          b === null ? a : undefined
        )
      }
      return item
    }, [])

    const uniqTxsList = uniqBy(combineArray, 'hash')

    const finalList = uniqTxsList.map((item) => {
      const txData = get(item, 'input', '')

      let decodedData: any

      if (!txData || txData === '0x0') {
        decodedData = null
      }

      decodedData = abiDecoder.decode(txData)

      const approveData = get(decodedData, 'params', []).find(
        (item) => get(item, 'name') === 'amount'
      )
      const approveAmount = get(approveData, 'value')

      return {
        hash: get(item, 'hash'),
        timestamp: get(item, 'timestamp'),
        fee: get(item, 'fee'),
        from: get(item, 'from'),
        to: get(item, 'to'),
        input: get(item, 'input'),
        address: get(item, 'address') || get(item, 'contractAddress'),
        amount: approveAmount || get(item, 'amount') || get(item, 'value', ''),
        tokenDecimal: get(item, 'tokenDecimals'),
        method: get(item, 'method'),
        gas: get(item, 'gas'),
        gasPrice: get(item, 'gasPrice'),
        gasUsed: get(item, 'gasUsed')
      }
    })

    return finalList
  }

  const fetchHistoryServices = (wallet: Wallet) => async () => {
    const resultHistory = await fetchAllHistory(wallet)()
    const transformData = convertHistoryData(resultHistory.data || [])
    // const newData = formatHistoryData(transformData)
    const response = transformData
    // eslint-disable-next-line react/prop-types
    const uniqTxs = uniqBy(response.data[0] || [], (t: any) => t.hash)
    const txsTransfer = uniqTxs.filter((it) => it.method === 'transfer')

    // console.log('txsTransfer', txsTransfer);
    const uniqDataTokenTxs = response.data[1]
    const resultsArray = txsTransfer
      .concat(uniqDataTokenTxs)
      .filter((it) => it.value !== '0')
    // const result = mappingDataHistory(resultsArray, 'tomo', 'allHistory')

    // console.log('resultsArray', resultsArray);

    return resultsArray
  }

  const historyQuery = useQuery(
    ['queryHistory', currentWallet?.address],
    fetchHistoryServices(currentWallet),
    { enabled: false, retry: false }
  )

  const dataHistory = historyQuery && get(historyQuery, 'data', [])

  // const data = get(historyQuery, 'data', [])
  const isLoading = get(historyQuery, 'isLoading', false)
  const isFetching = get(historyQuery, 'isFetching', false)
  const refetch = get(historyQuery, 'refetch')

  const onShowWalletSelector = () => {
    window.openModal({
      type: 'none',
      closable: true,
      content: (
        <WalletSelectorModal
          currentWallet={currentWallet}
          onChangeWallet={setCurrentWallet}
        />
      )
    })
  }

  // console.log(transferMethod)

  const walletName = currentWallet?.name
  const walletAddress = currentWallet?.address
  const walletAvatar = currentWallet?.avatar

  const formatData = useMemo(() => {
    if (!dataHistory || dataHistory.length === 0) return []
    const list = sortLastestTimeToRender(listHistory.concat(dataHistory))
    return groupBy(list, (item) =>
      dayjs(item?.timestamp * 1000).format('YYYY/MM/DD')
    )
  }, [dataHistory])

  useEffect(() => {
    // get all info token from transaction
    const listAddressToken = dataHistory.filter((item: any) => {
      return item.address
    })
    if (listAddressToken.length) {
      handleUpdateListToken(uniqBy(listAddressToken, 'address'))
    }
  }, [listHistory, dataHistory])
  const handleUpdateListToken = async (array: any[]) => {
    const result = await array.reduce(async (a, b) => {
      const infoToken = await getInfoTokenByAddress(b.address, 'vic')

      const token = tokens.find((item) => item.address === infoToken.address)
      if (!token) (await a).push(infoToken)
      return a
    }, [])
    setListToken([...tokens, ...result])
  }

  const handleLoadMore = () => {
    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
  }

  useEffect(() => {
    refetch()
    setTimeout(() => {
      setIsLoadingManual(false)
    }, 1500)
  }, [pagination.page, isTriggerRefresh])

  useEffect(() => {
    setIsLoadingManual(true)
    setListHistory([])
    setPagination({ ...defaultPagination })
    setIsTriggerRefresh(!isTriggerRefresh)
  }, [currentWallet?.address])

  const customDateFromNow = (date: string, diff: number) => {
    if (diff === 0) return t('today')
    if (diff === 1) return t('yesterday')
    return dayjs(date, 'YYYY/MM/DD').fromNow()
  }

  const compareAddress = (address: string) => {
    if (!activeNetwork) {
      const walletArr = walletsByUser[currentWallet.address]
      const addressArr = walletArr.map((wallet: TomoWallet) =>
        wallet.address?.toLowerCase()
      )
      return addressArr.includes(address.toLowerCase())
    }

    return walletAddress?.toLowerCase() === address.toLowerCase()
  }

  const renderMethod = (data) => {
    const method = get(data, 'method', 'execute')
    let typeHistory: string = method

    if (method === 'transfer') {
      typeHistory = compareAddress(data.from)
        ? HISTORY_TYPE.SEND
        : HISTORY_TYPE.RECEIVE

      if (typeHistory === HISTORY_TYPE.SEND && compareAddress(data.to)) {
        typeHistory = HISTORY_TYPE.SELF
      }
    }

    if (method === 'approve') {
      typeHistory = HISTORY_TYPE.APPROVE
    }

    if (method.startsWith('swap')) typeHistory = 'swap'

    if (Object.values(HISTORY_TYPE).includes(method)) {
      console.log(method)
    }

    return typeHistory
  }

  // const checkExistInTokens = (item: any) => {
  //   const result = tokens.find(
  //     (it) =>
  //       lowerCase(get(it, 'address', ADDRESS_ZERO)) ===
  //       lowerCase(get(item, 'address', ADDRESS_ZERO))
  //   )
  //   return result
  // }

  const renderData = () => {
    if (isFetching && isLoadingManual) return <EmptyData isLoading />
    if (!dataHistory.length) {
      return (
        <EmptyData
          isLoading={isLoading || isLoadingManual}
          title={!isLoading ? t('token_detail_screen.no_activities') : ''}
        />
      )
    }

    return (
      <>
        <InfiniteScroll
          dataLength={listHistory.length}
          next={handleLoadMore}
          hasMore={pagination.page < pagination.totalPage!}
          loader={
            <div className="flex justify-center">
              <img
                className={cx('block h-12 w-12 animate-bounce', {})}
                src={`/public/img/brand/${isDarkTheme ? 'logo-dark' : 'logo-light'}.svg`}
              />
              {/* <Loader width="100px" height="100px" /> */}
            </div>
          }
          scrollableTarget="history-scroll-wrapper">
          {Object.keys(formatData)?.map((item) => {
            const diff = dayjs().diff(dayjs(item, 'YYYY/MM/DD'), 'd')
            const renderDate =
              diff < 2
                ? customDateFromNow(item, diff)
                : dayjs(item).format('DD/MM/YYYY')
            // const checkExist = formatData[item].some(checkExistInTokens)
            // if (!checkExist) return null
            return (
              <div key={item} className="mb-4">
                <div className="text-h5 text-tx-secondary pl-5">
                  {renderDate}
                </div>
                <div className="history-list">
                  {/* @ts-ignore */}
                  {formatData[item].map(
                    (hItem: HistoryItem, hIndex: Key | null | undefined) => {
                      const addressToken = get(hItem, 'address', '')
                      let typeHistory: any = compareAddress(hItem.from)
                        ? HISTORY_TYPE.SEND
                        : HISTORY_TYPE.RECEIVE
                      if (
                        typeHistory === HISTORY_TYPE.SEND &&
                        compareAddress(hItem.to)
                      ) {
                        typeHistory = HISTORY_TYPE.SELF
                      }
                      // const methodHistory = renderMethod(hItem)

                      const tokenInfo = addressToken
                        ? tokens.find(
                            (token) =>
                              token.address?.toLowerCase() ===
                              (addressToken as string).toLowerCase()
                          )
                        : tokens.find(
                            (token) => !token.address === !addressToken
                          )
                      return (
                        <HistoryItemComponent
                          currentWallet={currentWallet}
                          tokenDetail={tokenInfo}
                          history={hItem}
                          key={hIndex}
                          fromScreen="allHistory"
                          listToken={listToken}
                          type={typeHistory}
                        />
                      )
                    }
                  )}
                </div>
              </div>
            )
          })}
        </InfiniteScroll>
      </>
    )
  }

  return (
    <MainLayout
      title={t('history_screen.history')}
      className="overflow-auto"
      stylesContent={{ marginBottom: 0 }}
      hideBack={false}>
      <div
        className="hover:bg-ui01 group cursor-pointer"
        onClick={onShowWalletSelector}>
        <div className="flex min-h-[76px] items-center mx-5 border-b-[1px] border-b-ui01 group-last:border-b-0">
          <div
            className={cx(
              `w-8 h-8 text-ui00 text-[24px] all-center mr-3 ${walletAvatar}`
            )}></div>

          <div className="wallet-info">
            <div className="text-h5 text-ui04 truncate max-w-[190px]">
              {walletName}
            </div>
            {activeNetwork && (
              <div className="text-ui03 text-body-14-regular">
                {truncate(walletAddress, { length: 10 })}
              </div>
            )}
          </div>

          <div className="flex items-center justify-end flex-1 text-h3 ml-3">
            <Icon name="chevron_down" className="text-h3 text-ui04" />
          </div>
        </div>
      </div>
      <div className="flex-1 mt-6 overflow-auto" id="history-scroll-wrapper">
        {renderData()}
      </div>
    </MainLayout>
  )
}

export default withI18nProvider(HistoryScreen)
