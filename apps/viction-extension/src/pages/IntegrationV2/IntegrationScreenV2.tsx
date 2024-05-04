import IntegrationScreen from '@wallet/screen/components/Integration'
import React from 'react'
import { integrationRoutes } from '~config/routes'
import { useWallet } from '~controllers/contexts/WalletContext'
// import { useTranslation } from 'react-i18next'

// import { IntegrationProvider } from './context'
import { encryptService } from '~controllers/services/encryption'
import SplashScreen from '~shared/components/Splash'

const IntegrationScreenV2 = () => {
  // const { t } = useTranslation()

  // const init = async () => {
  //   const { EvmIntegrationHandle } = await import('@wallet/evm')
  //   setEngine(EvmIntegrationHandle)
  // }

  // useEffect(() => {
  //   init()
  // }, [])

  const { services, integrationService } = useWallet()
  // const handleSaveCurrentNft = (nft: any) => {
  //   dispatch(onSaveCurrentNft(nft))
  // }

  return (
    <>
       <IntegrationScreen
        // t={t}
        services={integrationService}
        integrationRoutes={integrationRoutes}
        encryptService={encryptService}
      />
    </>

  )
}

export default IntegrationScreenV2
