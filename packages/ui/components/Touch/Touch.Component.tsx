import React from 'react'
import { cx } from '@wallet/utils'

interface Size {
  width: number | string
  height: number | string
}

interface ITouch extends React.HTMLAttributes<HTMLDivElement> {
  size?: number | string | Size
}

export const Touch: React.FC<ITouch> = ({
  size = 32,
  className,
  children,
  ...props
}) => {
  return (
    <div
      className={cx('transition rounded-full hover:opacity-50 cursor-pointer all-center', className)}
      style={{
        width: typeof size === 'object' ? size.width : size,
        height: typeof size === 'object' ? size.height : size
      }}
      {...props}
    >
      {children}
    </div>
  )
}
