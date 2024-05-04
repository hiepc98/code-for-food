import type { IGasStep, Wallet } from '@wallet/core'
import {
  type FC,
  type PropsWithChildren,
  createContext,
  useContext,
  useState
} from 'react'
import { useParams } from 'react-router-dom'
import { useAppSelector } from 'store'
import { TomoWallet } from 'store/types'

import { StepType } from '../types'

interface SendTokenContextInterface {
  errAddress: string
  toAddress: string
  isSendTxs: boolean
  chain: string
  currentStep: StepType
  gasFee: number
  gasPrice: number
  gasLimit?: number
  gasStep?: IGasStep
  gasDecimal?: number
  walletReceiver: Wallet | null
  setErrAddress?: (msg: string) => void
  setToAddress?: (msg: string) => void
  setIsSendTxs?: (data: boolean) => void
  setCurrentStep?: (step: StepType) => void
  setGasFee?: (value: number) => void
  setGasLimit?: (value: number) => void
  setGasPrice?: (value: number) => void
  setGasStep?: (value: any) => void
  setGasDecimal?: (value: any) => void
  setValueRangeSlider?: (value: number) => void
  setWalletReceiver?: (wallet: Wallet) => void
  getWalletByAddress?: (address: string) => Wallet
}

const defaultValues: SendTokenContextInterface = {
  chain: '',
  errAddress: '',
  toAddress: '',
  isSendTxs: false,
  currentStep: StepType.To,
  gasFee: 0,
  gasPrice: 0,
  gasDecimal: 18,
  gasStep: {},
  walletReceiver: null
}

export const SendNftContext = createContext(defaultValues)

export const SendNftProvider: FC<PropsWithChildren> = ({ children }) => {
  const [listWallets] = useAppSelector((state) => [
    state.wallet.wallets
  ])
  const { address, chain } = useParams<{ address: string; chain: string }>()
  const [currentStep, setCurrentStep] = useState(StepType.To)
  const [errAddress, setErrAddress] = useState('')
  const [toAddress, setToAddress] = useState('')
  const [isSendTxs, setIsSendTxs] = useState(false)

  const [gasFee, setGasFee] = useState(0)
  const [gasPrice, setGasPrice] = useState(0)
  const [gasLimit, setGasLimit] = useState(0)
  const [gasStep, setGasStep] = useState({})
  const [gasDecimal, setGasDecimal] = useState(18)

  const [walletReceiver, setWalletReceiver] = useState(null)

  const getWalletByAddress = (address: string) => {
    return listWallets.find((item) => item.address === address) as TomoWallet
  }

  return (
    // eslint-disable-next-line react/react-in-jsx-scope
    <SendNftContext.Provider
      value={{
        errAddress,
        currentStep,
        toAddress,
        isSendTxs,
        chain,
        gasFee,
        gasPrice,
        gasStep,
        gasLimit,
        gasDecimal,
        walletReceiver,
        setCurrentStep,
        setErrAddress,
        setToAddress,
        setGasFee,
        setGasPrice,
        setGasStep,
        setGasLimit,
        setGasDecimal,
        setIsSendTxs,
        setWalletReceiver,
        getWalletByAddress
      }}>
      {children}
    </SendNftContext.Provider>
  )
}

export const useSendNftContext = () => {
  return useContext(SendNftContext)
}
