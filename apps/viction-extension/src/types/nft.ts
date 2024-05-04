export interface INftItem {
  address: string
  chain: string
  id: string
  walletAddress?: string
  tokenURI?: string
  name?: string
  image?: string
  description?: string
  symbol?: string
  standard?: string
  contractName?: string
  type?: string
  metaData?: {
    image?: string
    name?: string
    description?: string
  }
}
export interface ICollection {
  collection: {
    name: string,
    image?: string
    owner?: string,
    total?: number
  }
  data: INftItem[]
}

export interface INFTDetail {
  collectionInfo: ICollection
  id: string | number
  name?: string | null
  image?: string
}
