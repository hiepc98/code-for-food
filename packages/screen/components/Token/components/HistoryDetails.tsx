import type { Token, Wallet, IGasEstimate } from '@wallet/core'
import { Image } from '@wallet/ui'
import {
  convertWeiToBalance,
  formatNumberBro
} from '@wallet/utils'
import { DECIMALS_TOKEN_DISPLAY } from '../../../constants'
import dayjs from 'dayjs'
import get from 'lodash/get'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'store'
import type { HistoryItem } from '../../Wallet/HistoryScreen/services'
import { HISTORY_TYPE } from '../../Wallet/HistoryScreen/utils/constants'
import useTokenLocal from '../../../hooks/useTokenLocal'
import { TomoWallet } from 'store/types'
import { useSendTokenContext } from '../context'
import LoadingCircle from '../../shared/LoadingCircle'
import { BounceLoader } from 'react-spinners'
import { viewScan } from '../../../common/functions'

interface HistoryDetailsProps {
  history: HistoryItem
  amount: string | number
  tokenInfo: Token
  currentWallet?: Wallet
  t: any
}

const HistoryDetails = (props: HistoryDetailsProps) => {
  const { history, amount, currentWallet, tokenInfo, t } = props
  const { getTokenMain } = useTokenLocal()
  const [gasFree, setGasFree] = useState<Record<string, boolean>>({ value: false, isLoading: false })


  const [wallets, walletsByUser, activeWalletStore, activeNetwork] =
    useAppSelector((state) => {
      return [
        state.wallet.wallets,
        state.wallet.walletsByUser,
        state.wallet.activeWallet,
        state.setting.activeNetwork
      ]
    })

  const historyVariant = {
    [HISTORY_TYPE.SEND]: {
      className: 'text-red'
    },
    [HISTORY_TYPE.RECEIVE]: {
      className: 'text-green'
    },
    [HISTORY_TYPE.SELF]: {
      className: 'text-green'
    }
  }

  const activeWallet = currentWallet || activeWalletStore

  const getTypeHistory = () => {
    let typeHistory: any = compareAddress(history.from)
      ? HISTORY_TYPE.SEND
      : HISTORY_TYPE.RECEIVE

    if (typeHistory === HISTORY_TYPE.SEND && compareAddress(history.to)) {
      typeHistory = HISTORY_TYPE.SELF
    }

    return typeHistory
  }

  const compareAddress = (address: string) => {
    if (!activeNetwork) {
      const walletArr = walletsByUser[activeWallet.address]
      const addressArr = walletArr.map((wallet: TomoWallet) => wallet.address?.toLowerCase())
      return addressArr.includes(address.toLowerCase())
    }

    return (activeWallet?.address?.toLowerCase() === address.toLowerCase())
  }

  const { className } = historyVariant[getTypeHistory()]
  const prefix = getTypeHistory() !== HISTORY_TYPE.SEND ? '+' : '-'

  const renderWalletName = (address: string) => {
    const availableAddress = wallets.find(
      (wallet) => wallet.address === address
    )
    return availableAddress ? availableAddress.name : ''
  }

  const openScan = () => {
    const hash = get(history, 'hash') || get(history, 'transactionHash')
    const chain = get(history, 'chain') || get(tokenInfo, 'chain')
    viewScan(hash!, false, chain)
  }

  const renderGasFee = useCallback(() => {
    const mainToken = getTokenMain()

    const gasFee =
      Number(get(history, 'gasPrice')) *
      Number(get(history, 'gasUsed') || get(history, 'gas'))

    const amount = Number(
      formatNumberBro(
        convertWeiToBalance(gasFee.toString(), get(mainToken, 'decimal', '')),
        DECIMALS_TOKEN_DISPLAY[mainToken.symbol] || 6
      )
    )
    let lasAmount = amount + ` ${get(mainToken, 'symbol')}`

    const price = get(mainToken, 'prices.price', null)

    if (price) {
      lasAmount =
        amount +
        ` ${get(mainToken, 'symbol')}` +
        ` (~$${formatNumberBro(amount * price, 4)})`
    }

    return lasAmount
  }, [])

  useEffect(() => {
    async function historyEstimateGas () {
      setGasFree({ value: false, isLoading: true })
      const estimateGasResponse = await window.walletServices.estimateGas({
        token: tokenInfo,
        wallet: currentWallet,
      }) as IGasEstimate
      
      setGasFree({ value: !!estimateGasResponse?.isGasFree, isLoading: false })
    }

    historyEstimateGas()
  }, [window.walletServices])

  const caculateTotal = () => {
    const price = get(tokenInfo, 'prices.price', 0)
    const total = formatNumberBro(Number(price) * Number(amount), 2)
    return { total }
  }

  return (
    <div className="w-full h-full p-5 mt-20 relative flex flex-col overflow-scroll">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              className="w-10 h-10 rounded-full mr-3"
              src={get(tokenInfo, 'image', '')}
            />
            <div>
              <p className="text-base text-ui04 font-semibold">
                {get(tokenInfo, 'name', '')}
              </p>
              <p className="text-tiny text-ui03 uppercase">
                {get(tokenInfo, 'symbol', '')}
              </p>
            </div>
          </div>
          <div className='text-right'>
            <p className={`text-base uppercase ${className}`}>
              {prefix}
              {amount} {get(tokenInfo, 'symbol')}
            </p>
            <p className='text-ui03 text-tiny text-right'>~${caculateTotal().total}</p>
          </div>
        </div>
        <div className="mt-3">
          <div className="grid grid-cols-2 gap-2 border-b border-ui01 last:border-b-0 pb-4 pt-3">
            <p className="text-ui03 text-tiny">{t('Date')}</p>
            <p className="text-ui04 text-base text-right break-words">
              {dayjs(get(history, 'date', 0) as number * 1000).format('HH:mm DD/MM/YYYY')}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 border-b border-ui01 last:border-b-0 py-4">
            <p className="col-span-1 text-ui03 text-tiny">{t('Gas fee')}</p>
            <div className="col-span-2 text-ui04 text-base text-right break-words">
              { gasFree.isLoading ? 
                <div className='flex justify-end w-full h-full'><BounceLoader color="#666666" size={12} /></div>:
                gasFree.value ? t('history_detail.zero_gas') : <div className='uppercase'>{renderGasFee()}</div>
              }
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2 border-b border-ui01 last:border-b-0 py-4 items-start">
            <div className="w-full col-span-2">
              <p className="text-ui03 text-h6 break-words">{t('From')} {renderWalletName(get(history, 'from', ''))}</p>
            </div>
            <div className="flex items-center justify-end w-full col-span-3">
              <p className="text-ui04 text-base text-right break-words w-full">
                {get(history, 'from', '').toLowerCase()}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2 border-b border-ui01 last:border-b-0 py-4 items-start">
            <div className="w-full col-span-2">
              <p className="text-ui03 text-tiny break-words">{t('To')} {renderWalletName(get(history, 'to', ''))}</p>
            </div>
            <div className="flex items-center justify-end w-full col-span-3">
              <p className="text-ui04 text-base text-right break-words w-full">
                {get(history, 'to', '').toLowerCase()}
              </p>
            </div>
          </div>
          <div className="pl-0 pt-6 text-center">
            <span
              onClick={openScan}
              className="w-full text-h5 text-primary uppercase cursor-pointer">
              {t('View on block explorer')}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HistoryDetails
