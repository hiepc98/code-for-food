import { type IntegrationPermission } from '@wallet/core'

//! Strict permissions
export type PasswordType = 'matrix' | 'password'

export interface IConnection {
  name: string
  origin: string
  favicon: string
  permissions: IntegrationPermission
}
