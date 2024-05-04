export interface IToken {
  address: string
  cgkId: string
  chain: string
  decimal?: string | number
  isDefault?: boolean
  image?: string
  name: string
  symbol: string
  rawBalance?: string
  hidden?: boolean
  price?: any
}

export type TokenList = IToken[]
