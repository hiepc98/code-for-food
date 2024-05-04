import { Button, Icon, Input } from '@wallet/ui'
import cn from 'classnames'
import React, { type FC, useState } from 'react'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'
import get from 'lodash/get'

import useTheme from '../../../../hooks/useTheme'
// import { encryptService } from '~controllers/services/encryption'
import {
  onChangeLockState,
  onUpdateVault,
  useAppDispatch,
  useAppSelector
} from 'store'

import { resetAllReduxStore } from '../../utils'
import withI18nProvider from '../../../../provider'
import { encryptService } from '../../../../services'

interface UnlockForm {
  password: string
  confirmPassword: string
}

interface LocationState {
  isUnlock: boolean
  path?: string
  state?: any
  cb: (isUnlocked: boolean) => void
}

interface Props {
  isModal?: boolean
  cb?: () => any
}

const UnlockScreen: FC<Props> = ({ isModal, cb }) => {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const history = useHistory()
  const { state: locationState = {} as LocationState } =
    useLocation<LocationState>()
  const { password: appTextPassword, vault } = useAppSelector(
    (state) => state.user.authentication
  )
  const hasRequest = useAppSelector(
    (state) => state.integration.requests.length > 0
  )
  const { isDarkTheme } = useTheme()
  const [errorMsg, setErrorMsg] = useState<string>(null)

  const { register, handleSubmit, watch } = useForm<UnlockForm>({
    reValidateMode: 'onChange',
    mode: 'all'
  })

  const onUnlockWallet: SubmitHandler<UnlockForm> = (data) => {
    const barePassword: string = encryptService.decrypt(appTextPassword, {
      usingPassword: false
    })
    if (barePassword === data.password) {
      dispatch(onChangeLockState(false))
      if (locationState?.cb) {
        return locationState.cb(true)
      }

      if (cb) {
        return cb()
      }

      const path = locationState?.path ?? '/main'

      return history.replace(
        hasRequest ? '/integration' : path,
        locationState?.state
      )
    }
    const maxTimeTried = 10
    const valuable = vault
      ? parseFloat(encryptService.decrypt(vault, { usingPassword: false }))
      : 0
    const timeLeft = maxTimeTried - valuable
    if (timeLeft > 1) {
      setErrorMsg(
        timeLeft === 2
          ? t('context.only_one_chance_reset')
          : t('context.warning_chance_reset', { count: timeLeft - 1 })
      )
      dispatch(
        onUpdateVault(
          encryptService.encrypt(String(valuable + 1), { usingPassword: false })
        )
      )
    } else {
      // BACK TO HOME AND RESET EXTENSION
      onWalletSignOut()
      resetAllReduxStore()
    }

    if (timeLeft === 8) {
      onInfo()
    }
  }

  const onInfo = () => {
    window.openModal({
      type: 'warning',
      title: t('unlock_app.sign_out_wallet'),
      content: t('unlock_app.warning_for_3_times'),
      btnType: 'transparent',
      okText: t('unlock_app.i_understand')
    })
  }

  const onWalletSignOut = () => {
    const onSignOut = () => {
      // window.open('/tabs/welcome.html')

      // eslint-disable-next-line no-undef
      const popupUrl = chrome.runtime.getURL('tabs/welcome.html')
      // eslint-disable-next-line no-undef
      chrome.tabs
        .create({
          url: popupUrl
        })
        .then(window.close)
    }

    // @ts-expect-error
    window.isFixed = true

    window.openModal({
      type: 'warning',
      iconType: 'danger',
      title: t('unlock_app.wallet_signed'),
      content: t('unlock_app.warning_for_10_times'),
      btnType: 'transparent',
      backdrop: true,
      displayType: 'compact',
      disableClickOutside: true,
      customBackdropColor: 'bg-bg-bot',
      okText: t('unlock_app.back_to'),
      onCancel: onSignOut,
      onOk: onSignOut
    })
  }

  const isDisabled = !watch('password')?.length

  return (
    <div className="relative h-full w-full px-5 pb-5 bg-ui00">
      {/* {!isModal && <img src="/public/img/bg_white.svg" alt="bg-decorator" className='absolute top-0 left-0 right-0 h-[200px] object-cover object-bottom z-0 w-full'/>} */}
      <form
        className="content relative h-full z-auto flex flex-col"
        onSubmit={handleSubmit(onUnlockWallet)}>
        <div className="all-center mt-auto mb-6">
          {isModal ? (
            <Icon name="lock_on" className="text-sem-success text-[56px]" />
          ) : (
            <img
              className={cn('block h-20 w-20', {})}
              src={`/public/img/brand/${
                isDarkTheme ? 'logo-dark' : 'logo-light'
              }.svg`}
            />
          )}
        </div>
        <div className="text-center text-h3 text-ui04 mb-10">
          {isModal
            ? t('unlock_screen.password_required')
            : t('unlock_screen.welcome_to_wallet', { wallet: process.env.PLASMO_EXT_WALLET_NAME || 'Ninji' })}
        </div>
        <Input
          isAnim
          label={t('unlock_screen.password')}
          placeholder={t('sign_out_screen.enter_password')}
          type="password"
          status={errorMsg ? 'error' : 'normal'}
          {...register('password', {
            required: true
          })}
          caption={
            <span
              className="text-sem-danger"
              dangerouslySetInnerHTML={{ __html: errorMsg }}
            />
          }
        />

        <div className="mt-auto">
          <Button type="primary" isBlock disabled={isDisabled}>
            {t(
              isModal
                ? 'sign_out_screen.verify'
                : 'sign_out_screen.unlockWallet'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default withI18nProvider(UnlockScreen)
