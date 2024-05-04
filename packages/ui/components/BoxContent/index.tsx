import { cx } from '@wallet/utils'
import { type ReactNode } from 'react'

interface IProps {
  className?: string
  children: ReactNode
}

export const BoxContent = (props: IProps) => {
  const { className, children } = props

  const clsx = cx(`bg-ui01 px-4 ${className}`)
  return <div className={clsx}>{children}</div>
}
