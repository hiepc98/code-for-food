// import type { Wallet } from '@wallet/core'
import { Wallet } from '@wallet/core'
import { Button, Checkbox, Icon, Input, MainLayout } from '@wallet/ui'
import { cx } from '@wallet/utils'
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
import { TomoWallet } from 'store/types'

interface SetupForm {
  password: string
  confirmPassword: string
  agreement: boolean
}

interface PasswordScreenProps {
  type: string
  wallets: TomoWallet[]
  isInitialized: boolean
  isSizeExtension: boolean
  encryptService: any
  onUpdateAuthentication: (data: any) => void
  onUpdateActivity: () => void
  onChangeLockState: (isLock: boolean) => void
  onMigrateWallet: (wallets: TomoWallet[]) => void
}

const PasswordScreen = ({
  type,
  wallets,
  isInitialized,
  isSizeExtension,
  encryptService,
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
      errorMsg.isLength = t('characterInvalid')
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
    onMigrateWallet(formatWallet as TomoWallet[])

    window.openModal({
      type: 'none',
      closable: true,
      title: t('Password changed'),
      content: <PasswordChangedModal t={t} />,
      onCancel: () => {
        history.push('/main')
      }
    })
  }

  const initPassword = watch('password') ?? ''
  const agreement = watch('agreement')

  return (
    <MainLayout
      title={password ? t('Change Password') : t('Setup Password')}
      className="px-5 pt-3 pb-5"
      headerClass={!isSizeExtension ? 'mt-11' : ''}>
      {!isSizeExtension && (
        <div className="text-base text-ui04 py-4">
          {t('get_started.this_password_will')}
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
        />

        <ul className="text-tiny text-ui02 mt-2 mb-6">
          <li
            className={cx(
              'transition flex items-center',
              initPassword.length > 0 &&
                (!isValidPassword.isLength ? 'text-green' : 'text-red')
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
            className={cx(
              'flex items-center mb-6',
              !isSizeExtension ? 'block' : 'hidden'
            )}>
            <Checkbox
              checked={agreement}
              onChangeValue={(isChecked) => setValue('agreement', isChecked)}>
              <div className="ml-3 text-ui04">
                {t('password_screen.i_read_tomo_wallet')}&nbsp;
                <a
                  href="https://docs.viction.xyz/general/how-to-connect-to-viction-network/viction-wallet/term-and-services"
                  target="_blank"
                  className="text-blue"
                  rel="noreferrer">
                  {t('password_screen.terms_of_service')}
                </a>
                &nbsp;{t('password_screen.and')}&nbsp;
                <a
                  href="https://docs.viction.xyz/general/how-to-connect-to-viction-network/viction-wallet/privacy-policy"
                  target="_blank"
                  className="text-blue"
                  rel="noreferrer">
                  {t('password_screen.privacy_policy')}
                </a>
              </div>
            </Checkbox>
          </div>
          <Button
            disabled={!isValid || (!isSizeExtension && !agreement)}
            isBlock>
            {!isSizeExtension
              ? t('password_screen.create_password')
              : t('setting_screen.confirm')}
          </Button>
        </div>
      </form>
    </MainLayout>
  )
}

export default withI18nProvider(PasswordScreen)
