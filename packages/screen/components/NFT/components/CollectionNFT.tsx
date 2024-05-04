import { Icon, Image } from '@wallet/ui'
import { cx } from '@wallet/utils'
import get from 'lodash/get'

import CollectionNFTDetail from './CollectionNFTDetail'
import type { INftItem } from '../../../types/nft'

interface IProps {
  className?: string
  collectionDetail: INftItem[]
}

const CollectionNFT = (props: IProps) => {
  const { collectionDetail } = props
  const onViewDetail = () => {
    window.openModal({
      type: 'none',
      title: get(collectionDetail, 'collection.name', ''),
      content: <CollectionNFTDetail collectionDetail={collectionDetail} />,
      contentType: 'other',
      closable: true
    })
  }

  return (
    <div
      className="group flex items-center justify-between border-b-ui03 px-5 py-4 h-14 transition ease-in-out hover:bg-ui01 cursor-pointer has-divider min-h-[76px]"
      onClick={onViewDetail}>
      <div className="flex items-center gap-3 cursor-pointer">
        <div
          className={cx(
            'relative w-10 h-10 rounded-full text-white text-[24px] all-center flex-shrink-0'
          )}>
          <Image
            className="w-full h-full rounded-full"
            src={get(collectionDetail, 'collection.image', '')}
          />

        </div>
        <p className="leading-6 text-base font-semibold text-ui04">
          {get(collectionDetail, 'collection.name', 'Test Collection')}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <p className="text-ui02">{get(collectionDetail, 'data', []).length}</p>
        <div className="h-full all-center ml-auto text-h3 flex item-center">
          <Icon name="chevron_right" className="text-ui02" />
        </div>
      </div>
    </div>
  )
}

export default CollectionNFT
