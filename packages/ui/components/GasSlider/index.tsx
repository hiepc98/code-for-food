import type { IGasStep, Wallet } from '@wallet/core'
import { Icon } from '@components/Icon/Icon.component'
import { Slider } from '@components/Slider/Slider.component'
import { convertWeiToBalance, cx, formatNumberBro } from '@wallet/utils'
import get from 'lodash/get'
import { useEffect, useState } from 'react'

import { BounceLoader } from 'react-spinners'
import { BoxContent } from '../BoxContent'

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
  onChange: (gasFee?: number, gasPrice?: number) => void
  setIsCustomGas?: (value: boolean) => void
  t: (key: string, params?: any) => string
  walletSelected?: Wallet
}

export const GasSlider = (props: IProps) => {
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
    onChange,
    setIsCustomGas,
    t,
    walletSelected
  } = props

  const meansValue = 100 / 2
  const [valueRangeSlider, setValueRangeSlider] = useState(0)

  const gasFull = [
    { value: gasStep?.standard, label: `${t('send_from_screen.standard')}` },
    { value: gasStep?.fast, label: `${t('send_from_screen.fast')}` },
    { value: gasStep?.fastest, label: `${t('send_from_screen.fastest')}` }
  ]

  useEffect(() => {
    calculateFee(1)
    if (gasFee && gasLimit) {
      // keep valueRangeSlider case stepTo back to stepFrom
      const step = gasFee / gasLimit
      const idxSlide = gasFull.findIndex((item) => item.value === step)
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

  const onScrollSliderGas = (value: any) => {
    const idxSlide = value / meansValue

    const step =
      idxSlide >= 0 ? get(gasFull, `${idxSlide}.value`) : gasFull[0].value

    calculateFee(step || 0)

    setValueRangeSlider(idxSlide)
  }

  const onToggleCustomGas = () => {
    calculateFee(1)
    setValueRangeSlider(0)
    setIsCustomGas?.(!isCustomGas)
  }

  const formatGasFee = formatNumberBro(
    convertWeiToBalance(String(gasFee), gasDecimal),
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
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-1">
          <p className="text-ui03 text-tiny">
            {t('send_from_screen.est_gas_fee')}
          </p>
          <div className="text-ui04 text-tiny flex items-center">
            {isLoading ? <BounceLoader size={12} /> : gasFeeCheck()}{' '}
            <span className="ml-1">
              {get(walletSelected, 'symbol') || symbol}
            </span>
          </div>
        </div>
      </div>
    </BoxContent>
  )
}
