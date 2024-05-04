import withI18nProvider from '@wallet/screen/provider'
import { MainLayout } from '@wallet/ui'
import { useTranslation } from 'react-i18next'

const SwapScreen = () => {
  const { t } = useTranslation()
  return (
    <MainLayout
      hideBack={true}
      //   title={t('buy_screen.buy_crypto')}
      stylesContent={{ marginBottom: 0 }}>
      <div className="flex flex-col justify-center items-center h-full">
        <p className="text-h2 text-ui02">
          {/* {t('buy_crypto.coming_soon')} */}
          Coming soon
        </p>
      </div>
    </MainLayout>
  )
}

export default withI18nProvider(SwapScreen)
