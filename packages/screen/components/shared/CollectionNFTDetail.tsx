import NFTItem from './NFTItem'
import type { INftItem } from '../../types'
import get from 'lodash/get'

interface CollectionNFTDetailProps {
  className?: string
  collectionDetail: INftItem[]
}

const CollectionNFTDetail = (props: CollectionNFTDetailProps) => {
  const { collectionDetail } = props

  const listNFT: any = get(collectionDetail, 'data', [])

  return (
    <div className="h-full w-full mt-20 overflow-auto">
      <div className="grid grid-cols-2 gap-2 px-5 pb-5 overflow-scroll">
        {listNFT.map((item: any) => (
          <NFTItem key={`${item.address}-${item.id}`} nftDetail={item} />
        ))}
      </div>
    </div>
  )
}

export default CollectionNFTDetail
