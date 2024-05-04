export interface RouteInterface {
  path: string[] | string
  Component: any
  basePath?: string
  subRoutes?: RouteInterface[]
  noTransition?: boolean
}
