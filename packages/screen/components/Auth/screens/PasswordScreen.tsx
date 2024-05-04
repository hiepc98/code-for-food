// import type { Wallet } from '@wallet/core'
import { Wallet } from '@wallet/core'
import { Button, Checkbox, Icon, Input, MainLayout } from '@wallet/ui'
import cn from 'classnames'
import { useEffect, useMemo } from 'react'
import {
  type SubmitHandler,
  type ValidateResult,
  useForm
} from 'react-hook-form'
import { useHistory } from 'react-router-dom'
import { useAppSelector } from 'store'

import PasswordChangedModal from '../components/PasswordChangedModal'
import withI18nProvider from '../../../provider'
import { useTranslation } from 'react-i18next'
import { encryptService } from '../../../services'

interface SetupForm {
  password: string
  confirmPassword: string
  agreement: boolean
}

interface PasswordScreenProps {
  type: string
  wallets: Wallet[]
  isInitialized: boolean
  isSizeExtension: boolean
  onUpdateAuthentication: (data: any) => void
  onUpdateActivity: () => void
  onChangeLockState: (isLock: boolean) => void
  onMigrateWallet: (wallets: Wallet[]) => void
}

const PasswordScreen = ({
  type,
  wallets,
  isInitialized,
  isSizeExtension,
  onUpdateAuthentication,
  onUpdateActivity,
  onChangeLockState,
  onMigrateWallet
}: PasswordScreenProps) => {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    watch,
    getValues,
    setValue,
    trigger,
    formState: { errors, isValid, dirtyFields }
  } = useForm<SetupForm>({ reValidateMode: 'onBlur', mode: 'all' })
  const history = useHistory()

  const [authentication] = useAppSelector((state) => {
    return [state.user.authentication]
  })

  const { password } = authentication

  useEffect(() => {
    if (getValues().confirmPassword.length > 0) {
      trigger('confirmPassword')
    }
  }, [watch('password')])

  const validateConfirmPassword = (value: string): ValidateResult => {
    if (getValues().password !== value) {
      // eslint-disable-next-line quotes
      return t("Password doesn't match")
    }

    return true
  }

  const validatePassword = (value: string): ValidateResult => {
    const errorMsg = {}

    if (value.length < 8) {
      // @ts-expect-error
      errorMsg.isLength = t('password_screen.at_least_8_characters')
    }

    return Object.keys(errorMsg).length > 0 ? JSON.stringify(errorMsg) : true
  }

  const isValidPassword = useMemo(() => {
    if (dirtyFields.password && !errors.password) {
      return {}
    }

    if (!errors.password?.message) {
      return {
        isLength: false
      }
    }

    const e = JSON.parse(errors.password?.message)

    return {
      isLength: e.isLength
    }
  }, [errors.password?.message])

  const onFormSubmit: SubmitHandler<SetupForm> = (data) => {
    const password = encryptService.encrypt(getValues().password, {
      usingPassword: false
    })

    console.log('22', isInitialized);
    if (!isInitialized) {
      onUpdateAuthentication({ type: 'password', password })
      onUpdateActivity()
      onChangeLockState(false)
      return history.replace(`/startup/wallet/${type}`)
    }
    // Change password flow
    const formatWallet = wallets.map((wallet) => {
      const decryptedWallet = encryptService.decryptWallet(wallet).toObject()
      decryptedWallet.privateKey = decryptedWallet.privateKey
        ? encryptService.encrypt(decryptedWallet.privateKey as string, {
            salt: data.confirmPassword,
            usingPassword: true
          })
        : undefined
      decryptedWallet.mnemonic = decryptedWallet.mnemonic
        ? encryptService.encrypt(decryptedWallet.mnemonic as string, {
            salt: data.confirmPassword,
            usingPassword: true
          })
        : undefined

        return decryptedWallet
    })

    onUpdateAuthentication({ type: 'password', password })
    onMigrateWallet(formatWallet as Wallet[])

    window.openModal({
      type: 'none',
      closable: true,
      // title: t('Password changed'),
      content: <PasswordChangedModal t={t} />,
      onCancel: () => {
        history.push('/main')
      }
    })
  }

  const initPassword = watch('password') ?? ''
  const agreement = true

  return (
    <MainLayout
      title={password ? t('Change Password') : t('Set Password')}
      className="px-5 pt-3 pb-5"
      headerClass={!isSizeExtension ? 'mt-11' : ''}>
      {!isSizeExtension && (
        <div className="body-16-regular text-tx-primary py-4">
          {'This password is used to protect your wallet to the browser extension'}
        </div>
      )}

      <form
        className="flex flex-1 flex-col"
        onSubmit={handleSubmit(onFormSubmit)}>
        <Input
          label={
            isInitialized
              ? t('unlock_screen.new_password')
              : t('unlock_screen.password')
          }
          placeholder={t('password_screen.enter_your_password')}
          type="password"
          {...register('password', {
            required: true,
            validate: validatePassword
          })}
          status={errors.password?.message ? 'error' : undefined}
        />

        <ul className="body-12-regular text-tx-secondary mt-2 mb-6">
          <li
            className={cn(
              'transition flex items-center',
              initPassword.length > 0 &&
                (!isValidPassword.isLength ? 'text-sem-success' : 'text-sem-danger')
            )}>
            {initPassword.length > 0 && (
              <Icon
                name={isValidPassword.isLength ? 'close' : 'check'}
                className="mr-2"
              />
            )}
            {t('password_screen.at_least_8_characters')}
          </li>
        </ul>

        <Input
          label={
            isInitialized
              ? t('token_detail_screen.confirm_new_password')
              : t('token_detail_screen.confirm_password')
          }
          placeholder={t('password_screen.re_enter_your_password')}
          type="password"
          {...register('confirmPassword', {
            required: t('password_screen.password_doesn_match'),
            validate: validateConfirmPassword
          })}
          caption={errors.confirmPassword?.message}
          status={errors.confirmPassword?.message ? 'error' : undefined}
        />

        <div className={!isSizeExtension ? 'mt-12' : 'mt-auto'}>
          <div
            className={cn(
              'flex items-center mb-6',
              !isSizeExtension ? 'block' : 'hidden'
            )}>
          </div>
          <Button
            disabled={!isValid || (!isSizeExtension && !agreement)}
            isBlock>
            {!isSizeExtension
              ? 'Next'
              : t('setting_screen.confirm')}
          </Button>
        </div>
      </form>
    </MainLayout>
  )
}

export default withI18nProvider(PasswordScreen)
