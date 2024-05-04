export interface TransactionRaw {
  method: string
  params: any[]
}
export interface IntegrationTransaction {
  to: string // Excecuted Contract || Address that intergrate with (eg: eth_sendTransaction, cosmos_execute)
  data?: string[] //EVM Data || Solana encoded base58
  msgs?: object[] //Cosmos || Others chain confirm msg
  raw?: TransactionRaw | string
}

export interface LibVersion {
  name: string
  version: string
}

export interface Meta {
  version: string //Application Version
  libVersion: string | LibVersion[] //Current Library Version |
}

export interface DappTransactionRecord {
  source: string //Application source
  os: string
  url: string
  hash: string
  method: string
  wallet: string // Address only
  chain: string
  transaction?: Partial<IntegrationTransaction>
  meta: Meta
}
