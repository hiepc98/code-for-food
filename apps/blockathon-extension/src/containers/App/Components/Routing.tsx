import useTheme from '@wallet/screen/hooks/useTheme'
import cn from 'classnames'
import first from 'lodash/first'
import React, { Fragment } from 'react'
import { Route } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import { useAppSelector } from 'store'

import { routes } from '~config/routes'

const Routing = () => {
  const { isDarkTheme } = useTheme()
  const [isFullScreen] = useAppSelector((state) => {
    return [state.setting.isFullScreen]
  })

  const renderRoute = (routes: any[], pathPrefix: string = '') => {
    return routes.map(({ path, subRoutes, noTransition, Component }) => {
      const basePath = `${pathPrefix}${
        Array.isArray(path) ? first(path) : path
      }`
      const pathRender = Array.isArray(path)
        ? path.map((p) => `${pathPrefix}${p}`)
        : `${pathPrefix}${path}`
      const routeKey = Array.isArray(pathRender)
        ? first(pathRender)
        : pathRender

      const isFullHeightScreen = ['/startup'].includes(basePath)

      const isFullAndHighOrder = isFullScreen && ['/staking'].includes(basePath)

      return (
        <Fragment key={routeKey}>
          <Route exact path={pathRender}>
            {({ match }) => {
              return (
                <CSSTransition
                  in={match != null}
                  timeout={noTransition ? 0 : 300}
                  classNames={noTransition ? 'fade' : 'page-transition'}
                  unmountOnExit>
                  <div
                    className={cn(
                      noTransition
                        ? `bg-ui00 fade ${
                            isFullHeightScreen && 'fade-full-page '
                          }`
                        : 'page-transition',
                      isFullAndHighOrder && 'fade-full-page-high-order'
                    )}>
                    <Component />
                  </div>
                </CSSTransition>
              )
            }}
          </Route>
          {subRoutes && renderRoute(subRoutes, basePath)}
        </Fragment>
      )
    })
  }

  return <>{renderRoute(routes)}</>
}

export default React.memo(Routing)
