
import PasswordScreen from '~pages/Auth/PasswordScreen'
import HomeScreen from '~pages/Home'
import PointsScreen from '~pages/Points'
import SettingScreen from '~pages/Setting'
import StartupScreen from '~pages/Startup'
import CreateWalletScreen from '~pages/Wallet/CreateWalletScreen'
import type { RouteInterface } from '~types/routes'

export const routes: RouteInterface[] = [
  {
    path: '/home',
    Component: HomeScreen,
    noTransition: true,
  },
  {
    path: '/points',
    Component: PointsScreen,
    noTransition: true,
  },
  {
    path: '/setting',
    Component: SettingScreen,
    noTransition: true,
  },
  {
    path: ['/startup', '/startup/:any'],
    Component: StartupScreen,
    basePath: '/startup',
    noTransition: true,
    subRoutes: [
      {
        path: ['/password', '/password/:type'],
        Component: PasswordScreen
      },
      {
        path: ['/wallet', '/wallet/:type'],
        Component: CreateWalletScreen,
        subRoutes: [
          {
            path: ['/restore', '/restore/:any'],
            Component: CreateWalletScreen
          },
          {
            path: '/create/:type',
            Component: CreateWalletScreen
          }
        ]
      },
    ]
  },
]
