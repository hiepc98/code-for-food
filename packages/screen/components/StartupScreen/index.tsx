/* eslint-disable camelcase */
import { Row } from '@wallet/ui'
import { useHistory } from 'react-router-dom'
import { useAppSelector } from 'store'
import withI18nProvider from '../../provider'
import { useTranslation } from 'react-i18next'

const StartupScreen = () => {
  const { t } = useTranslation()
  const history = useHistory()
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
    <div className="relative bg-startup w-full h-screen bg-no-repeat bg-cover bg-center flex flex-col overflow-hidden pt-20 box-border">
      {/* <img src="/public/get_started.svg" alt="" className='w-full h-[250px] object-cover object-top absolute bottom-0 left-0 right-0' /> */}

      <div className="relative z-10">
        <h1 className="text-h2 font-medium text-ui04">
          {t('startup_screen.get_started_title')}
        </h1>

        <div className="navigation-list mt-6">
          <Row
            className=""
            title={t('Create a new wallet')}
            content={t('With your own new passphrase')}
            icon="edit"
            onClick={onRouting('create')}
          />
          {/* <div className="mx-5 border-b-[1px] border-ui01"></div> */}
          <div className="text-h5 text-tx-secondary">Import wallet</div>
          <Row
            className=""
            title={t('type_selection_modal.restore_a_wallet')}
            content={t('type_selection_modal.by_your_existing_passphrase')}
            icon="history"
            onClick={onRouting('restore')}
          />
          {/* <div className="mx-5 border-b-[1px] border-ui01"></div>
                  <Row className='px-5' title={t('Add a view-only wallet')} content={t('To view tokens of a specific wallet')} icon="eye_on" onClick={onRouting('view-only-wallet')}/> */}
        </div>
      </div>
    </div>
  )
}

export default withI18nProvider(StartupScreen)
