import type { TokenList } from '../../../../types'

import packageJson from '../../../../../../apps/viction-extension/package.json'
import { type ISettingList } from './types'

export const SETTING_LIST: ISettingList[] = [
  {
    key: 'general',
    icon: 'custom',
    route: '/setting/general',
    title: 'setting_screen.general',
    description: 'setting_screen.general_description',
    showArrow: true
  },
  {
    key: 'security',
    icon: 'security',
    route: '/setting/security',
    title: 'setting_screen.security_and_privacy',
    description: 'setting_screen.security_and_privacy_description',
    showArrow: true
  },
  {
    key: 'network',
    icon: 'network',
    route: '/setting/network',
    title: 'setting_screen.network',
    description: 'setting_screen.network_description',
    showArrow: true
  },
  {
    key: 'expand',
    icon: 'expand_view',
    type: 'expand',
    title: 'setting_screen.expand_view',
    description: 'setting_screen.expand_view_desc',
    showArrow: false
  },
  // {
  //   key: 'changeLanguage',
  //   icon: 'app_language',
  //   route: '/main/setting/language'
  // },
  // {
  //   key: 'changePassword',
  //   icon: 'app_security_setting',
  //   type: 'change-password'
  // },
  // {
  //   key: 'twoStepVerification',
  //   icon: 'app_matrix',
  //   type: 'toggle2StepVerification'
  // },
  // {
  //   key: 'avoidConflict',
  //   icon: 'app_manage_wallet',
  //   route: '/main/setting/override'
  // },
  // {
  //   key: 'resetExtension',
  //   icon: 'app_wallet_unactive',
  //   type: 'reset'
  // },
  {
    key: 'version',
    icon: 'status_info',
    type: 'version',
    title: 'setting_screen.version',
    description: packageJson.version,
    showArrow: false
  }
]

export const listToken: TokenList = [
  {
    address: 'hashed_address',
    cgkId: 'hashed',
    chain: 'hashed',
    decimal: 6,
    image:
      'https://e7.pngegg.com/pngimages/1000/824/png-clipart-security-token-onecoin-token-coin-cryptocurrency-others-miscellaneous-label.png',
    name: 'HASHED',
    symbol: 'HASHED'
  }
]
