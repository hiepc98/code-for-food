import { EvmProvider } from './evm'

if (typeof chrome === 'undefined') {
  // @ts-expect-error
  globalThis.chrome = {}
}

export const initializer = (): void => {
  // window.tomowallet = new RamperProvider()

  const evmProvider = new EvmProvider({ chain: 'evm' })

  window.viction = evmProvider
  window.ethereum = window.viction
}
