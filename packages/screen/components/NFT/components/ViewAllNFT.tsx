import get from 'lodash/get'

import { type INftItem } from '../../../types'

import NFTImage from './NFTImage'

interface IProps {
  className?: string
  dataNFT: INftItem
}

const ViewAllNFT = (props: IProps) => {
  const { dataNFT } = props

  const nftImage = get(dataNFT, 'image') || get(dataNFT, 'metaData.image', '')
  const isVideo = nftImage.includes('.mp4')

  return (
    <div className="text-ui04 h-full pt-20 w-full relative">
      {isVideo ? (
        <video width="100%" height="240" autoPlay loop>
          <source src={nftImage} type="video/mp4" />
        </video>
      ) : (
        <NFTImage className="h-[390px] w-full bg-ui01" src={nftImage} />
      )}
    </div>
  )
}

export default ViewAllNFT
