/* eslint-disable multiline-ternary */

import { cx } from '@wallet/utils'
import React from 'react'
import type { FC } from 'react'

import Loader from '../Loader'
import useTheme from '../../../hooks/useTheme'

interface IEmptyData {
  title?: string
  isLoading?: boolean
  isFullScreen?: boolean
  className?: string
}

const EmptyData: FC<IEmptyData> = ({ title, isLoading }) => {
  const { isDarkTheme } = useTheme()
  return (
    <div className="empty-data w-full h-full height-ignore-footer all-center flex-col">
      {isLoading ? (
        <img
          className={cx('block h-12 w-12 animate-bounce', {})}
          src={`/public/img/brand/${isDarkTheme ? 'logo-dark' : 'logo-light'}.svg`}
        />
      ) : (
        // <Loader width="100px" height="100px" />
        <>
          {/* <div className="empty-data__image image-not-found">
            <img
              src="/public/img/icons/empty_outline.svg"
              alt=""
              className="w-[96px] h-[96px]"
            />
          </div> */}
          <div className="empty-data__title mt-6 text-sub text-ui02">
            {title}
          </div>
        </>
      )}
    </div>
  )
}

export default EmptyData
