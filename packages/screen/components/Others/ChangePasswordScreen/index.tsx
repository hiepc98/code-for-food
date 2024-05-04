import { Button, Input, MainLayout } from '@wallet/ui'
import { type ChangeEvent, type FormEvent, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useAppSelector } from 'store'
import { useTranslation } from 'react-i18next'
import withI18nProvider from '../../../provider'

const ChangePasswordScreen = ({ encryptService }) => {
  const { t } = useTranslation()
  const history = useHistory()
  const [password, setPassword] = useState<string>('')
  const { password: appTextPassword } = useAppSelector(
    (state) => state.user.authentication
  )

  const onSubmitForm = (e: FormEvent) => {
    e.preventDefault()
    if (!isInvalidPassword && password.length > 0) {
      onNext()
    }
  }

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const onNext = () => {
    history.replace('/setting/security/change-password', {
      isSizeExtension: true
    })
  }

  const isInvalidPassword = useMemo<boolean>(() => {
    const barePassword: string = encryptService.decrypt(appTextPassword, {
      usingPassword: false
    })

    return password.length > 0 && password !== barePassword
  }, [password])

  return (
    <MainLayout title={t('setting_screen.change_password')} className="pb-5">
      <form
        className="mt-6 w-full h-full flex flex-col px-5"
        onSubmit={onSubmitForm}>
        <Input
          label={t('setting_screen.current_password')}
          value={password}
          type="password"
          placeholder={t('setting_screen.current_password_placeholder')}
          onChange={onChangePassword}
          status={isInvalidPassword ? 'error' : undefined}
          caption={
            isInvalidPassword
              ? t('setting_screen.current_password_wrong')
              : undefined
          }
        />

        <div className="mt-auto">
          <Button
            type="primary"
            disabled={password.length === 0 || isInvalidPassword}
            isBlock
            onClick={onNext}>
            {t('setting_screen.next')}
          </Button>
        </div>
      </form>
    </MainLayout>
  )
}

export default withI18nProvider(ChangePasswordScreen)
