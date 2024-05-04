import { Image } from '@wallet/ui'
import { cx } from '@wallet/utils'
import get from 'lodash/get'
import { useTranslation } from 'react-i18next'

import useRouting from '../../../hooks/useRouting'
import type { INftItem } from '../../../types/nft'

import NFTImage from './NFTImage'
import { onSaveCurrentNft, useAppDispatch } from 'store'
import { CHAIN_IMAGE } from 'store/constants'

// import NFTDetail from './NFTDetail'

interface IProps {
  className?: string
  nftDetail: INftItem
}

const NFTItem = (props: IProps) => {
  const { className, nftDetail } = props
  const { t } = useTranslation()

  const nftImage = get(nftDetail, 'image') || get(nftDetail, 'metaData.image')
  const { navigateScreen } = useRouting()
  const dispatch = useAppDispatch()

  const hover = 'transition-all duration-300'
  const clsx = cx(
    `relative flex flex-col cursor-pointer w-auto overflow-hidden rounded-lg ${className} ${hover}`,
    {
      'flex items-center justify-center': !nftImage
    }
  )
  const classImage = cx('rounded-lg relative', {
    'min-w-full min-h-full m-auto': !nftImage
  })

  const onSelectNft = () => {
    window.closeModal()
    dispatch(onSaveCurrentNft(nftDetail))
    navigateScreen(
      `/collection/${nftDetail.chain}/${nftDetail.address}/${nftDetail.id}`
    )()
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

  const nftChain = get(nftDetail, 'chain')

  return (
    <div onClick={onSelectNft} className={clsx}>
      <div className="relative bg-ui01 rounded-lg w-full h-[131px]">
        <Image
          src={CHAIN_IMAGE[nftChain]}
          className="absolute w-4 h-4 top-[10px] left-[10px] rounded-full z-10"
        />
        <NFTImage className={classImage} src={nftImage} />
      </div>
      <div className="w-full text-ui04 text-tiny p-3 truncate">
        #{nftDetail.id}
      </div>
    </div>
  )
}

export default NFTItem
