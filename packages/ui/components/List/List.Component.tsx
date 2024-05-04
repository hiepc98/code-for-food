import React, { FC } from 'react'
import { cx } from '@wallet/utils'
import { Icon, IconType } from '../Icon/Icon.component'
import { Image } from '../Image/Image.Component'
export const List: FC = () => {
  return <div>List.Component</div>
}

// @ts-expect-error
interface IListItem extends React.HTMLAttributes<HTMLDivElement> {
  showArrow?: boolean
  rightView?: React.ReactNode | any
  icon?: IconType
  image?: string
  symbol?: string
  title: string | JSX.Element
  description?: string | JSX.Element
  hideSymbol?: boolean
  hideImage?: boolean
  imageBackgroundColor?: string
  iconClassName?: string
  showBorder?: boolean
}

export const ListItem: FC<IListItem> = ({
  className,
  image,
  children,
  showArrow,
  rightView,
  icon,
  title,
  description,
  hideSymbol,
  symbol,
  hideImage,
  imageBackgroundColor,
  iconClassName,
  showBorder,
  ...props
}) => {
  return (
    <div
      className={cx(
        'flex gap-3 px-5 py-4 h-14 transition ease-in-out hover:bg-ui01 cursor-pointer items-center min-h-[76px]',
        showBorder && 'has-divider',
        className
      )}
      {...props}>
      {icon && (
        <div className="relative h-10 w-10 all-center bg-ui01">
          <Icon name={icon} className="leading-none text-h3 text-ui04" />{' '}
        </div>
      )}

      <div
        className={`${
          hideImage && 'hidden'
        } relative h-10 w-10 all-center rounded-full bg-ui01 flex-shrink-0`}>
        {/* <Image
          src={symbol}
          className={`${
            hideSymbol && 'hidden'
          } absolute w-5 h-5 rounded-full overflow-hidden border-2 border-ui00`}
          style={{ bottom: '-8px', right: '-2px' }}
        /> */}
        <Image
          src={image}
          isRenderBlank={false}
          className={`${
            hideImage && 'hidden'
          } bg-${imageBackgroundColor} w-full h-full object-contain rounded-full overflow-hidden`}
        />
      </div>

      <div>
        <div className="header-05 text-tx-primary">{title}</div>
        {description && (
          <div className="body-14-regular text-tx-secondary">{description}</div>
        )}
      </div>
      {showArrow && (
        <div className="h-full all-center ml-auto text-h2 flex item-center">
          <Icon
            name="chevron_right"
            className={cx('text-icon-hint', iconClassName)}
          />
        </div>
      )}
      {rightView}
    </div>
  )
}
