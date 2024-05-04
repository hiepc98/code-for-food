import type { Wallet } from '@wallet/core'
import { Button, Image } from '@wallet/ui'
// import { formatNumberBro } from '@wallet/utils'
import dayjs from 'dayjs'
import get from 'lodash/get'
import { useTranslation } from 'react-i18next'

import useRouting from '../../../hooks/useRouting'
import type { INftItem } from '../../../types'
import withI18nProvider from '../../../provider'
import { viewScan } from '../../../common/functions'

import { useAppSelector } from 'store'

interface IProps {
  fromWallet: Wallet
  toAddress: string
  hash: string
  symbol?: string
  nftInfo: INftItem
  feeTxs?: string
  chain?: string
  handleTransfer?: () => void
}

const SendNftSuccess = (props: IProps) => {
  const { fromWallet, toAddress, nftInfo, feeTxs, hash, symbol, chain} = props
  const { t } = useTranslation()

  const { navigateScreen } = useRouting()
  // const { onCopyWithTitle } = useClipboard()

  const [wallets] = useAppSelector((state) => {
    return [state.wallet.wallets]
  })

  const renderBalance = '0.00'

  const onCloseModalSuccess = () => {
    window.closeModal()
    navigateScreen('/main', {
      isReload: true
    })()
  }

  const renderWalletName = (address: string) => {
    const availableAddress = wallets.find(
      (wallet) => wallet.address === address
    )
    if (availableAddress) {
      return availableAddress.name
    }
    return ''
  }

  const openScan = () => {
    viewScan(hash, false, chain)
  }

  return (
    <div className="w-full h-full p-5 mt-[64px] relative flex flex-col overflow-scroll">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              className="w-10 h-10 mr-3"
              src={get(nftInfo, 'metaData.image', '_')}
            />
          </div>
          <div className="text-right">
            <p className="text-red text-base truncate">
              <span className="mr-1">{t('send_nft_success.send')}</span> #
              {get(nftInfo, 'id')}
            </p>
            <p className="text-ui03 text-tiny truncate">
              {get(nftInfo, 'name')}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <div className="grid grid-cols-2 gap-2 border-b border-ui01 last:border-b-0 pb-4 pt-3">
            <p className="text-ui03 text-tiny">{t('send_nft_success.date')}</p>
            <p className="text-ui04 text-base text-right break-words">
              {dayjs(new Date()).format('HH:mm DD/MM/YYYY')}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 border-b border-ui01 last:border-b-0 py-4">
            <p className="text-ui03 text-tiny">
              {t('send_nft_success.gas_fee')}
            </p>
            <p className="text-ui04 text-base text-right break-words">
              {feeTxs} {symbol} (~$
              {renderBalance})
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 border-b border-ui01 last:border-b-0 py-4">
            <div className="w-full col-span-1">
              <p className="text-ui03 text-tiny">
                {t('send_nft_success.from')}
              </p>
              <p className="text-ui03 text-tiny break-words max-w-full">
                {renderWalletName(get(fromWallet, 'address', ''))}
              </p>
            </div>
            <div className="flex items-center justify-end w-full col-span-2">
              <p className="text-ui04 text-base text-right break-words w-full">
                {get(fromWallet, 'address', '')}
              </p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 border-b border-ui01 last:border-b-0 py-4">
            <div className="w-full col-span-1">
              <p className="text-ui03 text-tiny">{t('send_nft_success.to')}</p>
              <p className="text-ui03 text-tiny break-words max-w-full">
                {renderWalletName(toAddress)}
              </p>
            </div>
            <div className="flex items-center justify-end w-full col-span-2">
              <p className="text-ui04 text-base text-right break-words w-full">
                {toAddress}
              </p>
            </div>
          </div>
        </div>
        <Button
          onClick={openScan}
          className="w-full text-h6 text-primary p-2"
          type="transparent">
          {t('send_nft_success.view_on_block_explorer')}
        </Button>
      </div>
      <div className="mt-auto bottom-4 left-0 flex flex-col items-center justify-center w-full">
        <Button onClick={onCloseModalSuccess} className="w-full">
          {t('send_nft_success.back_to_home')}
        </Button>
      </div>
    </div>
  )
}

export default withI18nProvider(SendNftSuccess)
