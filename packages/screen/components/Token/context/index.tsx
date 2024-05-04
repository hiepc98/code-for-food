/* eslint-disable no-use-before-define */
import type { IGasStep, Token, Wallet, Engine } from '@wallet/core'
import React, {
  type FC,
  type PropsWithChildren,
  createContext,
  useContext,
  useState,
  useMemo,
  useRef
} from 'react'

import { ADDRESS_ZERO } from '../../../constants'

import { StepType, RecentAddressState } from '../../../types'
import { useLocation, useParams } from 'react-router-dom'
import { useAppSelector } from 'store'
import useReceiveAddress from '../../../hooks/useReceiveAddress'
import get from 'lodash/get'
import { useTranslation } from 'react-i18next'

interface SendTokenContextInterface {
  tokenAddress?: string
  chain?: string
  amount: string
  currentStep: StepType
  currentWallet?: Wallet
  errAddress: string
  fromScreen?: string
  gasDecimal?: number
  gasFee: number
  gasLimit?: number
  gasPrice: number
  gasStep?: IGasStep
  history?: any
  isSendTxs: boolean
  isTokenHasBalance?: boolean
  listTokenSend: Token[]
  memo: string
  toAddress: string
  tokenSelected: Token | null
  walletReceiver: Wallet | null
  wallets: Wallet[]
  walletSelected: Wallet | null
  service?: Engine
  encryptService?: any
  isExpand?: boolean
  mainToken: Token | null
  recentContactList?: any[]
  isGasFree: boolean
  rawAmount: string
  isSendMaxOption: boolean
  setSendMaxOption: (value: boolean) => void
  setRawAmount: (rawAmount: string) => void
  fetchTokenInfo?: (tokens: Token[]) => void
  setAmount?: (amount: string) => void
  setToAddress?: (address: string) => void
  setCurrentStep?: (step: StepType) => void
  setMemo?: (memo: string) => void
  setIsSendTxs?: (sendTxs: boolean) => void
  setErrAddress?: (message: string) => void
  setWallets?: (wallets: Wallet[]) => void
  setWalletSelected?: (wallet: Wallet) => void
  setWalletReceiver?: (wallet: Wallet) => void
  setListTokenSend?: (tokens: Token[]) => void
  setGasFee?: (value: number) => void
  setGasLimit?: (value: number) => void
  setGasPrice?: (value: number) => void
  setGasStep?: (value: any) => void
  setGasDecimal?: (value: any) => void
  setTokenSelected?: (token: Token) => void
  setIsTokenHasBalance?: (isHasBalance: boolean) => void
  getMainBalance?: () => Promise<Token>
  getTokens?: () => Promise<Token[]>
  addRecentContact?: (data: RecentAddressState) => void
  getRecentContactList: (wallet: Wallet) => any
  onInitalContactList?: () => void
  onRemoveContact?: (address: string) => void
  onChangeAddressSendTo?: (event: any) => void
  handleSelectRecentAddress?: (address: string) => () => void
  onChangeMemo?: (event: any) => void
  getWalletByAddress?: (address: string) => Wallet
  onChangeWalletSelected?: (wallet: Wallet) => void
  setIsGasFree: (val: boolean) => void
}

interface SendTokenProviderProps {
  encryptService?: any
  // tokenAddress?: string
  // fromScreen?: string
  // activeWallet: Wallet
  // wallets: Wallet[]
  // customTokens?: Token[]
  // addRecentContact: (data: RecentAddressState) => void
  // getRecentContactList: (wallet: Wallet) => any
  // isExpand?: boolean
  // mainToken?: Token | null
}

interface LocationState {
  fromScreen?: string
  wallet?: Wallet
  tokenInfo?: Token
}

const defaultValues: SendTokenContextInterface = {
  currentStep: StepType.From,
  tokenAddress: ADDRESS_ZERO,
  tokenSelected: null,
  amount: '',
  toAddress: '',
  memo: '',
  isSendTxs: false,
  errAddress: '',
  wallets: [],
  walletSelected: null,
  walletReceiver: null,
  listTokenSend: [],
  gasFee: 0,
  gasPrice: 0,
  gasDecimal: 18,
  gasStep: {},
  isExpand: false,
  mainToken: null,
  isGasFree: false,
  rawAmount: '',
  isSendMaxOption: false,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  addRecentContact: () => {},
  getRecentContactList: () => {},
  setIsGasFree: (val: boolean) => {},
  setSendMaxOption: () => {},
  setRawAmount: () => {}
}

export const SendTokenContext = createContext(defaultValues)

export const SendTokenProvider: FC<PropsWithChildren<SendTokenProviderProps>> =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ({
    // activeWallet,
    // tokenAddress,
    // fromScreen,
    // isExpand,
    // wallets: walletsProps,
    // addRecentContact,
    // getRecentContactList,
    encryptService,
    children
  }) => {
    const { t } = useTranslation()

    const { address } = useParams<{ address: string }>()

    const { removeRecentContact, getRecentContactList } = useReceiveAddress()

    const [activeWallet, activeNetwork, listWallets] = useAppSelector(
      (state) => [
        state.wallet.activeWallet!,
        state.setting.activeNetwork,
        state.wallet.wallets
      ]
    )

    const { meta } = activeWallet
    const chain = meta?.chain || 'ether'
    const [currentStep, setCurrentStep] = useState(StepType.From)
    const [tokenSelected, setTokenSelected] = useState<Token | null>(null)
    const [amount, setAmount] = useState('')
    const [rawAmount, setRawAmount] = useState('')
    const [toAddress, setToAddress] = useState('')
    const [memo, setMemo] = useState('')
    const [isSendTxs, setIsSendTxs] = useState(false)
    const [errAddress, setErrAddress] = useState('')
    const [walletSelected, setWalletSelected] = useState(activeWallet)
    const [wallets, setWallets] = useState<Wallet[]>(listWallets)
    const [walletReceiver, setWalletReceiver] = useState<Wallet | null>(null)
    const [listTokenSend, setListTokenSend] = useState<Token[]>([])
    const [isTokenHasBalance, setIsTokenHasBalance] = useState(true)
    const [mainToken, setMainToken] = useState<Token | null>(null)
    const [recentContactList, setRecentContactList] = useState<any[]>([])

    const [gasFee, setGasFee] = useState(0)
    const [gasPrice, setGasPrice] = useState(0)
    const [gasLimit, setGasLimit] = useState(0)
    const [gasStep, setGasStep] = useState({})
    const [gasDecimal, setGasDecimal] = useState(18)
    const [isGasFree, setIsGasFree] = useState(false)

    const isSendMaxOption = useRef<boolean>(false)
    const setSendMaxOption = (value: boolean) => {
      isSendMaxOption.current = value
    }

    const service = useMemo(() => {
      return window.walletServices.engines[0]
    }, [window.walletServices])

    const { state = {} as LocationState } = useLocation<LocationState>()
    const fromScreen = get(state, 'fromScreen')

    const fetchTokenInfo = (tokens: Token[]) => {
      setListTokenSend(tokens)
      if (address === ADDRESS_ZERO || !address) {
        const mainToken = tokens.find((item: Token) => !item.address) as Token
        return setTokenSelected(mainToken)
      }
      const tokenInfo = tokens.find(
        (item: Token) => item.address === decodeURIComponent(address)
      ) as Token
      setTokenSelected(tokenInfo)
    }

    const getMainBalance = async () => {
      const tokens = await service.tokens({
        address: walletSelected?.address,
        chain
      })
      const mainToken = tokens.find((item: Token) => !item.address) as Token
      setMainToken(mainToken)
      return mainToken
    }

    const getTokens = async () => {
      const tokens = await service.tokens({
        address: walletSelected?.address,
        chain
      })
      return tokens
    }

    const onChangeWalletSelected = (wallet: Wallet) => {
      setWalletSelected(wallet)
      const contactList = getRecentContactList(wallet)
      setRecentContactList(contactList)
    }

    const onInitalContactList = () => {
      const contactList = getRecentContactList(walletSelected)
      setRecentContactList(contactList)
    }

    const onRemoveContact = (address: string) => {
      removeRecentContact(address)
    }

    const onChangeMemo = (event: any) => {
      setMemo?.(event.target.value)
    }

    const onChangeAddressSendTo = (event: any) => {
      const { value } = event.target
      const isValidAddress = service?.validateAddress({
        address: value,
        chain
      })

      if (value === '') {
        setErrAddress?.('')
        setToAddress?.('')
        return
      }

      if (isValidAddress) {
        setErrAddress?.('')
      } else {
        setErrAddress?.(t('send_to_nft.invalid_address'))
      }
      setToAddress?.(value)
    }

    const getWalletByAddress = (address: string) => {
      return wallets.find((item) => item.address === address) as Wallet
    }

    const handleSelectRecentAddress = (address: string) => () => {
      setToAddress?.(address)
      setErrAddress?.('')
    }

    return (
      <SendTokenContext.Provider
        value={{
          // tokenAddress,
          amount,
          chain,
          currentStep,
          encryptService,
          errAddress,
          fromScreen,
          gasDecimal,
          gasFee,
          gasLimit,
          gasPrice,
          gasStep,
          isGasFree,
          // isExpand,
          isSendTxs,
          isTokenHasBalance,
          listTokenSend,
          mainToken,
          memo,
          recentContactList,
          service,
          toAddress,
          tokenSelected,
          walletReceiver,
          wallets,
          walletSelected,
          rawAmount,
          isSendMaxOption: isSendMaxOption.current,
          setSendMaxOption,
          setRawAmount,
          fetchTokenInfo,
          getMainBalance,
          getTokens,
          getWalletByAddress,
          setAmount,
          setCurrentStep,
          setErrAddress,
          setGasDecimal,
          setGasFee,
          setGasLimit,
          setGasPrice,
          setGasStep,
          setIsSendTxs,
          setIsTokenHasBalance,
          setListTokenSend,
          setMemo,
          setToAddress,
          setTokenSelected,
          setWalletReceiver,
          setWallets,
          onChangeWalletSelected,
          getRecentContactList,
          onInitalContactList,
          onRemoveContact,
          onChangeAddressSendTo,
          handleSelectRecentAddress,
          onChangeMemo,
          setIsGasFree
        }}>
        {children}
      </SendTokenContext.Provider>
    )
  }

export const useSendTokenContext = () => {
  return useContext(SendTokenContext)
}
