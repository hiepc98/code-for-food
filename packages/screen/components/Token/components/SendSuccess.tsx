import type { Token, Wallet } from '@wallet/core'
import { Button, Image } from '@wallet/ui'
import { convertWeiToBalance, formatNumberBro } from '@wallet/utils'
import { DECIMALS_TOKEN_DISPLAY } from '../../../constants'
import dayjs from 'dayjs'
import useTokenLocal from '../../../hooks/useTokenLocal'
import get from 'lodash/get'
import { useCallback } from 'react'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import withI18nProvider from '../../../provider'
import { useAppSelector } from 'store'
import { viewScan } from '../../../common/functions'

interface IProps {
  fromWallet: Wallet
  toAddress: string
  hash: string
  memo?: string
  tokenInfo: Token
  amount: string
  gasFee: string
  gasDecimal?: number
  chain?: string
  handleTransfer?: () => void
  mainToken: Token | null
  isGasFree: boolean
}

const SendSuccess = (props: IProps) => {
  const {
    hash,
    chain,
    toAddress,
    fromWallet,
    tokenInfo,
    gasDecimal,
    amount,
    gasFee,
    mainToken,
    isGasFree
  } = props

  const { t } = useTranslation()
  const [wallets] = useAppSelector((state) => {
    return [state.wallet.wallets]
  })

  const history = useHistory()
  const { getTokenMain } = useTokenLocal()

  const onCloseModalSuccess = () => {
    window.closeModal()
    history.push('/main', {
      isReload: true
    })
  }

  const renderGasFee = useCallback(() => {
    const mainToken = getTokenMain(chain || '')

    const amount = Number(
      formatNumberBro(
        convertWeiToBalance(gasFee.toString(), gasDecimal),
        DECIMALS_TOKEN_DISPLAY[mainToken.symbol] || 6
      )
    )
    let lasAmount = amount + ` ${get(mainToken, 'symbol')}`

    const price = get(mainToken, 'prices.price', null)

    if (price) {
      lasAmount =
        amount +
        ` ${get(mainToken, 'symbol')}` +
        ` (~$${formatNumberBro(amount * price, 4)})`
    }

    return lasAmount
  }, [])

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

  // const formatGasFee = formatNumberBro(
  //   convertWeiToBalance(gasFee.toString(), gasDecimal),
  //   6
  // )
  const caculateTotal = () => {
    const price = get(tokenInfo, 'prices.price', 0)
    const total = formatNumberBro(Number(price) * Number(amount), 2)
    return { total }
  }

  return (
    <div className="w-full h-full p-5 mt-20 relative flex flex-col overflow-scroll">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Image
              className="w-10 h-10 rounded-full mr-3"
              src={get(tokenInfo, 'image', '')}
            />
            <div>
              <p className="text-base text-ui04 font-semibold">
                {get(tokenInfo, 'name')}
              </p>
              <p className="text-tiny text-ui03 uppercase">
                {get(tokenInfo, 'symbol')}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-red text-base uppercase">
              -{formatNumberBro(amount)} {get(tokenInfo, 'symbol')}
            </p>
            <p className="text-ui03 text-tiny text-right">
              ~${caculateTotal().total}
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
              {isGasFree ? t('history_detail.zero_gas') : renderGasFee()}
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2 border-b border-ui01 last:border-b-0 py-4 items-start">
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
          <div className="grid grid-cols-3 gap-2 border-b border-ui01 last:border-b-0 py-4 items-start">
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
          className="w-full text-base text-primary p-2 pb-5"
          type="transparent">
          {t('View on block explorer')}
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

export default withI18nProvider(SendSuccess)
