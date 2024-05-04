/* eslint-disable camelcase */
import { Row } from '@wallet/ui'
import { useTranslation } from 'react-i18next'
import { useHistory } from 'react-router-dom'
import withI18nProvider from '../../provider'
import { useAppSelector } from 'store'

const StartupScreen = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const service = window.walletServices && window.walletServices.engines[0]
  const wallets = useAppSelector((state) => state.wallet.wallets)
  const isInitialized = useAppSelector(
    (state) => state.user.authentication.password
  )

  const onRouting = (type: string) => () => {
    if (!isInitialized) {
      return history.push(`/startup/password/${type}`, {
        fromSetup: true
      })
    }

    return history.push(`/startup/wallet/${type}`, {
      fromSetup: true
    })
  }

  return (
    <div className="relative bg-startup w-full h-screen bg-no-repeat bg-cover bg-center flex flex-col overflow-hidden box-border px-5 justify-center">

      <div className="relative z-10">
        <h2 className="text-h2 font-medium text-ui04 text-center">
          Welcome to Earn app
        </h2>

        <div className="navigation-list mt-6">
          <Row
            className="border px-4 rounded-xl mb-3"
            title={t('Create a new wallet')}
            content={'Start fresh a new wallet'}
            icon="status_plus"
            onClick={onRouting('create')}
          />
          <Row
             className="border px-4 rounded-xl"
            title={t('type_selection_modal.restore_a_wallet')}
            content={'Import with your Secret Phrase'}
            icon="expand_view"
            onClick={onRouting('restore')}
          />
        </div>
      </div>
    </div>
  )
}

export default withI18nProvider(StartupScreen)
