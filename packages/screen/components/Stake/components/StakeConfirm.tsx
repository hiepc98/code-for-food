import { Button, Image } from '@wallet/ui'
import { convertWeiToBalance, formatNumberBro } from '../../../utils'
import get from 'lodash/get'
import { useState } from 'react'

import { useStakingContext } from '../context'
import { useAppSelector } from 'store'
import { renderGasFee } from '../../../common/functions'
import { useTranslation } from 'react-i18next'
import UnstakeReminder from './UnstakeReminder'
import round from 'lodash/round'

type TypeSend = 'send' | 'receive'
interface IProps {
  mainBalance: number | string
}

const StakeConfirm = (props: IProps) => {
  const { t } = useTranslation()
  const { mainBalance } = props

  const {
    gasLimit,
    gasFee,
    gasDecimal,
    tokenSelected,
    walletSelected,
    handleTransfer,
    isStaking,
    amount,
    memo,
    selectedValidator,
    stakingApr,
    isUnstake
  } = useStakingContext()

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

    await handleTransfer?.(false, gasLimit)
    setIsLoading(false)
  }

  const caculateTotal = () => {
    const price = get(tokenSelected, 'prices.price', 0)
    const total = formatNumberBro(Number(price) * Number(renderAmount()), 2)
    return { total }
  }

  const dataReward = get(selectedValidator, 'dataReward', {})
  const masterNodeROI = get(dataReward, 'mnROI', 0)
  const voterROI = get(dataReward, 'voterROI', 0)

  const handleOpenReminder = () => {
    window.openModal({
      type: 'none',
      title: '',
      content: <UnstakeReminder />,
      contentType: 'other',
      closable: true,
      onCancel: () => {
        window.closeModal()
      }
    })
  }

  return (
    <div className="px-5 h-full w-full relative flex flex-col overflow-scroll">
      <div>
        <div className="flex flex-col">
          <p className="text-tx-secondary body-14-regular">
            {t('stake_screen.stake_description')}
          </p>
        </div>
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
              {formatNumberBro(renderAmount())}
            </p>
            <p className="body-14-regular text-tx-secondary">
              ~${caculateTotal().total}
            </p>
          </div>
        </div>
        {!isUnstake && (
          <div className="flex items-center justify-between py-6 border-b border-ui01">
            <p className="text-tx-secondary body-14-regular">
              {t('stake_screen.roi')}
            </p>
            <p className="text-tx-primary body-14-regular">
              {round(voterROI, 2) + '%'}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between py-6 border-b border-ui01">
          <p className="text-tx-secondary body-14-regular">
            {t('stake_screen.validator')}
          </p>
          <p className="text-tx-primary body-14-regular">
            {get(selectedValidator, 'name', '')}
          </p>
        </div>
        <div className="flex items-center justify-between py-6 border-b border-ui01">
          <p className="text-tx-secondary body-14-regular">
            {t('setting_screen.estimated_gas_fee')}
          </p>
          <p className="text-tx-primary body-14-regular">
            {formatGasFee} {get(activeNetwork, 'symbol')} ~
            {`$${renderGasFee(formatGasFee, tokens)}`}
          </p>
        </div>
        {isUnstake ? (
          <p className="text-tx-secondary body-14-regular">
            {t('stake_screen.unstaking_remind', { hours: 48 })}
          </p>
        ) : (
          <div className="flex items-center justify-between py-6">
            <p className="text-tx-primary body-14-bold">
              {t('stake_screen.unstaking_condition', { hours: 48 })}
            </p>
            <p
              className="text-brand-highlight body-14-regular cursor-pointer"
              onClick={handleOpenReminder}>
              {t('stake_screen.view_details')}
            </p>
          </div>
        )}
      </div>
      <div className="mt-auto ">
        <Button
          disabled={isLoading}
          isLoading={isLoading || isStaking}
          onClick={handleConfirm}
          className="w-full h-[62px] mt-3"
          type="primary">
          {t('setting_screen.confirm')}
        </Button>
      </div>
    </div>
  )
}

export default StakeConfirm
