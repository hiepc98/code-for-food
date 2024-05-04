export const defaultEstimator = {
  low: {
    suggestedMaxPriorityFeePerGas: '1',
    suggestedMaxFeePerGas: '1',
    minWaitTimeEstimate: 15000,
    maxWaitTimeEstimate: 30000
  },
  medium: {
    suggestedMaxPriorityFeePerGas: '1.5',
    suggestedMaxFeePerGas: '1.5',
    minWaitTimeEstimate: 15000,
    maxWaitTimeEstimate: 45000
  },
  high: {
    suggestedMaxPriorityFeePerGas: '2',
    suggestedMaxFeePerGas: '2',
    minWaitTimeEstimate: 15000,
    maxWaitTimeEstimate: 60000
  },
  estimatedBaseFee: '0.000012743',
  networkCongestion: 0.1,
  latestPriorityFeeRange: ['0.000000597', '3'],
  historicalPriorityFeeRange: ['0.000000001', '939.200000765'],
  historicalBaseFeeRange: ['0.000002433', '0.000013372'],
  priorityFeeTrend: 'down',
  baseFeeTrend: 'down'
}
