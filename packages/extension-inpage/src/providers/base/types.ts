export interface IBaseProvider {
  isConnected: any
  isFixedChain: boolean
  // Support override others wallet
  isDesktop: boolean
  isKaiWallet: boolean
  isNiftyWallet: boolean
  isMetaMask: boolean

  currentChain: string
  autoRefreshOnNetworkChange: boolean
  publicConfigStore: {
    on: any
  }
}

export interface IProviderOptions {
  autoRefreshOnNetworkChange?: boolean
  chain?: string
}
