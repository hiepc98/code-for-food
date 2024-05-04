import { type IconType } from '@wallet/ui'

export interface IListItem {
  key: string
  icon: IconType
  type?: string
  route?: string
  title?: string
  description?: string
}
