import React, { useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { onChangeGetStarted, useAppDispatch } from 'store'
import LottieImage from '../../../components/shared/LottieImage'
import withI18nProvider from '../../../provider'
import { useTranslation } from 'react-i18next'
import { cx } from '@wallet/utils'
import useTheme from '../../../hooks/useTheme'
// import { onChangeGetStarted } from '~controllers/stores/reducers/storages/settingSlice'

// import LogoAnimation from '~shared/components/LogoAnimation'

const GetStartedScreen = ({ loader } : { loader: any }) => {
  const { t } = useTranslation()
  const history = useHistory()
  const { isDarkTheme } = useTheme()
  const [isCompleted, setIsCompleted] = useState(false)
  const dispatch = useAppDispatch()

  const [delay, setDelay] = useState(true)
  useEffect(() => {
    if (isCompleted) {
      history.push('/choose-theme')
      dispatch(onChangeGetStarted(true))
    }
  }, [isCompleted])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDelay(false)
      setIsCompleted(true)
    }, 2000)

    return () => {
      clearTimeout(timeout)
    }
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 h-full w-screen all-center bg-[#E0DED8]">
      {delay && (
        <img
          className={cx('h-20 w-screen animate-bounce', {})}
          src={`/public/img/brand/logo-light.svg`}
        />
      )}
    </div>
  )
}

export default withI18nProvider(GetStartedScreen)
