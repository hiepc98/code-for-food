/* eslint-disable multiline-ternary */
import type { Token, Wallet } from '@wallet/core'
import { Input, ListItem, HideBalance, EmptyData, Loader } from '@wallet/ui'
import { convertWeiToBalance, cx, formatNumberBro } from '@wallet/utils'
import debounce from 'lodash/debounce'
import get from 'lodash/get'
// import lowerCase from 'lodash/lowerCase'
import upperCase from 'lodash/upperCase'
import { useEffect, useMemo, useRef, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { ADDRESS_ZERO, DECIMALS_TOKEN_DISPLAY } from '../../constants'
import { useHistory } from 'react-router-dom'
import { useAppSelector } from 'store'
import { isEmpty, uniqBy } from 'lodash'
import { CHAIN_IMAGE } from 'store/constants'
import useTheme from '../../hooks/useTheme'

export type TypeListToken = 'send' | 'receive'

interface IProps {
  type: TypeListToken
  classNameItem?: string
  isHidePrice?: boolean
  doSelectToken?: (token: Token) => void
  listTokens: Token[]
  activeWallet?: Wallet
  t: (key: string) => string
  showBalance?: boolean
}

// hotfix
let initSearch = false

const ListToken = (props: IProps) => {
  const {
    type,
    isHidePrice,
    doSelectToken,
    listTokens,
    classNameItem = '',
    t
  } = props
  const { isDarkTheme } = useTheme()
  const [
    tokens,
    customTokens,
    showBalance,
    isLoadingToken,
    activeWallet,
    coinGecko,
    activeNetwork
  ] = useAppSelector((state) => {
    return [
      state.wallet.tokens,
      state.wallet.customTokens,
      state.setting.showBalance,
      state.wallet.isLoading,
      state.wallet.activeWallet,
      state.info.coinGecko,
      state.setting.activeNetwork
    ]
  })
  const [listTokensFilter, setListTokensFilter] = useState<Token[]>([])
  const [listTokensPagination, setListTokensPagination] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [pagination, setPagination] = useState({
    page: 1,
    size: 30,
    totalPage: 1
  })

  const [search, setSearch] = useState('')

  const history = useHistory()

  // const [tokens, setTokens] = useState<Token[]>([])

  // const getTokens = async () => {
  //   const tokens = await window.walletServices.engines[0].tokens({
  //     address: activeWallet.address,
  //     chain: activeWallet.meta?.chain || 'ether'
  //   })

  //   return tokens
  // }

  // useEffect(() => {
  //   const fetchTokens = async () => {
  //     const listTokens = await getTokens?.()
  //     setTokens(listTokens || [])
  //   }
  //   fetchTokens()
  // }, [])

  const tokenReceive = () => {
    const arrNewTokenReceive = uniqBy(
      listTokens?.concat(customTokens![activeNetwork?.chain]),
      (t) => get(t, 'address', '')
    )
    const arrNewTokens = arrNewTokenReceive.map((tokenReceive) => {
      const data = tokens.find(
        (it) => get(it, 'address', '') === get(tokenReceive, 'address', '')
      )
      if (data) {
        return { ...tokenReceive, rawBalance: data.rawBalance }
      }
      return { ...tokenReceive, rawBalance: '' }
    })
    return arrNewTokens.map((item) => {
      const dataPrice = coinGecko.find((it) => it.id === get(item, 'cgkId', {}))
      const balance = convertWeiToBalance(
        get(item, 'rawBalance', '0'),
        get(item, 'decimal', 6)
      )
      const price = get(dataPrice, 'current_price', 0)
      const total = Number(price) * Number(balance)
      return { ...item, prices: price, total }
    })
  }

  const handleSearch = (searchText: string) => {
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

    if (!searchText) return setListTokensFilter(listTokens!)
    const listSearch = listTokens?.filter((item) => {
      const text = searchText.toLowerCase()
      return (
        item.symbol.toLowerCase().includes(text) ||
        item.name.toLowerCase().includes(text)
      )
    })
    setListTokensFilter(listSearch)
  }
  const debouncedSearch = useRef(debounce(handleSearch, 200)).current

  useEffect(() => {
    debouncedSearch(search)
  }, [search])

  // useEffect(() => {
  //   if (!listTokens) {
  //     debouncedSearch(search, tokens)
  //   }
  // }, [tokens])

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
    if (listTokensFilter && isEmpty(listTokensFilter)) return []
    if (type === 'receive') return tokenReceive()
    // case "send" token, sort tokens by price
    return (
      listTokensFilter
        // .filter((token) => Number(get(token, 'rawBalance', 0)) > 0)
        .map((item) => {
          const balance = convertWeiToBalance(
            item.rawBalance || '0',
            item.decimal
          )
          const price = get(item, 'prices.price', 0)
          const total = price * Number(balance)
          return { ...item, total }
        })
        .sort((a, b) => b.total - a.total)
    )
  }, [listTokensFilter])

  useEffect(() => {
    setIsLoading(false)
    if (listTokenFinal && isEmpty(listTokenFinal)) return
    const dataWithPagination = getDataWithPagination(
      listTokenFinal,
      pagination.page,
      pagination.size
    )
    setListTokensPagination(dataWithPagination as any)
    const totalPage = Math.ceil(listTokenFinal.length / pagination.size)
    setPagination({ ...pagination, totalPage })
  }, [pagination.page, listTokenFinal])

  const handleLoadMore = () => {
    setPagination((prev) => ({ ...prev, page: prev.page + 1 }))
  }

  const handleSelectToken = (token: Token) => () => {
    doSelectToken?.(token)
    const chain = get(token, 'chain', '')
    const address = get(token, 'address') || ADDRESS_ZERO

    if (type === 'send') {
      history.push(`/token/${chain}/${encodeURIComponent(address)}/send`, {
        fromScreen: 'main',
        tokenInfo: token
      })
    } else {
      history.push(`/token/${chain}/${encodeURIComponent(address)}/receive`, {
        wallet: activeWallet,
        tokenInfo: token,
        fromScreen: 'main'
      })
    }

    window.closeModal()
  }

  const onChangeSearch = (event: any) => {
    setSearch(event.target.value)
  }

  const renderPrice = (balance: string, total: number) => {
    return (
      <div className="ml-auto">
        <div
          className={cx('flex flex-col text-right', {
            'gap-3': !showBalance
          })}>
          <div className="text-ui04">
            {showBalance ? (
              balance
            ) : (
              <HideBalance
                amountDot={8}
                typeSize="small"
                typeBackground="bold"
              />
            )}
          </div>
          <div className="text-ui03">
            {showBalance ? (
              `$${formatNumberBro(total, 2)}`
            ) : (
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
    if (isLoading || isLoadingToken)
      return <EmptyData isLoading isDarkTheme={isDarkTheme} />
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
              src={`/public/img/brand/${
                isDarkTheme ? 'logo-dark' : 'logo-light'
              }.svg`}
            />
            {/* <Loader /> */}
          </div>
        }
        scrollableTarget="tokens-scroll-wrapper">
        {listTokensPagination.map((token: Token, i) => {
          const balance = convertWeiToBalance(
            get(token, 'rawBalance', '0'),
            token.decimal
          )
          //const price = get(token, 'prices.price', 0)
          const total = get(token, 'total', 0)

          const formatBalanceAvailable = () => {
            return formatNumberBro(
              balance,
              DECIMALS_TOKEN_DISPLAY[token.symbol] || 4
            )
          }

          return (
            <ListItem
              key={i}
              classNameItem={classNameItem}
              image={get(token, 'image') || '_'}
              symbol={CHAIN_IMAGE[token.chain] || ''}
              description={upperCase(get(token, 'symbol', '')).replace(
                /\s/g,
                ''
              )}
              title={get(token, 'name', '')}
              rightView={renderPrice(
                formatBalanceAvailable().toString(),
                total
              )}
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
