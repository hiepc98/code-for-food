import type { Token, Wallet } from '@wallet/core'
import { Button, MainLayout } from '@wallet/ui'
import {
  convertBalanceToWei,
  convertWeiToBalance,
  formatNumberBro,
  upperCase
} from '@wallet/utils'
import { isEmpty } from 'lodash'
import get from 'lodash/get'
import React, { useEffect, useMemo, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { BaseAdapter } from 'store/service/BaseAPI'
import dayjs from 'dayjs'

// import { useWallet } from '~controllers/contexts/WalletContext'
import useManageToken from '../../../hooks/useManageToken'
import useRouting from '../../../hooks/useRouting'

import { useSendNftContext } from '../context'
import { StepType } from '../types'
import ReviewSendNft from './ReviewSendNft'
import SendNftSuccess from './SendNftSuccess'
import SendToNft from './SendToNft'
import { useAppSelector } from 'store'
import SendTokenFailed from '../../../components/Token/components/SendTokenFailed'
import withI18nProvider from '../../../provider'
import { useTranslation } from 'react-i18next'

type ButtonType = {
  isDisabled: boolean
  text: string
}

const WrapSendNft = ({ encryptService }) => {
  const { t } = useTranslation()
  const history = useHistory()
  const { navigateScreen } = useRouting()
  // const { setWalletNfts } = useWallet()
  const [activeWallet, currentNFT, walletsByUser, activeNetwork, networks] =
    useAppSelector((state) => [
      state.wallet.activeWallet,
      state.wallet.currentNFT,
      state.wallet.walletsByUser,
      state.setting.activeNetwork,
      state.setting.networks
    ])
  const {
    toAddress,
    currentStep,
    isSendTxs,
    gasFee,
    gasPrice,
    gasLimit,
    gasDecimal,
    gasStep,
    chain,
    errAddress,
    walletReceiver,
    setCurrentStep,
    setGasLimit,
    setIsSendTxs,
    setGasFee,
    setGasPrice,
    setGasStep,
    setGasDecimal
  } = useSendNftContext()
  const [isCustomGas, setIsCustomGas] = useState(false)
  const { tokens } = useManageToken()
  // const { getWalletByChain } = useWalletUser()

  const symbol = networks.find((item) => item.chain === chain)?.symbol

  const handleEstimateGas = async () => {
    // const getChainWallet = getWalletByChain(chain)
    const wallet = encryptService.decryptWallet(activeWallet)
    const transaction = {
      from: get(wallet, 'address', ''),
      to: get(wallet, 'address', ''),
      address: get(currentNFT, 'address', ''),
      id: get(currentNFT, 'id', ''),
      nft: currentNFT
    }

    const response = await window.walletServices.estimateGas({
      transaction,
      wallet,
      chain: get(currentNFT, 'chain')
    })

    const { gasPrice, gasStep, decimal, isRaw } = response

    const gasPriceEst = gasStep.standard

    const gasLimit = isRaw ? convertBalanceToWei(gasPrice, decimal) : gasPrice

    const gasFee = gasLimit * gasPriceEst

    setGasStep?.(gasStep)
    setGasLimit?.(gasLimit)
    setGasPrice?.(gasPriceEst)
    setGasDecimal?.(decimal)
    setGasFee?.(gasFee)

    return response
  }

  // const isValidAddress = useMemo(() => {
  //   if (getLength(toAddress) === 0) return true
  //   return services.wallet.validateAddress({
  //     address: toAddress,
  //     chain
  //   })
  // }, [toAddress, services])

  // const renderStateButton: ButtonType = useMemo(() => {
  //   // if (!isValidAddress) {
  //   //   return { isDisabled: true, text: t('send_to_nft.invalid_address') }
  //   // }
  //   return { isDisabled: false, text: t('setting_screen.review') }
  // }, [isValidAddress])

  const renderTitle = useMemo(() => {
    const objTitle = {
      [StepType.From]: t(''),
      [StepType.To]: t('wrap_send_nft.send_nft_to'),
      [StepType.Confirm]: t('wrap_send_nft.you_are_sending')
    }
    return objTitle[currentStep]
  }, [currentStep])

  const onOpenModalSuccess = (hash: string, gasLimit: string) => {
    const feeTxs = formatNumberBro(
      convertWeiToBalance(gasFee.toString(), gasDecimal),
      6
    )
    window.openModal({
      type: 'none',
      title: t('wrap_send_nft.nft_sent'),
      content: (
        <SendNftSuccess
          symbol={symbol}
          feeTxs={String(feeTxs)}
          hash={hash}
          chain={chain}
          t={t}
          fromWallet={activeWallet!}
          toAddress={toAddress}
          nftInfo={currentNFT!}
        />
      ),
      contentType: 'other',
      closable: true
    })
  }

  const onShowModalError = () => {
    window.openModal({
      type: 'none',
      closable: true,
      content: <SendTokenFailed history={history} />,
      onCancel: () => {
        history.push('/main')
      }
    })
  }

  const handleTransfer = async () => {
    setIsSendTxs?.(true)
    try {
      // const walletByChain = getWalletByChain(chain)
      const wallet = encryptService.decryptWallet(activeWallet)
      const receiver = toAddress === '' ? get(wallet, 'address', '') : toAddress
      const calculateGaPrice = (gasLimit! * gasPrice).toFixed()

      const transaction = {
        from: get(wallet, 'address', ''),
        to: receiver,
        address: get(currentNFT, 'address', ''),
        id: get(currentNFT, 'id', ''),
        nft: currentNFT
      }

      const response = await window.walletServices.transferNft({
        transaction,
        wallet,
        chain,
        gasLimit,
        gasPrice: String(calculateGaPrice)
      })

      // do stuff
      if (!response || isEmpty(response)) {
        onShowModalError()
        return ''
      }

      if (typeof response === 'string' && response) {
        const logTransaction = {
          ...transaction,
          chain: activeNetwork!.chain,
          hash: response,
          timestamp: dayjs.utc().format(),
          options: {
            gasFee: (gasLimit! * gasPrice).toFixed()
          },
          nftData: {
            address: get(currentNFT, 'address', ''),
            id: get(currentNFT, 'id', '')
          }
        }
        delete logTransaction.address
        delete logTransaction.id

        await BaseAdapter.post('record/log', logTransaction)
      }
      // setWalletNfts([]) // reset wallet nfts list
      onOpenModalSuccess(response, String(gasLimit))
      setTimeout(() => {
        navigateScreen('/main')()
      }, 500)

      setIsSendTxs?.(false)

      return ''
    } catch (err) {
      onShowModalError()
    } finally {
      setIsSendTxs?.(false)
    }
  }

  const handleConfirm = () => {
    if (currentStep === StepType.To) {
      setCurrentStep?.(StepType.Confirm)
    }
  }

  const onGoBack = () => {
    if (currentStep === StepType.Confirm) {
      return setCurrentStep?.(StepType.To)
    }
    history.goBack()
  }

  const renderStepSendNft = () => {
    const mainToken: Token = tokens.find((token) => token.address === undefined)
    const mainBalance = parseFloat(
      convertWeiToBalance(
        get(mainToken, 'rawBalance', ''),
        get(mainToken, 'decimal')
      )
    )

    // const walletSelected = get(currentNFT, 'chain')

    const isCheckNotEnoughTxsFee =
      Number(convertWeiToBalance(String(gasFee), gasDecimal)) >
      Number(mainBalance)

    if (currentStep === 'to') {
      return (
        <>
          <SendToNft
            symbol={symbol}
            isCustomGas={isCustomGas}
            setIsCustomGas={setIsCustomGas}
            handleEstimateGas={handleEstimateGas}
          />
          <div className="mt-auto bottom-6 pl-4 pr-4 w-full">
            {isCheckNotEnoughTxsFee && (
              <div className="text-center mb-4 text-tiny text-ui03">
                {t('wrap_send.not_enough_txs_fee', {
                  unit: upperCase(get(mainToken, 'symbol', 'vic'))
                })}
              </div>
            )}
            <Button
              disabled={
                !toAddress ||
                (!!errAddress && currentStep === StepType.To) ||
                isCheckNotEnoughTxsFee
              }
              isLoading={isSendTxs}
              onClick={handleConfirm}
              isBlock
              type="primary"
              className="w-full">
              {t('setting_screen.review')}
            </Button>
          </div>
        </>
      )
    }
    return (
      <ReviewSendNft
        symbol={symbol}
        fromWallet={activeWallet!}
        toAddress={toAddress}
        nftInfo={currentNFT!}
        handleTransfer={handleTransfer}
      />
    )
  }

  return (
    <MainLayout
      hideBack={isSendTxs}
      containerClass="relative"
      title={t(renderTitle)}
      sendTokenStep={currentStep}
      className={'pb-5'}
      backAction={onGoBack}>
      {renderStepSendNft()}
    </MainLayout>
  )
}

export default withI18nProvider(WrapSendNft)
