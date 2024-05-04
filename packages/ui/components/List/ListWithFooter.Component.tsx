import React, { FC, HTMLAttributes } from 'react'
import { cx } from '@wallet/utils'
import { IconType } from '../Icon/Icon.component'
import { ListItem } from './List.Component'

interface IListItemWithFooter extends HTMLAttributes<HTMLDivElement> {
  showArrow?: boolean
  rightView?: React.ReactNode | any
  icon?: IconType
  image?: string
  symbol?: string
  title: string | any
  description?: string | React.JSX.Element
  hideSymbol?: boolean
  hideImage?: boolean
  imageBackgroundColor?: string
  rootClassName?: string
  children?: React.ReactNode
  iconClassName?: string
  showBorder?: boolean
}

export const ListItemWithFooter: FC<IListItemWithFooter> = (props) => {
  const { rootClassName } = props

  return (
    <div
      className={cx(
        'flex transition ease-in-out hover:bg-ui01 cursor-pointer has-divider items-start min-h-[76px] flex-col justify-start',
        rootClassName
      )}>
      <ListItem {...props} />
      {props.children}
    </div>
  )
}
