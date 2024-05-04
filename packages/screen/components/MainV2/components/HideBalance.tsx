import { cx } from '@wallet/utils'
import times from 'lodash/times'

type size = 'small' | 'medium' | 'large'
type color = 'bold' | 'thin'

interface IAmountDot {
  amountDot: number
  typeSize: size
  typeBackground: color
  className?: string
}

const HideBalance = (props: IAmountDot) => {
  const { amountDot, typeSize, typeBackground, className } = props
  return (
    <div className={cx(`flex items-center gap-1 ${className}`)}>
      {times(amountDot, (i) => {
        return (
          <div
            key={i}
            className={cx('rounded-full', {
              'w-[8px] h-[8px]': typeSize === 'small',
              'w-[12px] h-[12px]': typeSize === 'medium',
              'bg-ui02': typeBackground === 'thin',
              'bg-ui04': typeBackground === 'bold'
            })}></div>
        )
      })}
    </div>
  )
}

export default HideBalance
