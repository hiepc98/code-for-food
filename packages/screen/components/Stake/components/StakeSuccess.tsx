import type { Token, Wallet } from '@wallet/core'
import { Button, Icon, Image } from '@wallet/ui'
import { convertWeiToBalance, formatNumberBro } from '../../../utils'
import get from 'lodash/get'
import { useState, useMemo } from 'react'
import cn from 'classnames'

import { useAppSelector } from 'store'
import { renderGasFee } from '../../../common/functions'
import { useTranslation } from 'react-i18next'
import { viewScan } from '../../../common/functions'
import { useHistory } from 'react-router-dom'
import withI18nProvider from '../../../provider'
import round from 'lodash/round'

type TypeSend = 'send' | 'receive'
interface IProps {
  mainBalance: number | string
  gasFee: string
  gasDecimal: number
  tokenSelected: Token | null
  walletSelected: Wallet | null
  isStaking: boolean
  amount: string
  selectedValidator: any
  stakingApr: number
  hash: string | string[]
  chain: string
  isFailed: boolean
  isWithdraw?: boolean
  isStake?: boolean
  isUnstake?: boolean
  withdrawList?: any
}
const StakeSuccess = (props: IProps) => {
  const { t } = useTranslation()

  const {
    gasFee,
    gasDecimal,
    tokenSelected,
    walletSelected,
    isStaking,
    amount,
    selectedValidator,
    stakingApr,
    mainBalance,
    hash,
    chain,
    isFailed,
    isWithdraw = false,
    isStake = false,
    isUnstake = false,
    withdrawList = []
  } = props

  const history = useHistory()

  const [activeNetwork, tokens] = useAppSelector((state) => [
    state.setting.activeNetwork,
    state.wallet.tokens
  ])

  const [isLoading, setIsLoading] = useState(false)

  const renderAmount = () => {
    const amountAndGasFee = Number(amount) + Number(formatGasFee)

    const isMainToken =
      get(tokenSelected, 'isMain') || !get(tokenSelected, 'address')

    if (isMainToken && Number(amountAndGasFee) > Number(mainBalance)) {
      return Number(amount) - Number(formatGasFee)
    }
    return amount
  }

  const feeEst = convertWeiToBalance(gasFee as any, gasDecimal)

  const formatGasFee = formatNumberBro(feeEst, feeEst > 0.0001 ? 4 : 6)

  const caculateTotal = () => {
    const price = get(tokenSelected, 'prices.price', 0)
    const total = formatNumberBro(Number(price) * Number(renderAmount()), 2)
    return { total }
  }

  const totalWithdraw = useMemo(() => {
    const total = withdrawList?.reduce((acc: any, it: any) => {
      return acc + Number(it.cap)
    }, 0)
    return convertWeiToBalance(total || '0', get(tokenSelected, 'decimal', 18))
  }, [withdrawList])

  const totalFiat = useMemo(() => {
    const price = get(tokenSelected, 'prices.price', 0)
    const total = formatNumberBro(Number(price) * Number(totalWithdraw), 2)
    return total
  }, [totalWithdraw, tokenSelected])


  const onCloseModalSuccess = () => {
    window.closeModal()
    history.push('/main', {
      isReload: true
    })
  }

  const openScan = (hashTransaction: string) => {
    viewScan(hashTransaction, false, chain)
  }

  const dataReward = get(selectedValidator, 'dataReward', {})
  const masterNodeROI = get(dataReward, 'mnROI', 0)
  const voterROI = get(dataReward, 'voterROI', 0)
  console.log(hash)

  return (
    <div className="w-full h-full p-5 mt-20 relative flex flex-col overflow-scroll">
      <div className="flex w-full h-full flex-col">
        <div className="flex items-center justify-between py-4 border-b border-ui01">
          <div className="flex items-center">
            <Image
              className="w-10 h-10 rounded-full mr-4"
              src={get(tokenSelected, 'image', '_')}
            />
            <p className="header-05 text-tx-primary uppercase">
              {get(tokenSelected, 'symbol')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-tx-primary header-04 text-ui04">
              {isWithdraw
                ? formatNumberBro(totalWithdraw, 7)
                : formatNumberBro(renderAmount())}
            </p>
            <p className="body-14-regular text-tx-secondary">
              ~${isWithdraw ? totalFiat : caculateTotal().total}
            </p>
          </div>
        </div>
        {isStake && (
          <div className="flex flex-col">
            <div className="flex items-center justify-between py-6 border-b border-ui01">
              <p className="text-tx-secondary body-14-regular">
                {t('stake_screen.apr')}
              </p>
              <p className="text-tx-primary body-14-regular">
                {round(voterROI, 2)}%
              </p>
            </div>
            <div className="flex items-center justify-between py-6 border-b border-ui01">
              <p className="text-tx-secondary body-14-regular">
                {t('stake_screen.validator')}
              </p>
              <p className="text-tx-primary body-14-regular">
                {get(selectedValidator, 'name', '')}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between py-6 border-b border-ui01">
          <p className="text-tx-secondary body-14-regular">
            {t('history_detail.status')}
          </p>
          <p
            className={cn('body-14-regular', {
              'text-sem-success': !isFailed,
              'text-sem-danger': isFailed
            })}>
            {isFailed
              ? t('history_detail.failed')
              : t('history_detail.completed')}
          </p>
        </div>
        <div className="flex items-center justify-between py-6 border-b border-ui01">
          <p className="text-tx-secondary body-14-regular">
            {t('history_detail.total_fees')}
          </p>
          <p className="text-tx-primary body-14-regular">
            {formatGasFee} {get(activeNetwork, 'symbol')} ~
            {`$${renderGasFee(formatGasFee, tokens)}`}
          </p>
        </div>
        {isUnstake && (
          <p className="text-tx-secondary body-14-regular pt-4">
            {t('stake_screen.unstaking_remind', { hours: 48 })}
          </p>
        )}
        {hash && typeof hash === 'string' ? (
          <div className="flex items-center justify-center py-6">
            <p
              className="text-brand-highlight body-14-regular cursor-pointer"
              onClick={() => openScan(hash)}>
              {t('history_detail.view_on_block_explorer')}
            </p>
          </div>
        ) : (
          <div className="flex py-6 flex-col gap-4 pt-8">
            <p className="text-tx-primary body-14-regular">
              {t('history_detail.view_on_block_explorer')}
            </p>
            <div className="w-full grid grid-cols-3">
              {Array.isArray(hash) && hash.length > 0 &&
                hash!.map((it: any, index: number) => (
                  <p
                    key={index}
                    className="text-brand-highlight body-14-regular cursor-pointer underline"
                    onClick={() => openScan(get(it, 'transactionHash', ''))}>
                    Transaction {index + 1}
                  </p>
                ))}
            </div>
          </div>
        )}
        <div className="mt-auto bottom-4 left-0 flex flex-col items-center justify-center w-full">
          <Button
            disabled={isLoading}
            isLoading={isLoading || isStaking}
            onClick={onCloseModalSuccess}
            className="w-full h-[2.75rem] mt-3"
            type="primary">
            {t('history_detail.done')}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default withI18nProvider(StakeSuccess)
