import type { Token, Wallet } from '@wallet/core'
import { Button, Icon, Image } from '@wallet/ui'
import { convertWeiToBalance, formatNumberBro } from '@wallet/utils'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { useMemo, useState } from 'react'
import WalletAvatar from '../../shared/WalletAvatar'

import { useSendTokenContext } from '../context'
import { TomoWallet } from 'store/types'
import { useAppSelector } from 'store'
import { renderGasFee } from '../../../common/functions'
import { useTranslation } from 'react-i18next'

type TypeSend = 'send' | 'receive'
interface IProps {
  fromWallet: Wallet | null
  toAddress: string
  walletReceiver?: Wallet | null
  memo?: string
  tokenInfo: Token | null
  amount: string
  mainBalance: number
  wallets: TomoWallet[]
  estimateGas?: string
  handleTransfer?: (
    isGestGas?: boolean,
    gasLimit?: number
  ) => Promise<string> | void
  isSendTxs?: boolean
}

const ReviewSend = (props: IProps) => {
  const { t } = useTranslation()
  const {
    fromWallet,
    walletReceiver,
    toAddress,
    memo,
    tokenInfo,
    amount,
    wallets,
    mainBalance,
    isSendTxs,
    handleTransfer
  } = props
  const {
    gasLimit,
    gasFee,
    isGasFree,
    gasDecimal,
    tokenSelected,
    getWalletByAddress,
    mainToken
  } = useSendTokenContext()

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

  const handleConfirm = async () => {
    setIsLoading(true)
    // const gasLimitEst = (gasLimit * gasPrice) / gasPriceDefault
    const gasLimitEst = gasLimit // for sei temp only

    await handleTransfer?.(false, gasLimitEst)
    setIsLoading(false)
  }

  const walletTo = useMemo(() => {
    const availableWallet = wallets.find(
      (wallet) => wallet.address === toAddress
    )
    return availableWallet || { avatar: '', address: toAddress, name: '' }
  }, [toAddress])

  const renderInfoReview = (type: TypeSend, wallet: any) => {
    const address = get(wallet, 'address', '')
    const name = get(wallet, 'name', '')

    const renderType =
      type === 'send' ? `From ${name || ''}` : `To ${name || ''}`
    return (
      <div className="flex items-center gap-4">
        <div className="avatar">
          <WalletAvatar walletSelected={wallet} className="w-10 h-10" />
        </div>

        <div>
          <p className="text-ui03 text-tiny mb-1">{renderType}</p>
          <p className="text-ui04 text-base break-all">{address}</p>
          {type === 'receive' && (
            <span
              className={`text-ui03 text-tiny break-all max-h-14 overflow-scroll inline-block ${
                !memo && 'hidden'
              }`}>
              {t('history_detail.memo')}: {memo}
            </span>
          )}
        </div>
      </div>
    )
  }

  const caculateTotal = () => {
    const price = get(tokenSelected, 'prices.price', 0)
    const total = formatNumberBro(Number(price) * Number(renderAmount()), 2)
    return { total }
  }

  return (
    <div className="px-5 h-full w-full relative flex flex-col overflow-scroll">
      <div>
        <div className="flex flex-col gap-2">
          {renderInfoReview('send', fromWallet)}
          <div className="flex items-center justify-start text-ui03 ml-2">
            <Icon className="font-semibold text-h2" name="arrow_down" />
          </div>
          {walletTo
            ? renderInfoReview('receive', walletTo)
            : renderInfoReview('receive', walletReceiver)}
        </div>
        <div className="flex items-center justify-between py-4 border-b border-ui01">
          <div className="flex items-center">
            <Image
              className="w-10 h-10 rounded-full mr-4"
              src={get(tokenInfo, 'image', '_')}
            />
            <p className="text-base font-semibold text-ui04 uppercase">
              {get(tokenInfo, 'symbol')}
            </p>
          </div>
          <div className="text-right">
            <p className="text-base font-semibold text-ui04">
              {formatNumberBro(renderAmount())}
            </p>
            <p className="text-tiny text-ui03">~${caculateTotal().total}</p>
          </div>
        </div>

        {!isGasFree ? (
          <div className="flex items-center justify-between mt-4">
            <p className="text-tx-secondary text-tiny">
              {t('setting_screen.estimated_gas_fee')}
            </p>
            <p className="text-tx-primary text-tiny">
              {formatGasFee} {get(activeNetwork, 'symbol')} ~
              {`$${renderGasFee(formatGasFee, tokens)}`}
            </p>
          </div>
        ) : (
          <div className="body-14-regular text-ui04">
            {t('wrap_send.network_gas_free')}
          </div>
        )}
      </div>
      <div className="mt-auto ">
        <Button
          disabled={isLoading}
          isLoading={isLoading || isSendTxs}
          onClick={handleConfirm}
          className="w-full mt-3"
          type="primary">
          {t('setting_screen.confirm')}
        </Button>
      </div>
    </div>
  )
}

export default ReviewSend
