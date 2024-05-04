import { Icon, Image, Input, Touch } from '@wallet/ui'
import { cx } from '@wallet/utils'
import get from 'lodash/get'
import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppSelector } from 'store'
import ListWalletSelect from '../../Token/components/ListWalletSelect'
import BoxContent from '../../shared/BoxContent'

import { useSendNftContext } from '../context'
import { CHAIN_IMAGE } from 'store/constants'
import GasSlider from '../../shared/GasSlider'
import { TomoWallet } from 'store/types'
import { isEmpty } from 'lodash'

interface IProps {
  isLoadingGas?: boolean
  symbol?: string
  isCustomGas?: boolean
  setIsCustomGas?: (value: boolean) => void
  handleEstimateGas?: any
}

const SendToNft = (props: IProps) => {
  const { t } = useTranslation()
  const { isCustomGas, setIsCustomGas, handleEstimateGas, symbol } = props

  const {
    chain,
    errAddress,
    toAddress,
    gasFee,
    gasDecimal,
    gasStep,
    gasLimit,
    setGasFee,
    setGasPrice,
    setToAddress,
    setGasLimit,
    setGasStep,
    setGasDecimal,
    setErrAddress,
    setWalletReceiver,
    getWalletByAddress
  } = useSendNftContext()

  const currentNFT = useAppSelector((state) => state.wallet.currentNFT)
  const wallets = useAppSelector((state) => state.wallet.wallets)
  const activeWallet = useAppSelector((state) => state.wallet.activeWallet)

  const [isLoadingGas, setIsLoadingGas] = useState(false)

  const currentChain = useMemo(() => {
    if (!currentNFT) return null
    return get(currentNFT, 'chain', null)
  }, [currentNFT])

  useEffect(() => {
    if (gasFee && gasFee > 0) return
    handleEstGas()
  }, [])

  const handleEstGas = async () => {
    setIsLoadingGas(true)
    try {
      await handleEstimateGas()
    } catch (e) {
      setIsLoadingGas(false)
    }
    setIsLoadingGas(false)
  }

  const onChangeAddress = (event: any) => {
    const { value } = event.target

    if (!value) {
      setErrAddress?.('')
      setToAddress?.('')
      return
    }

    const isValidAddress = window.walletServices.validateAddress({
      address: value,
      chain
    })

    if (isValidAddress) {
      setErrAddress?.('')
    } else {
      setErrAddress?.(t('send_to_nft.invalid_address'))
    }
    setToAddress?.(value)
  }

  const onChangeGas = (gasFee: number) => {
    setGasFee?.(gasFee)
    setGasPrice?.(gasFee / gasLimit!)
  }

  const setWalletSelected = (v: TomoWallet) => {
    setErrAddress?.(v.address || '')
  }

  const openModalWalletList = () => {
    window.openModal({
      type: 'none',
      content: (
        <ListWalletSelect
          walletSelected={activeWallet!}
          typeList={'receiver'}
          setToAddress={setToAddress}
          setErrAddress={setErrAddress}
          setWalletSelected={setWalletSelected}
          setWalletReceiver={setWalletReceiver}
          toAddress={toAddress}
          chainSelected={currentChain!}
          wallets={wallets}
          t={t}
        />
      ),
      contentType: 'other',
      closable: true
    })
  }

  const nftImage =
    get(currentNFT, 'image') || get(currentNFT, 'metaData.image', '')
  const isVideo = nftImage.includes('.mp4')

  const addressReceive = getWalletByAddress?.(toAddress)

  const receiverAvatar = get(addressReceive, 'avatar', '')

  return (
    <div className="pl-4 pr-4">
      <div className="flex items-center justify-between mb-6 py-4">
        <div className="avatar mr-3">
          <div className="relative h-10 w-10 all-center bg-ui01">
            {isVideo ? (
              <video width="100%" height="10" autoPlay loop>
                <source src={nftImage} type="video/mp4" />
              </video>
            ) : (
              <Image className="w-10 h-10" src={nftImage} />
            )}
          </div>
        </div>

        <p className="text-h5 text-ui04 truncate">
          #{get(currentNFT, 'id', '')} {get(currentNFT, 'name')}
        </p>
      </div>

      <BoxContent className={cx({ 'border border-red': errAddress })}>
        <div className="border-none border-ui00 text-base">
          <div className="flex justify-between items-center pt-4">
            {isEmpty(addressReceive) ? (
              <p className="text-tiny leading-[16px] text-ui04">{t('To')}</p>
            ) : (
              <div className="flex items-center">
                <div
                  className={cx(
                    `text-ui00 text-[24px] all-center mr-3 ${receiverAvatar} w-5 h-5`
                  )}></div>
                <p className="truncate text-tiny text-ui04 max-w-[200px]">
                  {get(addressReceive, 'name')}
                </p>
              </div>
            )}
            {wallets.length > 1 && (
              <Touch
                onClick={() => openModalWalletList()}
                size={{ height: 20, width: 20 }}>
                <Icon name="contacts" className="text-h4 text-ui04" />
              </Touch>
            )}
          </div>
          <Input
            textarea
            className="px-0 py-1 mb-0 text-ui04 border-none"
            rows={2}
            // status={errAddress ? 'error' : 'normal'}
            // caption={errAddress}
            isAllowClear={true}
            value={toAddress}
            onChange={onChangeAddress}
            placeholder="0xf..."
            isPastable
            // label={t('To')}
          />
        </div>
      </BoxContent>

      <p
        className={cx('text-red', {
          'my-2': errAddress
        })}>
        {errAddress}
      </p>
      <GasSlider
        chain={chain}
        isLoading={isLoadingGas}
        isCustomGas={isCustomGas}
        symbol={symbol}
        gasStep={gasStep}
        gasFee={gasFee}
        gasLimit={gasLimit}
        gasDecimal={gasDecimal}
        className="mt-4"
        t={t}
        setIsCustomGas={setIsCustomGas}
        onChange={onChangeGas}
      />
    </div>
  )
}

export default SendToNft
