/* eslint-disable multiline-ternary */

import { cx } from '@wallet/utils'
import type { FC } from 'react'

interface IEmptyData {
  title?: string
  isLoading?: boolean
  isFullScreen?: boolean
  className?: string
  isDarkTheme?: boolean
}

export const EmptyData: FC<IEmptyData> = ({
  title,
  isLoading,
  isDarkTheme
}) => {
  return (
    <div className="empty-data w-full h-full height-ignore-footer all-center flex-col">
      {isLoading ? (
        <img
          className={cx('block h-12 w-12 animate-bounce', {})}
          src={`/public/img/brand/${
            isDarkTheme ? 'logo-dark' : 'logo-light'
          }.svg`}
        />
      ) : (
        <>
          {/* <div className="empty-data__image image-not-found">
            <img
              src="/public/img/icons/empty_outline.svg"
              alt=""
              className="w-[96px] h-[96px]"
            />
          </div> */}
          <div className="empty-data__title mt-6 text-sub text-ui02 text-h5">
            {title}
          </div>
        </>
      )}
    </div>
  )
}
