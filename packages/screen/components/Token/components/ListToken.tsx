import type { Token } from '@wallet/core'
import { Input, ListItem } from '@wallet/ui'
import { convertWeiToBalance, cx, formatNumberBro } from '@wallet/utils'
import debounce from 'lodash/debounce'
import get from 'lodash/get'
import lowerCase from 'lodash/lowerCase'
import upperCase from 'lodash/upperCase'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import InfiniteScroll from 'react-infinite-scroll-component'

// import { DECIMALS_TOKEN_DISPLAY } from '~constants/misc'
import { DECIMALS_TOKEN_DISPLAY } from '../../../constants'
// import { ADDRESS_ZERO } from '~constants/token'
import useRouting from '../../../hooks/useRouting'
import HideBalance from '../../MainV2/components/HideBalance'
import EmptyData from '../../shared/EmptyData'
import Loader from '../../shared/Loader'
import type { IToken } from '../../../types'
import { useAppSelector } from 'store'
import { CHAIN_IMAGE } from 'store/constants'
import useTheme from '../../../hooks/useTheme'

export type TypeListToken = 'send' | 'receive'

interface IProps {
  type: TypeListToken
  listTokens?: Token[]
  isHidePrice?: boolean
  doSelectToken?: (token: IToken) => void
}

// hotfix
let initSearch = false

const ListToken = (props: IProps) => {
  const { type, listTokens, isHidePrice, doSelectToken } = props
  const { t } = useTranslation()
  const { isDarkTheme } = useTheme()
  const { navigateScreen } = useRouting()
  const [tokens, customTokens, showBalance, isLoadingToken, activeWallet, activeNetwork] =
    useAppSelector((state) => {
      return [
        state.wallet.tokens,
        state.wallet.customTokens,
        state.setting.showBalance,
        state.wallet.isLoading,
        state.wallet.activeWallet,
        state.setting.activeNetwork
      ]
    })

  // const { getWalletByChain } = useWalletUser()
  const [listTokensFilter, setListTokensFilter] = useState([])
  const [listTokensPagination, setListTokensPagination] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    size: 30,
    totalPage: 1
  })

  const [search, setSearch] = useState('')
  const handleSearch = (searchText: string, tokens: Token[]) => {
    setIsLoading(true)
    if (initSearch) {
      setListTokensPagination([])
      setPagination({
        page: 1,
        size: 30,
        totalPage: 1
      })
    }
    initSearch = true

    const customTokensList = Object.keys(customTokens).map((key) => {
      const cvTokens = customTokens[key]
      return cvTokens
    })

    const list = listTokens || [...tokens, ...customTokensList]
    if (!searchText) return setListTokensFilter(list)
    const listSearch = list.filter((item) => {
      const text = searchText.toLowerCase()
      return (
        (item.symbol).toLowerCase().includes(text) ||
        (item.name).toLowerCase().includes(text)
      )
    })
    setListTokensFilter(listSearch)
  }
  const debouncedSearch = useRef(debounce(handleSearch, 500)).current

  useEffect(() => {
    debouncedSearch(search, tokens)
  }, [search])

  useEffect(() => {
    if (!listTokens) {
      debouncedSearch(search, tokens)
    }
  }, [tokens])

  useEffect(() => {
    return () => {
      initSearch = false
    }
  }, [])

  const getDataWithPagination = (array: any[], page: number, size: number) => {
    if (array.length <= size) return array
    return array.slice((page - 1) * size, page * size)
  }

  const listTokenFinal = useMemo(() => {
    if (type === 'receive') return listTokensFilter
    // case "send" token, sort tokens by price
    return listTokensFilter
      .filter((token) => Number(get(token, 'rawBalance', 0)) > 0)
      .map((item) => {
        const balance = convertWeiToBalance(item.rawBalance, item.decimal)
        const price = get(item, 'prices.price', 0)
        const total = price * Number(balance)
        return { ...item, total }
      })
      .sort((a, b) => b.total - a.total)
  }, [listTokensFilter])

  useEffect(() => {
    setIsLoading(false)
    if (listTokenFinal.length === 0) return
    const dataWithPagination = getDataWithPagination(
      listTokenFinal,
      pagination.page,
      pagination.size
    )
    const list = listTokensPagination.concat(dataWithPagination)
    setListTokensPagination(list)
    const totalPage = Math.ceil(listTokenFinal.length / pagination.size)
    setPagination({ ...pagination, totalPage })
  }, [pagination.page, listTokenFinal])

  const handleLoadMore = () => {
    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
  }

  const handleSelectToken = (token: IToken) => () => {
    doSelectToken && doSelectToken(token)
    const chain = get(token, 'chain', '')
    const address = get(token, 'address') || ADDRESS_ZERO
    // const walletChain = getWalletByChain(chain)

    if (type === 'send') {
      navigateScreen(`/token/${chain}/${encodeURIComponent(address)}/send`, {
        fromScreen: 'main',
        tokenInfo: token
      })()
    } else {
      navigateScreen(`/token/${chain}/${encodeURIComponent(address)}/receive`, {
        wallet: activeWallet,
        tokenInfo: token,
        fromScreen: 'main'
      })()
    }

    window.closeModal()
  }

  const onChangeSearch = (event) => {
    setSearch(event.target.value)
  }

  const renderPrice = (balance, total) => {
    return (
      <div className="ml-auto">
        <div
          className={cx('flex flex-col text-right', {
            'gap-3': !showBalance
          })}>
          <div className="text-ui04">
            {showBalance
              ? (
                  balance
                )
              : (
              <HideBalance
                amountDot={8}
                typeSize="small"
                typeBackground="bold"
              />
                )}
          </div>
          <div className="text-ui03">
            {showBalance
              ? (
              `$${formatNumberBro(total, 2)}`
                )
              : (
              <HideBalance
                amountDot={4}
                typeSize="small"
                typeBackground="thin"
                className="justify-end"
              />
                )}
          </div>
        </div>
      </div>
    )
  }

  const renderListToken = () => {
    if (isLoading || isLoadingToken) return <EmptyData isLoading />
    if (listTokensPagination.length === 0 && initSearch) {
      return <EmptyData isLoading={false} title={t('No token were found')} />
    }

    return (
      <InfiniteScroll
        dataLength={listTokensPagination.length}
        next={handleLoadMore}
        hasMore={pagination.page < pagination.totalPage}
        loader={
          <div className="flex justify-center">
            <img
              className={cx('block h-12 w-12 animate-bounce', {})}
              src={`/public/img/brand/${isDarkTheme ? 'logo-dark' : 'logo-light'}.svg`}
            />
            {/* <Loader /> */}
          </div>
        }
        scrollableTarget="tokens-scroll-wrapper">
        {listTokensPagination.map((token, i) => {
          const balance = convertWeiToBalance(token.rawBalance, token.decimal)
          const price = get(token, 'prices.price', 0)
          const total = price * Number(balance)

          const formatBalanceAvailable = () => {
            return formatNumberBro(
              balance,
              DECIMALS_TOKEN_DISPLAY[token.symbol] || 4
            )
          }

          return (
            <ListItem
              key={i}
              image={get(token, 'image') || '_'}
              symbol={CHAIN_IMAGE[get(token, 'chain')]}
              description={upperCase(get(token, 'symbol', '')).replace(
                /\s/g,
                ''
              )}
              title={get(token, 'name', '')}
              rightView={
                !isHidePrice && renderPrice(formatBalanceAvailable(), total)
              }
              onClick={handleSelectToken(token)}
            />
          )
        })}
      </InfiniteScroll>
    )
  }

  return (
    <div className="h-full w-full mt-20 flex flex-col overflow-auto">
      <div className="px-5">
        <Input
          value={search}
          placeholder={t('Search')}
          className="text-base rounded-sm bg-ui01"
          left={{ icon: 'search', className: 'text-h3 font-semibold' }}
          onChange={onChangeSearch}
        />
      </div>
      <div className="h-full mb-6 overflow-auto" id="tokens-scroll-wrapper">
        {renderListToken()}
      </div>
    </div>
  )
}

export default ListToken
