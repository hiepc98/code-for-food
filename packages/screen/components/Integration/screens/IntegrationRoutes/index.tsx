import React from 'react'
import { Route, useParams } from 'react-router-dom'
import SplashScreen from '~shared/components/Splash'

// import { integrationRoutes } from '~config/routes'

interface IntegrationRoutesProps {
  integrationRoutes: any[]
  services: any
}

const IntegrationRoutes = (props:IntegrationRoutesProps) => {
  const { integrationRoutes, services } = props
  

  if (!services) {
    return <SplashScreen isFullScreen/>
  }


  return (
    <>
      {integrationRoutes.map((route) => {
        const path = `/integration${route.path}`
        return <Route path={path} component={route.Component} key={path} />
      })}

      {/*
      <div className="w-full text-sm font-medium flex justify-center gap-x-2 items-center mb-3 px-3">
        <Button disabled={isLoading} type="gray" onClick={onRejectRequest} className='flex-1 h-12'>
          <p className="px-2">{t('cancel')}</p>
        </Button>
        <Button isLoading={isLoading} type="primary" onClick={onAcceptRequest} className='flex-1 h-12'>
          <p className="px-2">{t('setting_screen.confirm')}</p>
        </Button>
      </div>

      {requests.length > 1 && (
        <div className='all-center text-xs text-yellow hover:text-yellow2 transition-all mb-3 cursor-pointer'>
          <a onClick={onRejectAllRequest}>
            {t('rejectAllRequest', { count: requests.length })}
          </a>
        </div>
      )} */}
    </>
  )
}

export default IntegrationRoutes
