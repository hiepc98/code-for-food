import React, { FC, ReactNode } from 'react'
import { cx } from '@wallet/utils'
import { Icon } from '../Icon/Icon.component'


interface IAlert extends React.HTMLAttributes<HTMLDivElement>{
    message?: string
    children?: ReactNode
    type?: "red" | "orange"
    // type: 'error' | 'warning' | 'success'
}

export const Alert: FC<IAlert> = ({ message, children, className, type = "red", ...rest }) => {

  const variants = {
    red: 'rgba(255, 77, 92, 0.1)',
    orange: 'bg-sem-alert'
  }

  const iconVariants = {
    red: 'text-red',
    orange: 'text-orange'
  }

  return (
    <div className={cx('w-full text-red flex p-3 items-center', variants[type], className)} {...rest}>
        <Icon name="status_alert" className={cx('mr-2 text-[24px]', iconVariants[type])}/>
        <div className='text-body-14-regular text-ui04'>
            {children || message}
        </div>
    </div>
  )
}

