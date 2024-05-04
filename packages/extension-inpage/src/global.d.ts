import { type BaseProvider } from './providers'

declare global {
  // eslint-disable-next-line no-unused-vars
  interface Window {
    blockathon: BaseProvider
    ethereum: any
  }
}
