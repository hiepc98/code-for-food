/* eslint-disable multiline-ternary */
// import { COIN_IMAGE } from '@wallet/core'
import { EmptyData, Icon, ListItem, Loader } from '@wallet/ui'
import {
  convertWeiToBalance,
  cx,
  formatMoney,
  formatNumberBro
} from '@wallet/utils'
import compact from 'lodash/compact'
import get from 'lodash/get'
import { type FC, useMemo, useEffect, useCallback, useState } from 'react'
import { BounceLoader } from 'react-spinners'

import { ADDRESS_ZERO, MAX_LENGTH_BALANCE_DISPLAY } from '../../../constants'
// import useScrollAnimation from '../../../hooks/useScrollAnimation'
import { useHistory } from 'react-router-dom'

import HideBalance from './HideBalance'
import { useMainContext } from '../context'
import { truncateText, upperCase } from '../../../utils'
import { useAppSelector } from 'store'
import useScrollAnimation from '../../../hooks/useScrollAnimation'
import useManageToken from '../../../hooks/useManageToken'
import { useTranslation } from 'react-i18next'
import useRefreshTimer from '../../../hooks/useRefreshTimer'
import { COIN_IMAGE } from 'store/constants'

const TabToken: FC = () => {
  const { isDarkTheme, reloadBalance } = useMainContext()
  const { t } = useTranslation()

  const [activeWallet, showBalance, isLoading] = useAppSelector((state) => {
    return [
      state.wallet.activeWallet,
      state.setting.showBalance,
      state.wallet.isLoading
    ]
  })
  const { tokens } = useManageToken()
  const { onWheel } = useScrollAnimation(tokens)
  useRefreshTimer(() => {
    reloadBalance?.()
  }, 15)

  const history = useHistory()

  const listTokenSorted = useMemo(() => {
    return compact(
      tokens
        ?.map((item) => {
          // eslint-disable-next-line array-callback-return
          if (!item.name) return
          const balance = convertWeiToBalance(
            item.rawBalance || '0',
            item.decimal
          )
          const price = get(item, 'prices.price', 0)
          const total = price * Number(balance)
          return { ...item, total }
        })
        .sort((a: any, b: any) => b.total - a.total)
    )
  }, [tokens])

  // if (isLoading) {
  //   return (
  //     <div className="w-full flex justify-center items-center ">
  //       <img
  //         className={cx('block h-12 w-12 animate-bounce', {})}
  //         src={`/public/img/brand/${
  //           isDarkTheme ? 'logo-dark' : 'logo-light'
  //         }.svg`}
  //       />
  //       {/* <Loader width="100px" height="100px" /> */}
  //     </div>
  //   )
  // }

  const renderListTokenSorted = () => {
    return listTokenSorted.map((token, i) => {
      const balanceConverted = convertWeiToBalance(
        get(token, 'rawBalance', '0'),
        token.decimal
      )
      const price = token?.prices ? get(token, 'prices.price') : ''
      const priceChanges = token?.market?.price_change_percentage_24h || 0

      const formatBalanceAvailable = () => {
        const value = formatNumberBro(balanceConverted, 4)

        return truncateText(value as string, MAX_LENGTH_BALANCE_DISPLAY / 2)
      }
      const chain = get(activeWallet, 'meta.chain', 'ether')
      const chainSymbol = get(
        COIN_IMAGE,
        `${chain.toUpperCase()}`,
        COIN_IMAGE.ETH
      )
      return (
        <ListItem
          key={i}
          image={get(token, 'image') || '_'}
          symbol={chainSymbol}
          hasDivider={false}
          classNameItem="rounded-full"
          title={truncateText(upperCase(get(token, 'symbol', '')), 15)}
          description={
            <div className="text-base text-ui04">
              {price ? (
                <div className="flex items-center gap-2">
                  <p className="text-ui03 text-tiny">
                    {price && `$${formatMoney(String(price))} `}
                  </p>
                  <p
                    className={`text-tiny ${
                      priceChanges && priceChanges < 0
                        ? 'text-red'
                        : 'text-green'
                    }`}>
                    {priceChanges <= 0
                      ? `${formatNumberBro(priceChanges, 2)}%`
                      : `+${formatNumberBro(priceChanges, 2)}%`}
                  </p>
                </div>
              ) : (
                <p className="text-ui03">$0</p>
              )}
            </div>
          }
          rightView={
            <div className="ml-auto">
              <div
                className={cx('flex flex-col items-end', {
                  'gap-3': !showBalance
                })}>
                <>
                  <div className="text-ui04 text-body-16-regular">
                    {isLoading ? (
                      <BounceLoader color="#666666" size={12} />
                    ) : showBalance ? (
                      formatBalanceAvailable()
                    ) : (
                      <HideBalance
                        amountDot={8}
                        typeSize="small"
                        typeBackground="bold"
                      />
                    )}
                  </div>
                  {showBalance ? (
                    <p className="text-ui03 text-tiny">{`$${formatNumberBro(
                      token.total,
                      2
                    )}`}</p>
                  ) : (
                    <HideBalance
                      amountDot={4}
                      className="justify-end"
                      typeSize="small"
                      typeBackground="thin"
                    />
                  )}
                </>
              </div>
            </div>
          }
          onClick={() =>
            history.push(
              `/token/${get(token, 'chain')}/${encodeURIComponent(
                get(token, 'address', null) || ADDRESS_ZERO
              )}`
            )
          }
        />
      )
    })
  }

  const isNotEmptyData = listTokenSorted.length === 0 && tokens?.length !== 0

  return (
    <div
      className={
        'flex flex-col justify-between items-center overflow-hidden w-full'
      }>
      <div
        className={cx('overflow-auto w-full', {
          // 'h-full flex flex-col justify-center items-center': isLoading,
          'h-full': isNotEmptyData,
          'justify-center': !isNotEmptyData
        })}
        onWheel={onWheel}>
        {isNotEmptyData ? (
          <EmptyData
            title={!isLoading && t('setting_screen.no_token_were_found')}
          />
        ) : (
          renderListTokenSorted()
        )}
      </div>

      <div
        className="text-primary w-full flex items-center justify-center my-3 cursor-pointer"
        onClick={() => history.push('/add-token')}>
        <Icon name="add" className="mr-2 text-base" />
        <p className="text-h6 uppercase">{t('custom_token.add_custom_token')}</p>
      </div>
    </div>
  )
}

export default TabToken
