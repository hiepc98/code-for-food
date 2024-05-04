import { ReactElement, ReactNode } from 'react'

export interface GasConfig {
  gasPrice?: string
  gasLimit?: string
  maxFeePerGas?: string
  maxPriorityFeePerGas?: string
}

export interface IGasState {
  isViewData: boolean
  isGasConfig: boolean
  isAdvance: boolean
  isGasModified: boolean

  gas: GasConfig
  gasConfig: GasConfig
  gasIndex: number
}

export interface GasRender {
  value: string | number
  symbol: string
  render: ReactNode | ReactElement
  fiatValue: string
}

export interface StepPriority {
  suggestedMaxPriorityFeePerGas: string
  suggestedMaxFeePerGas: string
  minWaitTimeEstimate: number
  maxWaitTimeEstimate: number
}

export interface GasEstimator {
  low: StepPriority
  medium: StepPriority
  high: StepPriority
  estimatedBaseFee: string
  networkCongestion: number
  latestPriorityFeeRange: [string, string]
  historicalPriorityFeeRange: [string, string]
  historicalBaseFeeRange: [string, string]
  priorityFeeTrend: 'down' | 'up'
  baseFeeTrend: 'down' | 'up'
}

export interface GasSliderInfo {
  gasPrice?: string
  suggestedMaxFeePerGas?: string
  suggestedMaxPriorityFeePerGas?: string
  gasStep?: any,
  gasLimit: any
  gasPriceEst:any
  decimal: number
  gasFee: any
}

export interface QueryInterface {
  queryFunctionName: string
  gasEstimator: GasEstimator
}
