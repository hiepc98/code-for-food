import { Image } from '@wallet/ui'
import { cx } from '@wallet/utils'
import get from 'lodash/get'

import type { INftItem } from '../../types'

import NFTImage from './NFTImage'
import { useMainContext } from '../MainV2/context'
import { useHistory } from 'react-router-dom'
import { onSaveCurrentNft, useAppDispatch } from 'store'

// import NFTDetail from './NFTDetail'

interface IProps {
  className?: string
  nftDetail: INftItem
}

const NFTItem = (props: IProps) => {
  const history = useHistory()
  const { className, nftDetail } = props

  // const { onSaveCurrentNft } = useMainContext()
  const dispatch = useAppDispatch()

  const nftImage = get(nftDetail, 'image') || get(nftDetail, 'metaData.image')
  const isVideo = nftImage?.includes('.mp4')

  const hover = 'transition-all duration-300'
  const clsx = cx(
    `relative flex flex-col cursor-pointer w-auto overflow-hidden ${className} ${hover}`,
    {
      'flex items-center justify-center': !nftImage
    }
  )
  const classImage = cx('rounded-lg relative', {
    'min-w-full min-h-full m-auto': !nftImage
  })

  const onSelectNft = () => {
    dispatch(onSaveCurrentNft(nftDetail))
    window.closeModal()
    history.push(`/collection/${nftDetail.chain}/${nftDetail.address}/${nftDetail.id}`)
  }

  // const onSelectNft = () => {
  //   dispatch(onSaveCurrentNft(nftDetail))
  //   window.openModal({
  //     type: 'none',
  //     title: get(nftDetail, 'name'),
  //     content: <NFTDetail/>,
  //     contentType: 'other',
  //     closable: true
  //   })
  // }

  return (
    <div onClick={onSelectNft} className={clsx}>
      <div className="relative bg-bg-top flex justify-center w-full h-[131px]">
        {/* <Image
          src={nftDetail.chain}
          className="absolute w-4 h-4 top-[10px] left-[10px] rounded-full z-10"
        /> */}
        {isVideo ? (
            <video width="131" height="131" autoPlay loop>
              <source src={nftImage} type="video/mp4" />
            </video>
          ) : (
            <NFTImage className={classImage} src={nftImage || ''} />

          )}
        
      </div>
      <div className="w-full bg-ui00 text-ui04 text-tiny p-3 truncate">
          #{nftDetail.id}-{get(nftDetail, 'metaData.name', 'name')}
        </div>
      
    </div>
  )
}

export default NFTItem
