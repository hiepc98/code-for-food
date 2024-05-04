import { Icon, Image } from '@wallet/ui'
import { cx } from '@wallet/utils'
import get from 'lodash/get'

import CollectionNFTDetail from './CollectionNFTDetail'
import type { INftItem } from '../../types'
import { getLength } from '../../utils'

interface IProps {
  className?: string
  collectionDetail: INftItem[]
  chainImage?: string
}

const CollectionNFT = (props: IProps) => {
  const { collectionDetail, chainImage } = props

  const formatCollection : any = get(collectionDetail, 'collection', {})

  const onViewDetail = () => {
    window.openModal({
      type: 'none',
      title: get(formatCollection, 'name', ''),
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
            'relative w-10 h-10 text-white text-[24px] all-center flex-shrink-0'
          )}>
          <Image
            className="w-full h-full rounded-full"
            src={formatCollection.image}
          />
          <Image
            src={chainImage}
            className="absolute w-4 h-4 bottom-[-5px] right-[-5px] border-2 border-ui00 rounded-full z-10 group-hover:border-ui01"
          />
        </div>
        <p className="leading-6 text-base font-semibold text-ui04">
          {formatCollection.name || 'Test Collection'}
        </p>
      </div>
      <div className="flex items-center gap-1">
        <p className="text-tx-secondary">{getLength(get(collectionDetail, 'data', []))}</p>
        <div className="h-full all-center ml-auto text-h3 flex item-center">
          <Icon name="chevron_right" className="text-ui02" />
        </div>
      </div>
    </div>
  )
}

export default CollectionNFT
