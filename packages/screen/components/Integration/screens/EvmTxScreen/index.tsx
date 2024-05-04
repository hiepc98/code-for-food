import { BoxContent, Button, EmptyData, Icon, Input, Slider, Touch, TypeInput } from '@wallet/ui'
import { base58, convertBalanceToWei, convertWeiToBalance, formatMoney, formatNumberBro } from '@wallet/utils'
import get from 'lodash/get'
import React, { type ChangeEvent, type FC, useState, useEffect } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'
import {  TransactionType, abiDecoder, preconfig } from '@wallet/evm'


import { useAppSelector } from 'store'
import { useIntegrationContext } from '../../context'
import ClosableContent from '../../../shared/ClosableContent'
import withI18nProvider from '../../../../provider'
import ViewData from './Components/ViewData'
import GasSlider from '../../../shared/GasSlider'
import pick from 'lodash/pick'
import { GasConfig, GasEstimator, GasRender, GasSliderInfo, IGasState } from './types'
import { useQuery } from '@tanstack/react-query'
import { CHAIN_DATA } from '@wallet/constants'
import { cloneDeep, lowerCase, upperCase } from 'lodash'
import { defaultEstimator } from './constants'
import { encryptService } from '../../../../services/encryption'
import { upperCaseAfterSpace } from '../../../../common/functions'
import ApproveSendTxDetail from './Components/ApproveSendTxDetail'
import { UNLIMIT_HEX } from '@wallet/evm/src/constants/config'
import LoadingCircle from '../../../shared/LoadingCircle'


const DEFAULT_GAS_STEP = {
  low: 0.8,
  standard: 1,
  fast: 1.2,
  fastest: 1.5,
  gaswar: 5
}

const initGasState ={
  gasStep: DEFAULT_GAS_STEP,
  gasLimit: 21000,
  gasPriceEst: 0,
  decimal: 9,
  gasFee: 0
}


const EvmTxScreen = (props: any) => {
  const { t } = useTranslation()
  const { state: LocationState } = useLocation<any>()
  const { renderRequest = {} } = LocationState || {}
  const { data: { transaction, networkInfo, transactionType, tokenData, messages } } = renderRequest // some dapp transmit messages instead of transaction
  const { data } = renderRequest


  const [activeWallet, activeNetwork, networks] = useAppSelector((state) => [
    state.wallet.activeWallet,
    state.setting.activeNetwork,
    state.setting.networks,
  ])
  const { request, onRejectRequest, onAcceptRequest } = useIntegrationContext()

  const numChainId = parseInt(networkInfo.chainId)
  const chainId = `0x${numChainId.toString(16)}`


  const currentChain : any = networks.find(item => item.chainId === chainId)
  const chainData = CHAIN_DATA[currentChain.chain]
  const chainSymbol = chainData.symbol || 'ETH'

  const txData = get(data, 'messages')
  const gas = get(txData, 'authInfo.fee.gasLimit', '250000')
  const priceStep = [0.01, 0.025, 0.03]
  const maxStepValue = Math.floor(100 / (priceStep.length - 1))
  const isMsgWithString = JSON.stringify(request).includes('isMsgString')
  const isEmptyData = !get(data, 'messages') && !get(data, 'options')

  const isApprove = transactionType === TransactionType.Approve || get(messages, 'primaryType') === 'Permit' // new method of vrc25

  

  const [stateGas, setStateGas] = useState<GasSliderInfo>(initGasState)

  const [isLoadingGas, setIsLoadingGas] = useState(true)
  const [isCustomGas, setIsCustomGas] = useState(false)
  const [isApproveUnlimited, setIsApproveUnlimited] = useState(false)
  const [approvedTxData, setApprovedTxData] = useState()

  const [mainToken, setMainToken] = useState()

  const [isFreeGas, setIsFreeGas] = useState(false)


  const { favIconUrl, title } = request?.sender?.tab || {
    favIconUrl:
      'https://coin98.s3.ap-southeast-1.amazonaws.com/Currency/sei.png',
    title: ' 1inch Network'
  }
  const { origin } = request?.sender || { origin: 'https://1inch.io/wallet' }

  const { data: queryFunctionName = '' } = useQuery({
    queryKey: [`queryFunctionName${transaction.data}`],
    queryFn: async () => {
      if (transaction.data !== '0x0') {
        const first4Bytes = Buffer.from(transaction.data.slice(2), 'hex').subarray(0, 4).toString('hex')
        return (await fetch(`https://raw.githubusercontent.com/ethereum-lists/4bytes/master/signatures/${first4Bytes}`)).text()
      }
    }
  })

  const decodedTransactionData: any['decodedTransactionData'] = useMemo(() => {
    if (!transaction.to) {
      return null
    }

    if (!transaction.data || transaction.data === '0x0') {
      return null
    }

    const data = abiDecoder.decode(transaction.data)

    return data
  }, [])

  useEffect(() => {
    handleEstimateGas()
    getMainBalance()
  }, [transaction])

  

  const [functionName, functionRender, subTitle] = useMemo(() => {
    // Generate title
    const isApproveForAll = transactionType === TransactionType.SetApproveForAll
    const isNFT = !!tokenData?.isNFT

    if (isApprove || isApproveForAll) {
      const findAmount = decodedTransactionData?.params.find(it => it.name === 'amount')?.value
      const isRevoke = findAmount && Number(findAmount) === 0
      if (isApproveForAll && !isNFT) {
        if (isRevoke) {
          return [t('revokeTokenRequest'), '', t('revokeTokenDesc')]
        }
        return [t('approveTokenRequest'), 'approveForAll', t('approveDesc')]
      }

      if (isNFT) {
        if (isRevoke) {
          return [t('revokeNFTRequest'), '', t('revokeNFTDesc')]
        }
        return [t('approveNFTRequest'), '', t('approveNFTDesc')]
      }

      return [t(!isRevoke ? 'approveTokenRequest' : 'revokeTokenRequest'), queryFunctionName, !isRevoke ? t('approveDesc') : t('revokeTokenDesc')]
    }
    switch (transactionType) {
      case TransactionType.Approve:
        return [t('approveTokenRequest'), preconfig[transactionType].render, t('approveDesc')]
      case TransactionType.Deploy:
        return [t('deployNewContract'), t('deployNewContract')]
      default:
        return [t('transactionConfirmation'), queryFunctionName.includes('404') || queryFunctionName.includes('400') ? undefined : queryFunctionName]
    }
  }, [queryFunctionName])


  const formatTransaction = (txs:any) => {
    
    const gasFromTransaction = pick(txs, ['gas', 'gasPrice', 'gasLimit', 'maxFeePerGas', 'maxPriorityFeePerGas'])
    const newTxs = cloneDeep(txs)
    
    if (parseInt(gasFromTransaction.gas) > parseInt(UNLIMIT_HEX) || (gasFromTransaction.gas && parseInt(gasFromTransaction.gas) < 21000)) {
      // const defaultGasLimit = 21000
      // gasFromTransaction.gas = `0x${defaultGasLimit.toString(16)}`
      delete newTxs.gas // delete to re-estimate gas
    }

    return newTxs
  }



  const handleEstimateGas = async () => {
    try{
      setIsLoadingGas(true)
      const wallet = encryptService.decryptWallet(activeWallet)
      const getEngine = window.walletServices.getChainEngine(get(currentChain, 'chain'))
      const formatTxs = formatTransaction(transaction)
      
      const response = await getEngine.estimateGas({
        rawTransaction:formatTxs,
        wallet: wallet,
        chain: get(currentChain, 'chain')
      })
      
      const { gasPrice, gasStep, decimal, isRaw } = response

      const gasPriceEst = gasStep.standard

      const gasLimit = isRaw ? convertBalanceToWei(gasPrice, decimal) : gasPrice

      const gasFee = gasLimit * gasPriceEst

      if(response){

        if(response.isGasFree){
          setIsLoadingGas(false)
          return setIsFreeGas(true)
        }

        setStateGas({
          gasStep,
          gasLimit,
          gasPriceEst,
          decimal,
          gasFee
        })
      }
      setIsLoadingGas(false)
   
    }catch(e){
      setIsLoadingGas(false)
    }
  }

  const getMainBalance = async () => {
    try{
      const tokens = await window.walletServices.tokens({
        address: activeWallet?.address,
        chain: activeNetwork?.chain
      })
      const mainToken = tokens.find((item: any) => !item.address)
      setMainToken(mainToken)
    }catch(e){
      return 0
    }
  }

 


  const onChangeGasState = (name: string, value: any | object) => {
    if (typeof value === 'object') {
      return setStateGas((prev) => ({ ...prev, ...value }))
    }
    setStateGas((prev) => ({ ...prev, [name]: value }))
  }

  const onChangeGas = (
    gasFee: number | undefined,
    gasPrice?: number | undefined
  ) => {
    onChangeGasState('gasFee', gasFee)
    onChangeGasState('gasPrice', gasPrice)
  }



  const onConfirm = () => {
    const decryptedWallet = encryptService.decryptWallet(activeWallet)
    const originalPrivateKey = decryptedWallet.privateKey.toString()

    const santizedPrivateKey = originalPrivateKey.startsWith('0x')
      ? originalPrivateKey.slice(2)
      : originalPrivateKey

    const numGas = Number(stateGas.gasLimit)
    
    const gasLimit = `0x${numGas.toString(16)}`

    let encodeTxData

    if(approvedTxData){
      const spenderData = get(approvedTxData, 'params', []).find(item => item.name === 'spender')
      const params = [get(spenderData, 'value'), UNLIMIT_HEX]
      encodeTxData = abiDecoder.encode('erc20', 'approve', ...params)
    }

    const options : any = {
      advance: {
        privateKeyBuffer: Buffer.from(santizedPrivateKey, 'hex'),
        wallet: decryptedWallet,
        data: txData,
      },
      gas: gasLimit
    }

    if(isFreeGas){
      delete options.gas
    }

    if(isApproveUnlimited){
      options.advance.txData = encodeTxData
    }
    
    onAcceptRequest(options)
  }
 


  const tabs = [
    {
      name: t('Data'),
      content: <ClosableContent data={JSON.stringify(transaction.data)} hideTitle={true} />
    }
  ]

  const onChangeApproveUnlimited = (value) => {
    setIsApproveUnlimited(value)

    if(value){
      const clonedTxData = cloneDeep(decodedTransactionData)
      const {params} = clonedTxData
      const findAmount = params.find(item => item?.name === 'amount')
      findAmount.value = Number(UNLIMIT_HEX)
      return setApprovedTxData(clonedTxData)
    }

    return setApprovedTxData(null)
  }


  const onViewData = () => {
    window.openModal({
      type: 'none',
      content: <ViewData tabs={tabs} className="h-full w-full mt-20" />,
      contentType: 'other',
      closable: true
    })
  }

  const renderTransactionDetail = () => {
    if(isApprove){
      return (
        <ApproveSendTxDetail 
          onChangeApproveUnlimited={onChangeApproveUnlimited}
          isApproveUnlimited={isApproveUnlimited}
          t={t} 
          approveData={decodedTransactionData} 
          token={tokenData} 
          transaction={transaction}
        />
      )
    }
    return (
      <div>
        <div className="text-[14px] text-ui03 mt-10 mb-3">
          {t('confirmation.transaction_details')}:
        </div>

        <div className="leading-6 text-base">
          <p className='text-ui04'> 
            {t('confirmation.verify_signature', {name: upperCaseAfterSpace(lowerCase(functionName))})}
          </p>
          <div className="text-primary cursor-pointer" onClick={onViewData}>
            {t('confirmation.view_data')}
          </div>
        </div>
      </div>
    )
  }

  const renderGas = () => {
    if(isLoadingGas){
      return <div className='mt-3 flex justify-center'><LoadingCircle /></div>
    }

    if(isFreeGas) return <p className="mt-3">{t('confirmation.free_gas')}</p>

    return (
      <BoxContent className="mt-3 p-0">
        <GasSlider
          chain={currentChain.chain}
          isCustomGas={isCustomGas}
          isLoading={isLoadingGas}
          gasStep={stateGas?.gasStep}
          gasDecimal={stateGas.decimal}
          onChange={onChangeGas}
          gasFee={stateGas?.gasFee}
          gasLimit={stateGas?.gasLimit}
          setIsCustomGas={setIsCustomGas}
          t={t}
        />
      </BoxContent>
    )
  }

  const transactionName = isApprove ? t('confirmation.token_request') : t('confirmation.sign_transaction')

  const isCheckNotEnoughTxsFee =
  Number(convertWeiToBalance(String(stateGas?.gasFee), stateGas.decimal)) >  Number(get(mainToken, 'balance', 0))

  return (
    <div className="bg-ui00 h-full w-full flex flex-col px-5 pb-5 text-ui04">
      <div className={`${!isApprove && 'mt-8'} flex flex-col overflow-auto`}>
        <div className="pt-5 text-h3 font-bold all-center capitalize text-center">
          <div className="max-w-[220px] truncate text-ui04">
            {transactionName}
          </div>
        </div>

        {
          isApprove && <p>{t('confirmation.token_request_description')}</p>
        }
     

        <div className="flex flex-col gap-2 pt-5">
          <div className="flex items-center bg-ui01 px-1 py-2">
            <div className="connector mr-3">
              <img
                src={favIconUrl ?? '/public/img/brand/logo.svg'}
                className="w-10 h-10 rounded-full"
                alt=""
              />
            </div>
            <div className="flex flex-col">
              <div className="leading-6 text-[14px] font-semibold text-ui04">{title}</div>
              <div className="text-tiny text-ui03">{origin}</div>
            </div>
          </div>
        </div>

        { renderTransactionDetail() }
       
        { renderGas() }

      </div>
      
    
      <div className='mt-auto'>
        {isCheckNotEnoughTxsFee && (
          <div className="text-center mb-4 text-tiny text-ui03">
            {t('wrap_send.not_enough_txs_fee', {
              unit: get(mainToken, 'symbol', 'vic')
            })}
          </div>
        )}
        <div className="flex justify-between items-center">
          <Button
            type="primary"
            outline
            className="flex-1 border-ui02 mr-4"
            onClick={onRejectRequest}>
            {t('transaction_screen.cancel')}
          </Button>
          
          <Button type="primary" className="flex-1" onClick={onConfirm} disabled={isCheckNotEnoughTxsFee}>
            {t('setting_screen.confirm')}
          </Button>
        </div>

      </div>
     
    </div>
  )
}

export default withI18nProvider(EvmTxScreen)
