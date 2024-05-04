import { Wallet, Chain, IWallet } from "@wallet/core"

export interface Token {
  id: string
  _id?: string
  name: string
  symbol: string
  price: string
  image: string

  // Optional Artribute
  cgkId?: string
  isDefault?: boolean
  ethPrice?: string | number
  btcPrice?: string | number
}


export class TomoWallet extends Wallet {
  public avatar?: string

  constructor (wallet: ITomoWallet) {
    super(wallet)

    this.avatar = wallet.avatar
  }
  static fromObject = (data: ITomoWallet) => {
    return new TomoWallet(data)
  }
}

export interface INftItem {
  address: string
  chain: string
  id: string
  name?: string
  image?: string
  description?: string
  symbol?: string
  contractName?: string
  tokenURI?: string
  metaData?: {
    image?: string
  }
}

export interface RamperChain extends Chain {
  // cosmos info

  rpc?: string
  rest?: string
  rpcConfig?: any
  restConfig?: any
  // chainId: string
  chainName?: string

  // More Chain Info
  stakeCurrency?: any
  walletetUrlForStaking?: string
  bip44?: any
  bech32Config?: any
  currencies?: any[]

  // Optional
  isEthereum?: boolean // Support EIP712 transfer throught Ethermint
  beta?: boolean
  walletUrl?: string
  walletUrlForStaking?: string
  faucets?: string | string[]
  feeCurrencies?: any[]
  coinType?: string | number
  alternativeBIP44s?: any[]
  features?: string[]
  gasPriceStep?: {
    low: string | number
    average: string | number
    high: string | number
  }
  // defaultFee?: number
  // Coin98 Exclusive Fields
  disable?: boolean
}

export interface ITomoWallet extends IWallet {
  avatar?: string
  // uid?: string
}