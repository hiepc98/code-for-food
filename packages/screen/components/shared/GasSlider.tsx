import type { IGasStep } from '@wallet/core'
import { Icon, Slider } from '@wallet/ui'
import { convertWeiToBalance, cx, formatNumberBro } from '@wallet/utils'
import get from 'lodash/get'
import { useEffect, useState } from 'react'
import { getLength, renderGasFee } from '../../common/functions'

import LoadingCircle from '../shared/LoadingCircle'
import withI18nProvider from '../../provider'
import { useTranslation } from 'react-i18next'

import BoxContent from './BoxContent'
import CustomGasInput from './CustomGasInput'
import { useAppSelector } from 'store'

interface IProps {
  className?: string
  gasLimit?: number
  isLoading?: boolean
  gasFee?: number
  isCustomGas?: boolean
  gasStep?: IGasStep
  gasDecimal?: number
  chain?: string
  symbol?: string
  multiplier?: number
  onChange: (gasFee?: number, gasPrice?: number) => void
  setIsCustomGas: (value: boolean) => void
  t?: any
}

const GasSlider = (props: IProps) => {
  const {
    className,
    gasLimit,
    gasFee,
    gasDecimal,
    isLoading,
    isCustomGas,
    gasStep,
    chain,
    symbol,
    multiplier,
    onChange,
    setIsCustomGas
  } = props
  const { t } = useTranslation()

  const meansValue = 100 / 2
  const [valueRangeSlider, setValueRangeSlider] = useState(0)
  const gasStepStandard = gasStep?.standard

  const [tokens, activeNetwork] = useAppSelector((state) => [
    state.wallet.tokens,
    state.setting.activeNetwork
  ])

  const gasFull = [
    { value: gasStepStandard!, label: `${t('send_from_screen.standard')}` },
    { value: gasStepStandard! * 1.5, label: `${t('send_from_screen.fast')}` },
    { value: gasStepStandard! * 2, label: `${t('send_from_screen.fastest')}` }
    // { value: gasStepStandard! * 3, label: `${t('send_from_screen.gaswar')}` },
    // { value: gasStepStandard! * 10, label: `${t('send_from_screen.starwar')}` }
  ]

  useEffect(() => {
    calculateFee(1)
    if (gasFee && gasLimit) {
      // keep valueRangeSlider case stepTo back to stepFrom
      const step = formatNumberBro(gasFee / gasLimit, 3)
      const idxSlide = gasFull.findIndex((item) => item.value === Number(step))
      setValueRangeSlider(idxSlide)
      onChange(gasFee)
    }
  }, [])

  const calculateFee = (step: number) => {
    const gasPrice = step
    if (gasLimit) {
      const gasFee = gasLimit * gasPrice
      onChange && onChange(gasFee, gasPrice)
    }
  }

  const onScrollSliderGas = (value: number) => {
    const idxSlide = value / meansValue
    const step =
      idxSlide >= 0 ? get(gasFull, `${idxSlide}.value`) : gasFull[0].value

    calculateFee(step!)

    setValueRangeSlider(idxSlide)
  }

  const handleChangeCustomGas = (value: string) => {
    const gasFee = gasLimit! * Number(value)
    onChange && onChange(gasFee)
  }

  const onToggleCustomGas = () => {
    calculateFee(1)
    setValueRangeSlider(0)
    setIsCustomGas(!isCustomGas)
  }

  const formatGasFee = formatNumberBro(
    convertWeiToBalance(gasFee!.toString(), gasDecimal),
    6
  )

  const gasFeeCheck = () => {
    return Number(formatGasFee) < 0.000001 ? '<0.000001' : formatGasFee
  }

  return (
    <BoxContent className={cx(`py-3 ${className}`)}>
      <div className="flex items-center justify-between mb-1">
        <p className="font-semibold text-ui04 text-tiny">
          {isCustomGas
            ? t('send_from_screen.custom_gas')
            : get(gasFull, `${valueRangeSlider}.label`)}
        </p>
        <Icon
          onClick={onToggleCustomGas}
          name={!isCustomGas ? 'custom' : 'close'}
          className="text-h2 cursor-pointer hover:opacity-50 transition-all hidden"
        />
      </div>
      {isCustomGas ? (
        <div>
          <CustomGasInput
            chain={chain}
            gasLimit={gasLimit}
            gasFee={gasFee}
            onChange={handleChangeCustomGas}
          />
          <div className="flex items-center justify-between mt-5">
            <p className="text-ui03 text-tiny">
              {t('send_from_screen.est_gas_fee')}
            </p>
            <p className="text-ui04 text-tiny flex items-center">
              ~{gasFeeCheck()} {symbol || get(activeNetwork, 'symbol')}
            </p>
          </div>
        </div>
      ) : (
        <div>
          <div className="py-3">
            <Slider
              min={0}
              max={100}
              step={meansValue}
              value={valueRangeSlider * meansValue}
              onChange={onScrollSliderGas}
              marks={{
                [meansValue * 0]: 0,
                [meansValue * 1]: 1,
                [meansValue * 2]: 2
                // [meansValue * 3]: 3,
                // [meansValue * 4]: 4
              }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-ui03 text-tiny">
              {t('send_from_screen.est_gas_fee')}
            </p>
            <div className="text-ui04 text-tiny flex items-center">
              {isLoading || gasFee === 0 ? (
                <LoadingCircle />
              ) : multiplier ? (
                `${multiplier}x ${formatGasFee}`
              ) : (
                formatGasFee
              )}
              <span className="px-2">
                {symbol || get(activeNetwork, 'symbol')}
              </span>
              {isLoading || gasFee === 0
                ? '-'
                : `~$${renderGasFee(formatGasFee, tokens, multiplier)}`}
            </div>
          </div>
        </div>
      )}
    </BoxContent>
  )
}

export default withI18nProvider(GasSlider)
