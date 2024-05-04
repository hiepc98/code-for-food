/* eslint-disable react/react-in-jsx-scope */
import { Button, Icon, Image, MainLayout } from '@wallet/ui'
import { convertBalanceToWei, convertWeiToBalance, cx, formatNumberBro } from '@wallet/utils'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import get from 'lodash/get'
import groupBy from 'lodash/groupBy'
import { type FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useParams } from 'react-router-dom'

import { truncateText } from '../../../common/functions'
import { mappingDataHistory } from '../utils/index'
import {
  ADDRESS_ZERO,
  DECIMALS_TOKEN_DISPLAY,
  MAX_LENGTH_BALANCE_DISPLAY
} from '../../../constants'
import { HISTORY_TYPE } from '../../Wallet/HistoryScreen/utils/constants'

import useRouting from '../../../hooks/useRouting'
import { useAppSelector } from 'store'
import HistoryItem from '../components/HistoryItem'
import {
  type PaginationOptions,
  fetchHistorySei,
  fetchHistoryTokenDetail
} from '../../Wallet/HistoryScreen/services'
import EmptyData from '../../shared/EmptyData'
import Loader from '../../shared/Loader'
import type { IToken } from '../../../types'
import { CHAIN_IMAGE } from 'store/constants'
import { TomoWallet } from 'store/types'
import useManageToken from '../../../hooks/useManageToken'
import withI18nProvider from '../../../provider'
import { getLength } from '../../../common/functions'
import useTheme from '../../../hooks/useTheme'
// import { convertBalanceToWei } from 'utils'

dayjs.extend(relativeTime)

const defaultPagination = { page: 1, size: 150, totalPage: 1 }

interface IProps {
  forceQueryHistory: any
}

const TokenDetailScreen = (props: IProps) => {
  const { forceQueryHistory } = props
  const { t } = useTranslation()
  const { navigateScreen } = useRouting()
  // const { services } = useWallet()
  const { isDarkTheme } = useTheme()
  const { chain, address } = useParams<{ chain: string; address: string }>()
  const [currentDetail, setCurrentDetail] = useState([])
  const [isFetching, setIsFetching] = useState<boolean>(true)
  const [pagination, setPagination] =
    useState<PaginationOptions>(defaultPagination)
  const [tokenInfo, setTokenInfo] = useState<Partial<IToken>>()
  const [activeWallet, tokenData, activeNetwork, walletsByUser] =
    useAppSelector((state) => [
      state.wallet.activeWallet,
      state.wallet.tokens,
      state.setting.activeNetwork,
      state.wallet.walletsByUser
    ])
  const { tokens } = useManageToken()
  // variable date
  const currentDate = dayjs().format('DD/MM/YYYY')
  const calcUnix = new Date().getTime() - 60 * 60 * 24 * 1000
  const lastDayUnix = dayjs(calcUnix).format('DD/MM/YYYY')
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    handleFetchTokenHistory()
    setIsLoading(false)
  }, [pagination.page])

  const getTokenMain = () => {
    return tokens.find((item) => !item.address)
  }

  const getTokenData = () => {
    if (address === ADDRESS_ZERO) {
      return getTokenMain()
    }

    const tokenInfo = tokens.find(
      (token) => token.address === decodeURIComponent(address)
    )
    return tokenInfo
  }

  const handleFetchTokenHistory = async () => {
    try {
      if (!currentDetail.length) setIsFetching(true)
      const getTokenInfo = getTokenData()

      setTokenInfo(getTokenInfo)
      const cvAddress = decodeURIComponent(address)
      const options = {
        limit: pagination.size,
        offset: pagination.page
      }
      let res: { data: any[]; totalSize: number } = { data: [], totalSize: 0 }

      res = await window.walletServices.history({
        address: get(activeWallet, 'address'),
        wallet: activeWallet,
        token: getTokenInfo,
        pagination: options,
        chain
      })
      const totalPage = Math.ceil(get(res, 'totalSize', 0) / pagination.size)
      const checkMainToken = !get(getTokenInfo, 'address')

      setPagination((prev) => ({ ...prev, totalPage: totalPage }))

      if (
        getLength(res.data) === 0 &&
        typeof forceQueryHistory === 'function'
      ) {
        res = await forceQueryHistory(activeWallet)
      }

      if(getLength(res.data) === 0 && typeof forceQueryHistory !== 'function'){

        res = await fetchHistoryTokenDetail(activeWallet, {
          page: pagination.page,
          size: pagination.size,
          address: get(getTokenInfo, 'address')
        })()
      }

      const historyTransfer = (res?.data || res).filter((it: any) => {
        // if (typeof forceQueryHistory === 'function') {
        //   return it
        // }
        if(it.type){
          return it.type === HISTORY_TYPE.SEND || it.type === HISTORY_TYPE.RECEIVE
        }

        return it
      })

      const dataHistory = checkMainToken
        ? historyTransfer.filter((data: any) => !data.contractAddress)
        : historyTransfer.filter((data: any) => {
            return (
              data.contractAddress?.toLowerCase() ===
                get(getTokenInfo, 'address').toLowerCase() ||
              data.tokenSymbol?.toLowerCase() ===
                get(getTokenInfo, 'symbol').toLowerCase()
            )
          })
      const mapHistory = mappingDataHistory(dataHistory, chain, 'tokenDetail')

      if (!currentDetail.length) {
        setCurrentDetail(mapHistory)
      } else {
        setCurrentDetail(currentDetail.concat(mapHistory))
      }

      if (!currentDetail.length) setIsFetching(false)
    } catch (error) {
      if (!currentDetail.length) setIsFetching(false)
    }
  }

  const handleTypeHistory = (hItem: any) => {
    let typeHistory: any = compareAddress(hItem.from)
      ? HISTORY_TYPE.SEND
      : HISTORY_TYPE.RECEIVE

    if (typeHistory === HISTORY_TYPE.SEND && compareAddress(hItem.to)) {
      typeHistory = HISTORY_TYPE.SELF
    }
    return typeHistory
  }

  const compareAddress = (address: string) => {
    if (!activeNetwork) {
      const walletArr = walletsByUser[activeWallet.address]
      const addressArr = walletArr.map(
        (wallet: TomoWallet) => wallet.address?.toLowerCase()
      )
      return addressArr.includes(address.toLowerCase())
    }

    return activeWallet?.address?.toLowerCase() === address.toLowerCase()
  }

  const handleLoadMore = () => {
    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
  }

  const formatData = useMemo(() => {
    return groupBy(currentDetail, (item: any) => {
      return dayjs(item.date * 1000).format('DD/MM/YYYY')
    })
  }, [currentDetail])

  const renderData = useMemo(
    () =>
      isFetching ? (
        <div
          className={cx('overflow-auto w-full', {
            'h-full flex flex-col justify-center items-center': isFetching
          })}>
          <img
            className={cx('block h-12 w-12 animate-bounce', {})}
            src={`/public/img/brand/${
              isDarkTheme ? 'logo-dark' : 'logo-light'
            }.svg`}
          />
          {/* <Loader width="100px" height="100px" /> */}
        </div>
      ) : !currentDetail.length ? (
        <EmptyData
          isLoading={isFetching}
          title={!isFetching && t('token_detail_screen.no_activities')}
        />
      ) : (
        <InfiniteScroll
          dataLength={currentDetail.length}
          next={handleLoadMore}
          hasMore={pagination.page < get(pagination, 'totalPage', 0)}
          loader={
            <div className="flex justify-center">
              <img
                className={cx('block h-12 w-12 animate-bounce', {})}
                src={`/public/img/brand/${
                  isDarkTheme ? 'logo-dark' : 'logo-light'
                }.svg`}
              />
              {/* <Loader /> */}
            </div>
          }
          scrollableTarget="history-token-scroll-wrapper">
          {Object.keys(formatData)?.map((item) => {
            return (
              <div key={item} className="mb-4 px-2">
                <div className="text-tiny font-semibold pl-5 text-ui04">
                  {item === currentDate
                    ? 'Today'
                    : item === lastDayUnix
                      ? 'Yesterday'
                      : item}
                </div>
                <div className="history-list">
                  {formatData[item]?.map((hItem, hIndex) => (
                    <HistoryItem
                      history={hItem}
                      tokenDetail={tokenInfo}
                      key={hIndex}
                      fromScreen="tokenDetail"
                      type={handleTypeHistory(hItem)}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </InfiniteScroll>
      ),
    [currentDetail, formatData, isFetching]
  )

  const formatBalance = (balance: string | number, symbol: string) => {
    const value = formatNumberBro(balance, DECIMALS_TOKEN_DISPLAY[symbol] || 4)
    return truncateText(value as string, MAX_LENGTH_BALANCE_DISPLAY / 2)
  }

  const handleRouting = (type: string) => {
    const address = get(tokenInfo, 'address') || ADDRESS_ZERO

    if (type === 'send') {
      navigateScreen(`/token/${chain}/${encodeURIComponent(address)}/send`, {
        fromScreen: 'tokenDetail',
        tokenInfo
      })()
    } else {
      navigateScreen(`/token/${chain}/${encodeURIComponent(address)}/receive`, {
        wallet: activeWallet,
        tokenInfo,
        fromScreen: 'tokenDetail'
      })()
    }
  }

  const renderBalance = () => {
    const balance = convertWeiToBalance(
      get(tokenInfo, 'rawBalance', ''),
      tokenInfo?.decimal
    )
    const price = get(tokenInfo, 'prices.price', 0)
    const total = price * Number(balance)
    return formatNumberBro(total, 2)
  }

  return (
    <MainLayout
      className="overflow-auto"
      headerClass="pb-0"
      stylesContent={{ marginBottom: 0 }}>
      <div className="h-full flex flex-col">
        {isLoading ? (
          <div
            className={cx(
              'overflow-auto w-full h-full flex flex-col justify-center items-center'
            )}>
            <img
              className={cx('block h-12 w-12 animate-bounce', {})}
              src={`/public/img/brand/${
                isDarkTheme ? 'logo-dark' : 'logo-light'
              }.svg`}
            />
            {/* <Loader width="100px" height="100px" /> */}
          </div>
        ) : (
          <>
            <div className="px-5">
              <div className="flex flex-col items-center justify-center">
                <div className="relative">
                  {tokenInfo && (
                    <Image
                      className="w-16 h-16 rounded-full"
                      src={get(tokenInfo, 'image') || '_'}
                    />
                  )}

                  {/* {tokenInfo && (
                    <Image
                      src={CHAIN_IMAGE[(get(tokenInfo, 'chain'))]}
                      className="absolute w-6 h-6 rounded-full overflow-hidden border-ui00 border-2"
                      style={{ bottom: '-8px', right: '-2px' }}
                    />
                  )} */}
                </div>

                <h3 className="font-semibold text-ui04 text-h3 mt-4 mb-1 uppercase flex items-center break-all text-center">
                  {formatBalance(
                    convertWeiToBalance(
                      get(tokenInfo, 'rawBalance', ''),
                      tokenInfo?.decimal
                    ),
                    get(tokenInfo, 'symbol', '')
                  ) +
                    ' ' +
                    tokenInfo?.symbol}
                </h3>
                <h4 className="font-thin text-ui03 text-tiny mt-1 mb-1 uppercase flex items-center">
                  ${renderBalance()}
                </h4>
              </div>

              <div className="grid grid-cols-2 gap-4 my-6">
                <Button
                  onClick={() => handleRouting('send')}
                  className="flex-1 px-0 w-full max-h-10 bg-primary"
                  outline
                  type="primary">
                  <div className="text-tiny flex items-center text-ui00">
                    <Icon
                      className="text-h3 text-ui00 mr-1"
                      name={t('setting_screen.arrow_up')}
                    />
                    {t('send_nft_success.send')}
                  </div>
                </Button>

                <Button
                  type="primary"
                  className="flex-1 px-0 w-full max-h-10 bg-primary"
                  outline
                  onClick={() => handleRouting('receive')}>
                  <div className="text-tiny flex items-center text-ui00">
                    <Icon
                      className="text-h3 text-ui00 mr-1"
                      name={t('setting_screen.arrow_down')}
                    />
                    {t('history_item.receive')}
                  </div>
                </Button>
              </div>
            </div>

            <div
              className="flex-1 overflow-auto h-full"
              id="history-token-scroll-wrapper">
              {renderData}
            </div>
          </>
        )}
      </div>
    </MainLayout>
  )
}

export default withI18nProvider(TokenDetailScreen)
