import type { Token, Wallet } from '@wallet/core'
import { Button, Icon, Image } from '@wallet/ui'
import { convertWeiToBalance, formatNumberBro } from '@wallet/utils'
import get from 'lodash/get'
import { useMemo, useState } from 'react'
import { renderGasFee } from '../../../common/functions'

import type { INftItem } from '../../../types'
import { useTranslation } from 'react-i18next'

import { useSendNftContext } from '../context'
import useManageToken from '../../../hooks/useManageToken'
import { useAppSelector } from 'store'
import { CHAIN_IMAGE } from 'store/constants'

type TypeSend = 'send' | 'receive'
interface IProps {
  fromWallet: Wallet
  toAddress: string
  symbol?: string
  nftInfo: INftItem
  handleTransfer?: (isGestGas?: boolean, gasLimit?: number) => Promise<string>
  isSendTxs?: boolean,
}

const ReviewSendNft = (props: IProps) => {
  const { fromWallet, toAddress, nftInfo, isSendTxs, handleTransfer, symbol} = props
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(false)
  const { gasFee, gasDecimal, chain } = useSendNftContext()
  const { tokens } = useManageToken()

  const [wallets, activeNetwork] = useAppSelector((state) => {
    return [
      state.wallet.wallets,
      state.setting.activeNetwork
    ]
  })

  const nftName = get(nftInfo, 'name', '')
  const idNft = get(nftInfo, 'id', '')
  const nftImage = get(nftInfo, 'image') || get(nftInfo, 'metaData.image', '')

  const handleConfirm = async () => {
    setIsLoading(true)
    await handleTransfer?.()
    setIsLoading(false)
  }

  const renderInfoReview = (
    type: TypeSend,
    wallet: any
  ) => {
    const address = get(wallet, 'address', '')
    const name = get(wallet, 'name', '')
    const avatar = get(wallet, 'avatar', 'bg-ui01')

    const renderType = type === 'send' ? `From ${name || ''}` : `To ${name || ''}`
    return (
      <div className="flex gap-4 items-center">
        <div className="h-10 w-10 flex justify-center items-end flex-shrink-0">
          <div className={`w-10 h-10 ${avatar}`}></div>
        </div>
        <div className="">
          <p className="text-ui03 text-tiny mb-1">{renderType}</p>
          <p className="text-ui04 text-base break-all">{address}</p>
        </div>
      </div>
    )
  }

  const mainToken: Token = tokens.find(
    (token) => token.address === undefined
  )

  const mainBalance = parseFloat(
    convertWeiToBalance(get(mainToken, 'rawBalance', ''), get(mainToken, 'decimal'))
  )

  const isCheckNotEnoughTxsFee =
    Number(convertWeiToBalance(String(gasFee), gasDecimal)) >
    Number(mainBalance)

  const formatGasFee = formatNumberBro(
    convertWeiToBalance(gasFee.toString(), gasDecimal),
    6
  )

  // const walletTo = useMemo(() => {
  //   const walletByUser = getWalletByAddress(toAddress)
  //   if (isEmpty(walletByUser)) {
  //     return { avatar: '', address: toAddress, name: '' }
  //   }
  //   return walletByUser
  // }, [toAddress])

  const walletTo = useMemo(() => {
    const availableWallet = wallets.find((wallet) => wallet.address === toAddress)
    return availableWallet || { avatar: '', address: toAddress, name: '' }
  }, [toAddress])

  const isVideo = nftImage.includes('.mp4')

  return (
    <div className="h-full w-full relative flex flex-col overflow-scroll">
      <div className="pb-5 px-5">
        <div className="flex flex-col gap-2">
          {renderInfoReview(
            'send',
            fromWallet
          )}
          <div className="flex items-center justify-center text-ui03 w-10 h-8">
            <Icon className="font-semibold text-h2" name="arrow_down" />
          </div>
          {renderInfoReview(
            'receive',
            walletTo
          )}
        </div>

        <div className="py-4 border-b border-ui01">
          <div className="flex gap-4 items-center justify-between">
            {isVideo ? (
              <video width="40" height="40" autoPlay loop>
                <source src={nftImage} type="video/mp4" />
              </video>
            ) : (
              <Image className="w-10 h-10" src={nftImage} />
            )}
              <p className="text-ui04 text-base font-semibold truncate w-full">#{idNft} {nftName}</p>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">
          <p className="text-ui03 text-tiny">
            {t('setting_screen.estimated_gas_fee')}
          </p>
          <p className="text-ui04 text-tiny">
            {formatGasFee} {get(activeNetwork, 'symbol')} ~{`$${renderGasFee(formatGasFee, tokens)}`}
          </p>
        </div>
      </div>

      <div className="mt-auto px-4">
        {isCheckNotEnoughTxsFee && (
          <div className="text-center mb-4 text-tiny text-ui03">
            {t('wrap_send.not_enough_txs_fee')}
          </div>
        )}
        <Button
          isLoading={isLoading || isSendTxs}
          disabled={isLoading || isCheckNotEnoughTxsFee}
          className="w-full mt-3"
          type="primary"
          onClick={handleConfirm}>
          {t('setting_screen.confirm')}
        </Button>
      </div>
    </div>
  )
}

export default ReviewSendNft
