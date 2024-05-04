import { useEffect, useMemo, useState } from 'react'
import { Image, Button } from '@wallet/ui'
import {
  truncateText,
  formatNumberBro,
  convertWeiToBalance
} from '../../../utils'
import get from 'lodash/get'
import { useTranslation } from 'react-i18next'
import withI18nProvider from '../../../provider'
import { useStakingContext } from '../context'
import GasSlider from '../../../components/shared/GasSlider'

const WithdrawReview = () => {
  const { t } = useTranslation()
  const [isCustomGas, setIsCustomGas] = useState(false)

  const {
    tokenSelected,
    selectedValidator,
    gasLimit,
    gasFee,
    isStaking,
    isLoadingGas,
    walletSelected,
    gasStep,
    gasDecimal,
    withdrawList,
    handleTransfer,
    handleChangeGas,
    handleEstGas,
    setIsUnstake,
    calculateTotalWithdraw
  } = useStakingContext()

  useEffect(() => {
    setIsUnstake?.(false)
    ;(async () => {
      await handleEstGas?.()
    })()
  }, [])

  // check if selectedValidator validatorRewards < 0.0001 INJ
  const isDisabled = useMemo(() => {
    const totalReward = calculateTotalWithdraw?.() || 0
    const yourStakeAmount = get(selectedValidator, 'stakeAmount', 0)
    if (selectedValidator && Number(yourStakeAmount) > 0) {
      return !(Number(yourStakeAmount) > 0)
    }
    return !(totalReward > 0)
  }, [selectedValidator, withdrawList])

  const totalWithdraw = useMemo(() => {
    const total = withdrawList?.reduce((acc: any, it: any) => {
      return acc + Number(it.cap)
    }, 0)
    return convertWeiToBalance(total || '0', get(tokenSelected, 'decimal', 18))
  }, [withdrawList])

  const totalFiat = useMemo(() => {
    const price = get(tokenSelected, 'prices.price', 0)
    const total = formatNumberBro(Number(price) * Number(totalWithdraw), 2)
    return ('$' + total)
  }, [totalWithdraw, tokenSelected])

  return (
    <div className="w-full h-full p-5 relative flex flex-col justify-between overflow-scroll">
      <div className="flex w-full h-full flex-col">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center cursor-pointer">
            {tokenSelected && (
              <Image
                src={get(tokenSelected, 'image', '') || '_'}
                className="w-8 h-8 rounded-full"
              />
            )}

            <div
              className={
                'flex items-center body-14-bold ml-2 uppercase text-tx-primary whitespace-pre'
              }>
              {truncateText(get(tokenSelected, 'symbol', ''), 8)}
            </div>
          </div>
          <div className="flex flex-col">
            <div
              className={'body-14-bold flex items-right text-ui04 truncate'}>
              {formatNumberBro(totalWithdraw, 7)}
            </div>
            <p className="text-ui03 text-tiny text-right">{totalFiat}</p>
          </div>
        </div>
        {/* <p className="body-16-regular text-tx-secondary">
          {t('stake_screen.withdraw_description')}
        </p>
        <p className="body-16-regular text-tx-secondary">
          {t('stake_screen.fund_withdraw', { funds: withdrawList?.length })}
        </p> */}
        <GasSlider
          chain={walletSelected?.meta?.chain || 'vic'}
          symbol={get(tokenSelected, 'symbol', 'VIC')}
          isCustomGas={isCustomGas}
          isLoading={isLoadingGas}
          gasStep={gasStep}
          gasDecimal={gasDecimal}
          onChange={handleChangeGas}
          gasFee={gasFee}
          className="mt-4"
          gasLimit={gasLimit}
          setIsCustomGas={setIsCustomGas}
          t={t}
          multiplier={withdrawList?.length}
        />
      </div>
      <Button
        isBlock
        isLoading={isStaking}
        onClick={() => handleTransfer?.(false, gasLimit)}
        disabled={isLoadingGas || isDisabled}
        // onClick={() => handleTransfer?.(false, gasLimit)}
      >
        {t('stake_screen.withdraw_now')}
      </Button>
    </div>
  )
}

export default withI18nProvider(WithdrawReview)
