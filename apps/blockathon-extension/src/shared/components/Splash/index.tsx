import useTheme from '@wallet/screen/hooks/useTheme'
import { cx } from '@wallet/utils'
import React, { type FC } from 'react'

// import useTheme from '~controllers/hooks/useTheme'

interface ISplashScreen {
  isFullScreen?: boolean
}

const SplashScreen: FC<ISplashScreen> = ({ isFullScreen }) => {
  const { isDarkTheme } = useTheme()
  return (
    <div
      className={cx('loader-animation all-center', {
        'h-screen w-screen all-center': isFullScreen,
        ' w-full h-full': !isFullScreen
      })}>
        <img
          className={cx('block h-12 w-12 animate-bounce', {})}
          // style={{
          //   width: '220px',
          //   height: '220px'
          // }}
          src={`/public/img/brand/${
            isDarkTheme ? 'logo-dark' : 'logo-light'
          }.svg`}
        />

    </div>
  )
}

export default SplashScreen
