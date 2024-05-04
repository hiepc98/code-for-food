import React, { useEffect, useRef } from 'react'
import CountUp from 'react-countup'

interface ICountup {
  endNum : number
  decimals?: number,
  prefix?: string
  className? : string
  duration?: number,
  suffix?:string
}
function NumCountUp (props : ICountup) {
  const previousValue = useRef(0)
  const { endNum, decimals = 4, prefix, className, duration = 0.5, suffix } = props

  useEffect(() => {
    previousValue.current = endNum || 0
  }, [endNum])

  // const renderPrefix = useMemo(() => {
  //   if (isCheckAprByAmount) return ''
  //   const isVND = get(currencyRedux, 'label') === 'VND'
  //   const currencyIcon = CURRENCY_SYMBOL[get(currencyRedux, 'label', 'USD')]
  //   if (!isCurrency) {
  //     return ''
  //   }
  //   if (isVND) {
  //     return ''
  //   }
  //   return currencyIcon
  // }, [currencyRedux, isCurrency])

  // const renderSuffix = useMemo(() => {
  //   if (!isCurrency) return suffix
  //   const isVND = get(currencyRedux, 'label') === 'VND'
  //   const currencyIcon = CURRENCY_SYMBOL[get(currencyRedux, 'label', 'USD')]
  //   if (isVND) return currencyIcon
  //   return suffix
  // }, [isCurrency, currencyRedux])

  return (
    <div className={className}>
      <CountUp
        start={0}
        duration={duration}
        end={Number(endNum)}
        decimals={decimals}
        separator=","
        suffix={suffix || ''}
        prefix={prefix || ''}
      />
    </div>

  )
}

export default NumCountUp
