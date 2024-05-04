import AppStakeScreen from '~pages/AmmScreens/AppStakeScreen'
import TestChangePasswordScreen from '~pages/Auth/TestChangePasswordScreen'
import TestPasswordScreen from '~pages/Auth/TestPasswordScreen'
import TestUnlockScreen from '~pages/Auth/TestUnlockScreen'
import BootupScreen from '~pages/BootupScreen'
import BuyCrypto from '~pages/BuyCrypto'
import ConnectScreenV2 from '~pages/IntegrationV2/ConnectScreenV2'
import IntegrationScreenV2 from '~pages/IntegrationV2/IntegrationScreenV2'
import NetworkSwitchV2 from '~pages/IntegrationV2/NetworkSwitchV2'
import SendTxScreenV2 from '~pages/IntegrationV2/SendTxScreenV2'
import TransactionScreenV2 from '~pages/IntegrationV2/TransactionScreenV2'
import TestMainScreen from '~pages/Main/TestMainScreen'
import TestCollectionDetailScreen from '~pages/NFT/TestCollectionDetailScreen'
import TestNFTDetailScreen from '~pages/NFT/TestNFTDetailScreen'
import TestSendNftScreen from '~pages/NFT/TestSendNftScreen'
import SwapScreen from '~pages/SwapScreen'
import TestChooseThemeScreen from '~pages/TestScreen/TestChooseThemeScreen'
import TestConnectionScreen from '~pages/TestScreen/TestConnectionScreen'
import TestCurrencyScreen from '~pages/TestScreen/TestCurrencyScreen'
import TestGeneralScreen from '~pages/TestScreen/TestGeneralScreen'
import TestGetStartedScreen from '~pages/TestScreen/TestGetStartedScreen'
import { TestHistoryScreen } from '~pages/TestScreen/TestHistoryScreen'
import TestLanguageScreen from '~pages/TestScreen/TestLanguageScreen'
import TestNetworkScreen from '~pages/TestScreen/TestNetworkScreen'
import TestSecurityPrivacyScreen from '~pages/TestScreen/TestSecurityPrivacyScreen'
import TestSettingScreen from '~pages/TestScreen/TestSettingScreen'
import TestStartupScreen from '~pages/TestScreen/TestStartupScreen'
// import IntegrationScreen from '~pages/Integration'

// import SwapScreen from '~pages/Others/SwapScreen'
import TestAddCustomToken from '~pages/Token/TestAddCustomToken'
import TestManageTokenScreen from '~pages/Token/TestManageTokenScreen'
import TestReceiveInfoScreen from '~pages/Token/TestReceiveInfoScreen'
import TestSendTokenScreen from '~pages/Token/TestSendTokenScreen'
import TestTokenDetailScreen from '~pages/Token/TestTokenDetailScreen'
import TestBackupScreen from '~pages/Wallet/TestBackupScreen'
import TestChangeProfileScreen from '~pages/Wallet/TestChangeProfileScreen'
import TestCreateWalletScreen from '~pages/Wallet/TestCreateWalletScreen'
import TestManageWalletScreen from '~pages/Wallet/TestManageWalletScreen'
import TestMyWalletScreen from '~pages/Wallet/TestMyWalletScreen'
import type { RouteInterface } from '~types/routes'

export const routes: RouteInterface[] = [
  // Startup Screens
  {
    path: '/boot',
    Component: BootupScreen
  },
  {
    path: '/get-started',
    Component: TestGetStartedScreen
  },
  {
    path: '/choose-theme',
    Component: TestChooseThemeScreen
  },
  {
    path: ['/startup', '/startup/:any'],
    Component: TestStartupScreen,
    basePath: '/startup',
    noTransition: true,
    subRoutes: [
      {
        path: ['/password', '/password/:type'],
        Component: TestPasswordScreen
      },
      {
        path: ['/wallet', '/wallet/:type'],
        Component: TestCreateWalletScreen,
        subRoutes: [
          {
            path: ['/restore', '/restore/:any'],
            Component: TestCreateWalletScreen
          },
          {
            path: '/create/:type',
            Component: TestCreateWalletScreen
          }
        ]
      },
      {
        path: '/wallet/:type',
        Component: TestCreateWalletScreen
      }
      // {
      //   path: '/email-login',
      //   Component: LoginEmailScreen
      // },
      // {
      //   path: '/email-login-success',
      //   Component: LoginEmailSuccessScreen
      // },
      // {
      //   path: '/email-login-failed',
      //   Component: LoginEmailFailedScreen
      // }
    ]
  },
  {
    path: '/history',
    noTransition: true,
    Component: TestHistoryScreen
  },
  // {
  //   path: '/swap',
  //   noTransition: true,
  //   Component: SwapScreen
  // },
  {
    path: '/lock-password',
    noTransition: true,
    Component: TestUnlockScreen
  },
  {
    path: ['/main', '/main/:any'],
    Component: TestMainScreen,
    noTransition: true,
    subRoutes: [
      {
        path: '/historyTest',
        Component: TestHistoryScreen
      },
      {
        path: ['/wallet'],
        Component: TestMyWalletScreen,
        subRoutes: [
          {
            path: ['/manage', '/manage/:any'],
            Component: TestManageWalletScreen,
            subRoutes: [
              {
                path: '/change-profile',
                Component: TestChangeProfileScreen
              },
              {
                path: '/backup',
                Component: TestBackupScreen
              },
              {
                path: '/receive',
                Component: TestReceiveInfoScreen
              },
              {
                path: '/connections',
                Component: TestConnectionScreen
              }
            ]
          },
          {
            path: '/create/:type',
            Component: TestCreateWalletScreen
          }
        ]
      }
    ]
  },
  {
    path: ['/setting', '/setting/:any'],
    Component: TestSettingScreen,
    noTransition: true,
    subRoutes: [
      {
        path: ['/security', '/security/:any'],
        Component: TestSecurityPrivacyScreen,
        subRoutes: [
          {
            path: '/confirm-password',
            Component: TestChangePasswordScreen
          },
          {
            path: '/change-password',
            Component: TestPasswordScreen
          }
        ]
      },
      {
        path: ['/network', '/network/:any'],
        Component: TestNetworkScreen,
        subRoutes: []
      },
      {
        path: ['/general', '/general/:any'],
        Component: TestGeneralScreen,
        subRoutes: [
          {
            path: '/language',
            Component: TestLanguageScreen
          },
          {
            path: '/currency',
            Component: TestCurrencyScreen
          }
        ]
      }
    ]
  },
  {
    path: ['/integration', '/integration/:any'],
    Component: IntegrationScreenV2,
    noTransition: true
  },
  {
    path: ['/collection/:chain/:address'],
    Component: TestCollectionDetailScreen,
    subRoutes: [
      {
        path: '/:id',
        Component: TestNFTDetailScreen,
        subRoutes: [
          {
            path: '/send',
            Component: TestSendNftScreen
          }
        ]
      }
    ]
  },
  {
    path: ['/token/:chain/:address'],
    Component: TestTokenDetailScreen,
    subRoutes: [
      {
        path: '/receive',
        Component: TestReceiveInfoScreen
      },
      {
        path: '/send',
        Component: TestSendTokenScreen
      }
    ]
  },
  {
    path: '/add-token',
    Component: TestAddCustomToken
  },
  {
    path: '/manage-token',
    Component: TestManageTokenScreen
  },
  {
    path: '/swap',
    noTransition: true,
    Component: SwapScreen
  },
  {
    path: '/buy-crypto',
    noTransition: true,
    Component: BuyCrypto
  },
  {
    path: ['/staking'],
    noTransition: true,
    Component: AppStakeScreen
  }
]

export const integrationRoutes = [
  {
    path: '/connect',
    Component: ConnectScreenV2
  },
  {
    path: '/messages',
    Component: TransactionScreenV2
  },
  {
    path: '/transaction',
    Component: SendTxScreenV2
  },
  {
    path: '/switch-network',
    Component: NetworkSwitchV2
  }
]
