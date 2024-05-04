/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Image, Icon, Input, TypeInput, BoxContent } from '@wallet/ui'
import {
  convertBalanceToWei,
  convertWeiToBalance,
  formatNumberBro,
  getLength
} from '../../../utils'
import { truncate } from '@wallet/utils'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'
import { useEffect, useMemo, useState } from 'react'

import { truncateText } from '../../../utils'
import {
  ADDRESS_TOKEN_GAS_FREE,
  DECIMALS_TOKEN_DISPLAY
} from '../../../constants'
import LoadingCircle from '../../../components/shared/LoadingCircle'

import { useStakingContext } from '../context'
import useViewport from '../../../hooks/useViewport'
import GasSlider from '../../../components/shared/GasSlider'
import { useTranslation } from 'react-i18next'
import useTheme from '../../../hooks/useTheme'
import cn from 'classnames'
import round from 'lodash/round'

interface IProps {
  errInput?: string
}

const StakeReview = (props: IProps) => {
  const {
    isLoading,
    isLoadingGas,
    tokenSelected,
    isUnstake,
    amount,
    walletSelected,
    gasFee,
    gasLimit,
    gasStep,
    gasDecimal,
    selectedValidator,
    stakingApr,
    setAmount,
    setGasFee,
    setToAddress,
    handleChangeGas,
    handleEstGas,
    updateValidator,
  } = useStakingContext()

  const { errInput } = props
  const [isCustomGas, setIsCustomGas] = useState(false)
  const [isLoadingDataReward, setIsLoadingDataReward] = useState(false)
  const { isDarkTheme } = useTheme()
  const [tokenSelectedTemp, setTokenSelectedTemp] = useState(tokenSelected)
  const [dataReward, setDataReward] = useState<any>({})
  const { t } = useTranslation()
  const { isExpand } = useViewport()

  useEffect(() => {
    if (isUnstake) {
      const stakeAmount = get(selectedValidator, 'stakeAmount', '0')
      // change amount of token selected
      const temporaryTokenSelected = {
        ...tokenSelectedTemp,
        rawBalance: convertBalanceToWei(
          stakeAmount,
          get(tokenSelectedTemp, 'decimal')
        )
      } as any

      setTokenSelectedTemp(temporaryTokenSelected)
    }
  }, [isUnstake])

  useEffect(() => {
    ;(async () => {
      await handleEstGas?.()
    })()

    const dataReward = get(selectedValidator, 'dataReward')
    if (!dataReward) {
      ;(async () => {
        try {
          setIsLoadingDataReward?.(true)
          await updateValidator?.(selectedValidator)
        } catch (e) {
          console.debug('🚀 ~ file: StakeReview.tsx:92 ~ useEffect ~ e:', e)
        } finally {
          setIsLoadingDataReward?.(false)
        }
      })()
    }
  }, [])

  useEffect(() => {
    const dataReward = get(selectedValidator, 'dataReward')
    if (dataReward) {
      setDataReward(dataReward)
    }
  }, [selectedValidator])


  useEffect(() => {
    if (isCustomGas) return
    if (!gasStep) return
    setGasFee?.(gasFee * (gasStep?.standard ?? 1))
  }, [isCustomGas])

  const decimal = get(tokenSelectedTemp, 'decimal')
  const feeTxsRaw = convertBalanceToWei('0', decimal)

  const balanceAvailable = useMemo(() => {
    const rawBalance = tokenSelectedTemp
      ? get(tokenSelectedTemp, 'rawBalance', '0')
      : '0'
    const amountAvailable = parseFloat(rawBalance) - parseFloat(feeTxsRaw)

    if (amountAvailable <= 0) {
      return '0'
    }

    return amountAvailable.toString()
  }, [tokenSelectedTemp, walletSelected])

  const onSelectMaxBalance = (rawBalance: string) => () => {
    const amountAvailable = parseFloat(rawBalance) - parseFloat(feeTxsRaw)

    const myAmount = convertWeiToBalance(amountAvailable.toString(), decimal)

    const formatAmount = String(formatNumberBro(myAmount, 4))

    setAmount?.(formatAmount)
  }

  const onChangeInput = (event: any) => {
    const amountInput = event.target.value
    setAmount?.(amountInput)
  }

  const resetAmount = () => {
    setAmount?.('')
    setToAddress?.('')
    setGasFee?.(0)
  }

  const fiatBalance = formatNumberBro(
    convertWeiToBalance(balanceAvailable, get(tokenSelectedTemp, 'decimal')),
    DECIMALS_TOKEN_DISPLAY[get(tokenSelectedTemp, 'symbol', '')] || 4
  ).toString()

  const checkLengthInfoToken =
    getLength(fiatBalance) + getLength(get(tokenSelectedTemp, 'symbol', '')) >=
    16

  const caculateTotal = () => {
    const price = get(tokenSelectedTemp, 'prices.price', 0)
    const total = formatNumberBro(Number(price) * Number(amount), 2)
    return { total }
  }

  const address = truncate(get(selectedValidator, 'candidate', ''))
  if (isLoadingDataReward) {
    return (
      <div className="flex flex-col h-full w-full all-center p-4">
        {/* <Loader width="200px" height="200px" /> */}
        <img
          className={cn('h-20 w-20 animate-bounce', {})}
          src={`/public/img/brand/${
            isDarkTheme ? 'logo-dark' : 'logo-light'
          }.svg`}
        />
      </div>
    )
  }

  return (
    <div className="px-5">
      <BoxContent className={`${errInput && 'border-sem-danger'}`}>
        <div className="flex items-center justify-between border-b-2 border-divider py-3 cursor-pointer">
          <div className="flex items-center cursor-pointer flex-row gap-2">
            <div className="relative h-10 w-10 all-center rounded-full bg-ui01 flex-shrink-0">
              <Icon name="validator" className="text-h3 text-primary" />
            </div>
            <div>
              <div
                className={`body-14-bold truncate mr-3 text-tx-primary ${
                  isExpand ? 'max-w-[200px]' : 'max-w-[140px]'
                }`}>
                {get(selectedValidator, 'name', '')}
              </div>
              <p className="text-brand-highlight body-12-bold">
                {t('stake_screen.voter_roi', {
                  // apr: it.commission.commission_rates.rate
                  roi: round(get(dataReward, 'voterROI', '0'), 2)
                }) +
                  ' | ' +
                  t('stake_screen.address', {
                    // apr: it.commission.commission_rates.rate
                    address: address
                  })}
              </p>
            </div>
          </div>
        </div>
        <div className="pt-3 pb-2">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center cursor-pointer">
              {tokenSelectedTemp && (
                <Image
                  src={get(tokenSelectedTemp, 'image', '') || '_'}
                  className="w-8 h-8 rounded-full"
                />
              )}

              <div
                className={`flex items-center body-14-bold ml-2 uppercase text-tx-primary whitespace-pre ${
                  checkLengthInfoToken && 'text-[12px]'
                }`}>
                {truncateText(get(tokenSelectedTemp, 'symbol', ''), 8)}
              </div>
            </div>
            <div className="flex">
              <div
                className={`body-14-bold flex items-center text-ui04 truncate ${
                  checkLengthInfoToken && 'text-[12px]'
                }`}>
                {isLoading ? <LoadingCircle /> : truncateText(fiatBalance, 12)}
              </div>
              <span
                className={`body-14-bold ml-1 uppercase text-ui04 ${
                  checkLengthInfoToken && 'text-[12px]'
                }`}>
                {truncateText(get(tokenSelectedTemp, 'symbol', ''), 8)}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <Input
                onChange={onChangeInput}
                value={amount}
                className="placeholder:header-02 placeholder:text-tx-hint font-semibold border-0 outline-none bg-inherit header-02 mb-0 p-0"
                decimalScale={4}
                placeholder="0.00"
                typeInput={TypeInput.Number}
              />
              {/* <span className='text-ui03 text-tiny'>-</span> */}
            </div>
            <div
              onClick={onSelectMaxBalance(
                get(tokenSelectedTemp, 'rawBalance') || '0'
              )}
              className="text-brand-highlight mt-1 body-14-bold uppercase cursor-pointer">
              {t('setting_screen.max')}
            </div>
          </div>
          <div>
            <p className="body-14-regular text-tx-secondary">
              {isEmpty(amount) ? '-' : `~$${caculateTotal().total}`}
            </p>
          </div>
        </div>
      </BoxContent>

      <div className="body-12-regular text-sem-danger mt-2">{errInput}</div>

      {!ADDRESS_TOKEN_GAS_FREE.includes(
        get(tokenSelectedTemp, 'address') || ''
      ) && (
        <GasSlider
          chain={walletSelected?.meta?.chain || 'vic'}
          symbol={get(tokenSelectedTemp, 'symbol', 'VIC')}
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
        />
      )}
    </div>
  )
}

export default StakeReview
