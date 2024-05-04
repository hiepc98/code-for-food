import { Button, Icon, MainLayout } from '@wallet/ui'
import { truncate } from '@wallet/utils'
import get from 'lodash/get'
import { useTranslation } from 'react-i18next'

import useClipboard from '../../hooks/useClipboard'
import useRouting from '../../hooks/useRouting'

import NFTImage from './components/NFTImage'
import ViewAllNFT from './components/ViewAllNFT'
import { useAppSelector } from 'store'
import { INftItem } from 'types'
import withI18nProvider from '../../provider'

const NFTDetailScreen = (props: any) => {
  const { t } = useTranslation()
  const [currentNft, listCollections] = useAppSelector((state) => [
    state.wallet.currentNFT,
    state.wallet.listCollections
  ])

  const { navigateScreen } = useRouting()
  const { onCopyWithTitle } = useClipboard({ t })
  // const { getWalletByChain } = useWalletUser()

  const onSelectTypeModal = (selectedNFT?: INftItem) => {
    window.openModal({
      type: 'none',
      title: t('setting_screen.nft_detail_screen.full_view'),
      content: <ViewAllNFT dataNFT={selectedNFT!} />,
      contentType: 'other',
      closable: true
    })
  }
  const nftImage =
    get(currentNft, 'image') || get(currentNft, 'metaData.image', '')
  const createdByAddress = get(currentNft, 'address', '')

  const currentCollections =
    listCollections &&
    listCollections.find((collection) => {
      return collection?.data.filter(
        (nft) => nft?.address === currentNft?.address
      )
    })
  const isVideo = nftImage.includes('.mp4')
  const ownerNft = get(currentNft, 'walletAddress', '')

  return (
    <MainLayout
      title={get(currentCollections, 'collection.name', '')}
      className="overflow-auto">
      <div className="px-5 text-base overflow-auto">
        <div className="relative">
          {isVideo ? (
            <video width="100%" height="240" autoPlay loop>
              <source src={nftImage} type="video/mp4" />
            </video>
          ) : (
            <NFTImage className="h-[350px] w-full bg-ui01" src={nftImage} />
          )}

          <div
            className="absolute group flex items-center justify-center text-ui00 w-12 h-12 bg-[#0a0a0a33] rounded-full right-2 bottom-2 cursor-pointer"
            onClick={() => onSelectTypeModal(currentNft)}>
            <img
              src="/public/img/icons/view_all.svg"
              className="w-[24px] h-[24px] group-hover:h-[26px] group-hover:w-[26px] transition-all duration-300"
            />
          </div>
        </div>

        <Button
          onClick={navigateScreen(
            `/collection/${get(currentNft, 'chain', 'ether')}/${get(
              currentNft,
              'address'
            )}/${get(currentNft, 'id', '')}/send`
          )}
          type="primary"
          isBlock
          className="mt-6">
          {t('send_nft_success.send')}
        </Button>

        <p className="mt-6 text-ui04 text-h5 truncate">
          {get(currentNft, 'name', '')} #{get(currentNft, 'id', '')}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-ui03 truncate">
            <p className="">
              {t('setting_screen.nft_detail_screen.contract_address')}
            </p>
            <span className="text-ui04 text-body-14-regular">
              {truncate(get(currentNft, 'address', ''))}
            </span>
            <Icon
              onClick={onCopyWithTitle(
                get(currentNft, 'address', ''),
                t('main_screen.address')
              )}
              className="pl-2 text-base cursor-pointer text-ui04"
              name="copy"
            />
          </div>

          <div className="text-ui03 truncate">
            <p className="">
              {t('setting_screen.nft_detail_screen.created_by')}
            </p>
            <span className="text-ui04 text-body-14-regular">
              {truncate(ownerNft)}
            </span>
            <Icon
              onClick={onCopyWithTitle(ownerNft, t('main_screen.address'))}
              className="pl-2 text-base cursor-pointer text-ui04"
              name="copy"
            />
          </div>

          <div className="text-ui03 truncate">
            <p className="">
              {t('setting_screen.nft_detail_screen.token_standard')}
            </p>
            <span className="text-ui04">{get(currentNft, 'standard', '')}</span>
          </div>

          <div className="text-ui03 truncate">
            <p className="">
              {' '}
              {t('setting_screen.nft_detail_screen.token_id')}
            </p>
            <span className="text-ui04">{get(currentNft, 'id', '')}</span>
          </div>
        </div>

        {/* <div className="mt-6 text-ui03">
          <p className="mb-1">
            {t('setting_screen.nft_detail_screen.description')}
          </p>
          <span className="text-ui04">
            {get(currentNft, 'description', '')}
          </span>
        </div> */}
      </div>
    </MainLayout>
  )
}

export default withI18nProvider(NFTDetailScreen)
