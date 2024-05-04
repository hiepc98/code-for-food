// @type infer tempory solutions
// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { IModalProps } from '@wallet/ui'

export {}
declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    coin98: any
    goBack: () => void
    walletServices: any
    integrationServices: any
    openModal: (props: IModalProps) => any
    closeModal: () => void | any
  }

  interface chrome {}
}
declare module '*.scss' {
  const content: Record<string, string>
  export default content
}
