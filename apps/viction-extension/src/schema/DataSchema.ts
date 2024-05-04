interface CustomNetwork {}

interface OverrideWallet {
  name: string
  isActive: boolean
}

interface Token {}

type Access = 'full' | string[]

interface Permission {
  chain: string
  accessList: Access
}

interface IConnection {
  name: string
  origin: string
  permissions: Permission[]
}

export interface DataSchema {
  root: {
    user: {
      authentication: {
        type: 'matrix' | 'password'
        password: string // Encoded Hash String
        isUnlocked: boolean
        token: string // Required for authentication api
        connections: IConnection[] // Require for authenticated sites
      }
      setting: {
        override: OverrideWallet[]
        is2StepVerification: boolean // Default: false
        language: string
      }
      deviceId: string // nanoid generate - must be store for identity user
    }
    feeder: {
      defaultTokens: Token[]
    }
    chainInformation: {
      // Default Fees Gas
      fees: Record<string, number>
      cryptoPrice: Record<string, number> // Remove later || using below data
      coinGecko: [] // CoinGecko Cache Data
      rpcConfig: Record<string, string>
      coinLocal: Record<
        string,
        {
          cgkId: string
          symbol: string
          decimal: 6
          name: string
          image: string
          chain: string
          address: string
        }
      >
    }
    tokens: []
    wallets: []
    customNetwork: CustomNetwork[]
    AppConfig: {
      language: string
      manifestV3Migration: boolean // Default false for old user
      version: string
    }
  }
}
