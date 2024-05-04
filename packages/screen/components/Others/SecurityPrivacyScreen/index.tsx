import React from 'react'
import { ListItem, MainLayout } from '@wallet/ui'
import { useHistory } from 'react-router-dom'
import withI18nProvider from '../../../provider'
import { useTranslation } from 'react-i18next'

const SecurityPrivacyScreen = () => {
  const { t } = useTranslation()
  const history = useHistory()

  const onRoute = (path: string) => () => {
    return history.push(path)
  }
  return (
    <MainLayout title={t('setting_screen.security_and_privacy')}>
      <ListItem
        title={t('setting_screen.change_password')}
        onClick={onRoute('/setting/security/confirm-password')}
        showArrow
        hideImage
      />
    </MainLayout>
  )
}

export default withI18nProvider(SecurityPrivacyScreen)
