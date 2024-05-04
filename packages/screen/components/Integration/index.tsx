import React from 'react'

import { IntegrationProvider } from './context'
import IntegrationRoutes from './screens/IntegrationRoutes'

interface IntegrationScreenProps {
  encryptService: any,
  services: any
  integrationRoutes: any[]
}

const IntegrationScreen = (props: IntegrationScreenProps) => {
  const { encryptService, integrationRoutes, services } = props

  return (
    <IntegrationProvider
      encryptService={encryptService}
      services={services}
    >
      <IntegrationRoutes integrationRoutes= {integrationRoutes} services={services}/>
    </IntegrationProvider>
  )
}

export default IntegrationScreen
