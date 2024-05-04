type FeatureType = 'ibc-go' | 'ibc-transfer' | 'cosmwasm' | 'secretwasm'

interface IBech32Type {
  bech32PrefixAccAddr: string
  bech32PrefixAccPub: string
  bech32PrefixValAddr: string
  bech32PrefixValPub: string
  bech32PrefixConsAddr: string
  bech32PrefixConsPub: string
}

interface ICurrencies {
  coinDenom: string
  coinMinimalDenom: string
  coinDecimals: string
}

export interface ICosmos {
  chainId: string
  chainName: string
  rpcURL: string
  name: string
  rpc: string
  rest: string
  bip44: {
    coinType: number
  }
  bech32Config: IBech32Type
  currencies: ICurrencies[]
  feeCurrencies: ICurrencies[]
  stakeCurrency: ICurrencies
  coinType: number
  gasPriceStep: {
    low: number
    average: number
    high: number
  }
  features: FeatureType[]
  walletUrlForStaking: string
  logo: string
  explorer: string
  // CUSTOM TYPE
  isEvm?: boolean
  dateCreated?: number
}

export interface IEvm {
  name: string
  rpcURL: string
  url: string
  symbol: string
  chainId: string
  // CUSTOM TYPE
  isEvm?: boolean
  dateCreated?: number
}

export interface INetwork {
  cosmos: ICosmos[]
  evm: IEvm[]
}
