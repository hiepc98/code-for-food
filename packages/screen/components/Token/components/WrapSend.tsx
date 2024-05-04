/* eslint-disable object-shorthand */
import type { Token, IGasEstimate, Wallet } from '@wallet/core'
import { Button, MainLayout } from '@wallet/ui'
import {
  convertBalanceToWei,
  convertWeiToBalance,
  formatNumberBro
} from '@wallet/utils'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import cloneDeep from 'lodash/cloneDeep'
import get from 'lodash/get'
import { useEffect, useMemo, useState } from 'react'
import { BaseAdapter } from 'store/service/BaseAPI'

import { ADDRESS_ZERO } from '../../../constants'
import { RecentAddressState, StepType } from '../../../types'
import { formatTransferData } from '../../../utils'

import { useSendTokenContext } from '../context'
// import ListToken, { type TypeListToken } from './ListToken'
import ReviewSend from './ReviewSend'
import SendFrom from './SendFrom'
import SendSuccess from './SendSuccess'
import SendToToken from './SendToToken'
import SendTokenFailed from './SendTokenFailed'

import { useHistory, useParams } from 'react-router-dom'
import { isEmpty } from 'lodash'
import useManageToken from '../../../hooks/useManageToken'
import useReceiveAddress from '../../../hooks/useReceiveAddress'
import { useTranslation } from 'react-i18next'
import withI18nProvider from '../../../provider'

dayjs.extend(utc)

type ButtonType = {
  isDisabled: boolean
  text: string
  message?: string
}

const WrapSend = () => {
  const {
    amount,
    currentStep,
    encryptService,
    errAddress,
    fromScreen,
    gasDecimal,
    gasFee = 0,
    gasLimit = 0,
    gasPrice = 0,
    gasStep = {},
    isSendTxs,
    memo,
    service,
    toAddress,
    tokenSelected,
    listTokenSend,
    walletReceiver,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    wallets,
    walletSelected,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    // window,
    isGasFree,
    setIsGasFree,
    fetchTokenInfo,
    getMainBalance,
    getTokens,
    setCurrentStep,
    setGasDecimal,
    setGasFee,
    setGasLimit,
    setGasPrice,
    setGasStep,
    setIsSendTxs,
    setTokenSelected,
    setListTokenSend,
    rawAmount,
    isSendMaxOption,
    setSendMaxOption
    // setIsTokenHasBalance,
    // setWalletSelected
  } = useSendTokenContext()

  const { t } = useTranslation()

  const { address, chain } = useParams<{ address: string; chain: string }>()

  const history = useHistory()
  const { tokens } = useManageToken()

  const [isLoadingGas, setIsLoadingGas] = useState(false)
  const [isLoadingBalance, setIsLoadingBalance] = useState(false)

  const [isCustomGas, setIsCustomGas] = useState(false)
  const [mainBalance, setMainBalance] = useState(0)
  const [mainToken, setMainToken] = useState<Token | undefined>(undefined)
  const intervalInMilliseconds = 15000 // 15 seconds
  const { addRecentContact } = useReceiveAddress()

  const reloadMainAndSelectedToken = async () => {
    const mainToken = await getMainBalance?.()
    const mainBalance = parseFloat(
      convertWeiToBalance(
        get(mainToken, 'rawBalance', '0'),
        get(mainToken, 'decimal')
      )
    )
    setMainToken(mainToken)
    setMainBalance(mainBalance)
    await reloadBalanceSend()
  }

  const fetchTokensInfo = async () => {
    const listAllToken = isEmpty(listTokenSend) ? tokens : listTokenSend
    if (listAllToken && listAllToken.length) {
      await fetchTokenInfo?.(listAllToken)
    }
  }

  useEffect(() => {
    // Set the interval to call the function every 15 seconds
    // const intervalId = setInterval(async () => {
    const reload = async () => {
      await fetchTokensInfo()
      await reloadMainAndSelectedToken()
    }
    // }, intervalInMilliseconds)

    // return () => {
    //   clearInterval(intervalId)
    // }
    reload()
  }, [])

  useEffect(() => {
    ;(async () => {
      await reloadMainAndSelectedToken()
    })()
  }, [currentStep, walletSelected])

  const isCheckNotEnoughTxsFee = useMemo(() => {
    // if(gasFee === null || gasFee === undefined || mainToken === null || mainToken === undefined) return false // check lai ???
    if (!isSendMaxOption && tokenSelected?.address === mainToken?.address) {
      let amountInNumber = Number(rawAmount)
      if (Number.isNaN(amountInNumber)) {
        amountInNumber = 0
      }
      return (
        Number(convertWeiToBalance(String(gasFee), gasDecimal)) +
          amountInNumber >
        Number(mainBalance)
      )
    }

    return (
      Number(convertWeiToBalance(String(gasFee), gasDecimal)) >
        Number(mainBalance) && !isGasFree
    )
  }, [gasFee, mainBalance, amount, rawAmount])

  useEffect(() => {
    ;(async () => {
      await fetchTokensInfo()
    })()
  }, [address, chain])

  useEffect(() => {
    if (gasFee && gasFee > 0) return
    if (tokenSelected) handleEstGas()
  }, [tokenSelected])

  useEffect(() => {
    if (isCustomGas) return
    if (!gasStep) return
    setGasFee?.(gasFee * (gasStep?.standard ?? 1))
  }, [isCustomGas])

  const reloadBalanceSend = async () => {
    if (!tokenSelected) return
    setIsLoadingBalance(true)
    try {
      const tokens = getTokens && (await getTokens())
      const listAllToken = [
        ...(tokens || [])
        // ...(customTokens[get(tokenSelected, 'chain')] || [])
      ]
      setListTokenSend?.(listAllToken)
      const findCurrentToken = listAllToken.find(
        (token) => token.address === tokenSelected.address
      )
      if (findCurrentToken) setTokenSelected?.(findCurrentToken)
      else {
        const tokenSelectedEmpty = tokenSelected ?? cloneDeep(tokenSelected)
        tokenSelectedEmpty!.rawBalance = '0'
        tokenSelectedEmpty!.balance = '0'
        // if tokenselected is exist, change the amount to 0
        setTokenSelected?.(tokenSelectedEmpty)
      }
    } catch (e) {
      console.log('err', e)
    } finally {
      setIsLoadingBalance(false)
    }
  }

  const onChangeGas = (
    gasFee: number | undefined,
    gasPrice?: number | undefined
  ) => {
    setGasFee?.(gasFee || 0)
    setGasPrice?.(gasPrice || 0)
  }

  const handleEstGas = async () => {
    setIsLoadingGas(true)
    try {
      const config = {
        token: tokenSelected || undefined,
        wallet: walletSelected || undefined
      }
      const response = (await service?.estimateGas(config)) as IGasEstimate

      const { gasPrice, gasStep, decimal, isRaw } = response

      const customGasStep = cloneDeep(gasStep)

      const gasLimit = isRaw
        ? convertBalanceToWei(gasPrice.toString(), decimal)
        : gasPrice
      const gasPriceEst = customGasStep?.standard
      const gasFee = gasLimit * (gasPriceEst ?? 1)
      setIsGasFree?.(!!response?.isGasFree)

      setGasStep?.(customGasStep)
      setGasLimit?.(parseInt(String(gasLimit)))
      setGasPrice?.(gasPriceEst || 0) // price per GasLimit unit (as I understand)
      setGasDecimal?.(decimal)
      setGasFee?.(gasFee)
    } catch (e) {
      console.log('err', e)
    } finally {
      setIsLoadingGas(false)
    }
  }

  const onGoBack = () => {
    if (currentStep === StepType.To) {
      return setCurrentStep?.(StepType.From)
    }
    if (currentStep === StepType.From && fromScreen === 'main') {
      // onOpenModalTokens('send')
      setTimeout(() => {
        return history.push?.('/main', {
          isReload: true
        })
      }, 600)
    }
    if (currentStep === StepType.From && fromScreen === 'tokenDetail') {
      history.goBack()
    }
    if (currentStep === StepType.Confirm) {
      setCurrentStep?.(StepType.To)
    }
  }

  // Modal open later
  // const onOpenModalTokens = async (type: TypeListToken) => {
  //   const renderTitle = 'Send Token'
  //   window.openModal({
  //     type: 'none',
  //     title: t(renderTitle),
  //     content: <ListToken type={type} />,
  //     contentType: 'other',
  //     closable: true
  //   })
  // }

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

  const onOpenModalSuccess = (hash: string, gasFee: string) => {
    window.openModal({
      type: 'none',
      title: t('wrap_send.token_sent'),
      content: (
        <SendSuccess
          chain={chain}
          hash={hash}
          fromWallet={walletSelected as Wallet}
          toAddress={toAddress}
          memo={memo}
          isGasFree={isGasFree}
          tokenInfo={tokenSelected as Token}
          amount={amount}
          gasDecimal={gasDecimal}
          gasFee={gasFee}
          mainToken={mainToken as Token}
        />
      ),
      contentType: 'other',
      closable: true,
      onCancel: () => {
        history.replace('/main')
      }
    })
  }

  const handleConfirm = () => {
    if (currentStep === StepType.From) {
      setCurrentStep?.(StepType.To)
    }
    if (toAddress && currentStep === StepType.To) {
      setCurrentStep?.(StepType.Confirm)
    }
  }

  const handleTransfer = async (
    isEstimateGas?: boolean,
    gasLimitEst?: number
  ) => {
    setIsSendTxs?.(true)
    try {
      // const walletByChain = getWalletByChain(walletSelected.meta.chain)
      const wallet = encryptService.decryptWallet(walletSelected)
      const chain = get(tokenSelected, 'chain')

      const formatGasFee = formatNumberBro(
        convertWeiToBalance(gasFee.toString(), gasDecimal),
        8
      )

      const transaction: any = {
        from: get(walletSelected, 'address', ''),
        to: isEstimateGas ? ADDRESS_ZERO : toAddress,
        amount: rawAmount,
        gasFee: formatGasFee,
        token: tokenSelected,
        memo,
        options: {
          gasPrice: gasPrice
        }
      }

      const formatTxsData = formatTransferData(transaction)
      let response

      try {
        response = await service?.transfer({
          transaction: cloneDeep(formatTxsData),
          wallet,
          chain: chain,
          isEstimateGas,
          gasLimit: gasLimitEst,
          gasPrice: (gasLimit * gasPrice).toFixed() // meaning as gasFee onChain
        })

        if (typeof response === 'string' && response) {
          const logTransaction = {
            ...transaction,
            chain: 'tomo',
            hash: response,
            amount: amount,
            contract: {
              address: get(transaction, 'asset'),
              decimals: get(tokenSelected, 'decimals', 18)
            },
            timestamp: dayjs.utc().format(),
            options: {
              gasFee: (gasLimit * gasPrice).toFixed()
            }
          }

          delete logTransaction.asset
          await BaseAdapter.post('record/log', logTransaction)
        }
      } catch (e) {
        console.log('err', e)
      }

      setIsSendTxs?.(false)
      if (isEstimateGas) {
        return response
      }

      const recentContact: RecentAddressState = {
        wallet: walletSelected || null,
        address: toAddress
      }
      addRecentContact?.(recentContact)

      if (!response) {
        console.log('err', response)
        return onShowModalError()
      }
      return onOpenModalSuccess(response, gasFee.toString())
    } catch (err) {
      console.log(err)
      return onShowModalError()
    } finally {
      setIsSendTxs?.(false)
    }
  }

  const renderTitle = useMemo(() => {
    const objTitle = {
      [StepType.From]: t('wrap_send.send_from'),
      [StepType.To]: t('wrap_send.send_to'),
      [StepType.Confirm]: t('wrap_send.you_are_sending')
    }
    return objTitle[currentStep]
  }, [currentStep])

  const renderStateButton: ButtonType = useMemo(() => {
    const decimal = get(tokenSelected, 'decimal', 18)
    const balanceRaw = get(tokenSelected, 'rawBalance', '0')
    const amountRaw = convertBalanceToWei(rawAmount, decimal)
    const feeTxsRaw = convertBalanceToWei('0', decimal)
    const balanceAvailable = parseFloat(balanceRaw) - parseFloat(feeTxsRaw)
    const isNotEnoughBalance =
      Number(parseFloat(amountRaw)) - balanceAvailable > 0
    const isNotEnoughTxsFee =
      Number(convertWeiToBalance(String(gasFee), gasDecimal)) >
      Number(mainBalance)

    const isValidAddress = true

    // for screen send from
    if (isNotEnoughTxsFee && !isGasFree) {
      return { isDisabled: true, text: t('wrap_send.not_enough_txs_fee') }
    }

    if (parseFloat(amountRaw) <= 0) {
      const err: any = { isDisabled: true, text: t('wrap_send.enter_amount') }
      return err
    }

    if (isNotEnoughBalance) {

      return {
        isDisabled: true,
        text: t('wrap_send.insufficient_fund'),
        message: t('wrap_send.not_enough_balance', {
          symbol: get(tokenSelected, 'symbol', '').toLocaleUpperCase()
        })
      }
    }

    if (currentStep === StepType.From) {
      return { isDisabled: false, text: 'Next' }
    }

    // for screen send to
    if (!toAddress) {
      return { isDisabled: true, text: t('wrap_send.input_address') }
    }
    if (!isValidAddress) {
      return { isDisabled: true, text: t('send_to_nft.invalid_address') }
    }
    return { isDisabled: false, text: t('setting_screen.confirm') }
  }, [amount, tokenSelected, toAddress, currentStep, mainBalance, isGasFree])

  const renderStepSend = () => {
    if (currentStep === 'from') {
      return (
        <SendFrom
          setSendMaxOption={setSendMaxOption}
          errInput={renderStateButton.message}
          isLoadingGas={isLoadingGas}
          isCustomGas={isCustomGas}
          isLoading={isLoadingBalance}
          onChangeGas={onChangeGas}
          setIsCustomGas={setIsCustomGas}
        />
      )
    }
    if (currentStep === 'to') {
      return <SendToToken />
    }
    return (
      <ReviewSend
        isSendTxs={isSendTxs}
        handleTransfer={handleTransfer as any}
        fromWallet={walletSelected}
        walletReceiver={walletReceiver}
        toAddress={toAddress}
        memo={memo}
        wallets={wallets}
        tokenInfo={tokenSelected}
        amount={amount}
        mainBalance={mainBalance}
      />
    )
  }

  return (
    <MainLayout
      hideBack={isSendTxs}
      sendTokenStep={currentStep}
      title={t(renderTitle)}
      containerClass="relative"
      className="pb-5"
      backAction={onGoBack}>
      {renderStepSend()}

      {currentStep !== 'confirm' && (
        <div className="mt-auto bottom-6 pl-4 pr-4 w-full">
          {isCheckNotEnoughTxsFee && (
            <div className="text-center mb-4 text-tiny text-ui03">
              {t('wrap_send.not_enough_txs_fee', {
                unit: get(mainToken, 'symbol', 'vic')
              })}
            </div>
          )}
          <Button
            isBlock
            isLoading={isSendTxs}
            disabled={
              (errAddress && currentStep === StepType.To) ||
              renderStateButton.isDisabled ||
              isCheckNotEnoughTxsFee
            }
            onClick={handleConfirm}>
            {/* {t(`${renderStateButton.text}`)} */}
            {currentStep === StepType.From
              ? t('wrap_send.next')
              : t('wrap_send.review')}
          </Button>
        </div>
      )}
    </MainLayout>
  )
}

export default withI18nProvider(WrapSend)
