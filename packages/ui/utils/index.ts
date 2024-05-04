import {
  convertWeiToBalance,
  formatNumberBro
} from '@wallet/utils'

import get from 'lodash/get'

export const formatTransferData = (params: any) => {
  const { amount, from, memo, options, to, token, gasFee } = params

  const tokenDecimal = Number(get(token, 'decimal', 9))

  let lastAmount = amount

  const totalFee = Number(amount) + Number(gasFee)
  const balanceFee = Number(
    convertWeiToBalance(token.rawBalance, tokenDecimal)
  )

  if (
    balanceFee < totalFee &&
    !get(params, 'token.address') // temp for now
  ) {
    lastAmount = Number(amount) - Number(gasFee)
  }

  const formatAmount = formatNumberBro(lastAmount, 10)

  const newParams = {
    asset: get(params, 'token.chain'),
    amount: Number(formatAmount) || lastAmount,
    from,
    memo,
    options,
    to,
    token
  }

  if (!get(params, 'token.address')) {
    delete newParams.token
  }
  return newParams
}

export const truncateText = (original: string, length: number = 5) => {
  if (!length) return original
  return original.length > length
    ? original.substring(0, length) + '...'
    : original
}
