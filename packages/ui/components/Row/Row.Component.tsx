import { cx } from '@wallet/utils'
import { Icon, IconType } from '../Icon/Icon.component'
import React, { FC, HTMLAttributes } from 'react'

interface PushableProps extends HTMLAttributes<HTMLDivElement> {
    title: string
    content?: string
    icon: IconType
}

export const Row: FC<PushableProps> = (props) => {
  const { title, content, icon, className, ...restProps } = props
  return (
        <div className={cx('flex items-center w-full py-4 cursor-pointer transition-all', className)} {...restProps}>
            <div className="rounded-full w-10 h-10 bg-primary text-white all-center mr-3 text-h3">
                <Icon name={icon} className='text-ui00' />
            </div>

            <div>
                <div className='text-ui04 font-medium text-base'>
                    {title}
                </div>
                {content && <div className="text-ui03">
                    {content}
                </div>}

            </div>

            <div className='h-full all-center ml-auto text-h3'>
                <Icon name='arrow_right' className='text-ui02'/>
            </div>
        </div>
  )
}
