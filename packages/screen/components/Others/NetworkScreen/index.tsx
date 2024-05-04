import { MainLayout } from '@wallet/ui'
import { useHistory } from 'react-router-dom'

import NetworkScreenInner from './components/NetworkScreenInner'
import withI18nProvider from '../../../provider'
import { useTranslation } from 'react-i18next'

const NetworkScreen = () => {
  const { t } = useTranslation()
  const history = useHistory()

  return (
    <MainLayout title={t('setting_screen.network')} containerClass="w-full">
      <NetworkScreenInner t={t} onClose={() => history.goBack()} />
    </MainLayout>
  )
}

export default withI18nProvider(NetworkScreen)
