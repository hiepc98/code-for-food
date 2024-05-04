import { type IconType } from '@wallet/ui'

export interface ISettingList {
  key: string
  icon: IconType
  type?:
    | 'expand'
    | 'reset'
    | 'toggle2StepVerification'
    | 'change-password'
    | 'version'
  route?: string
  title?: string
  description?: string
  showArrow?: boolean
}
