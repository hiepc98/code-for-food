export interface ICollection {
  address: string
  contractName: string
  chain: string
  banner?: string
  collectionImage?: string
}

export interface INFTDetail {
  collectionInfo: ICollection
  id: string | number
  name?: string | null
  image?: string
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
