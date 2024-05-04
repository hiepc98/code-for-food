import bigDecimal from 'js-big-decimal'
import get from 'lodash/get'
import numeral from 'numbro'
import { extendTailwindMerge } from 'tailwind-merge'
import clsx, { ClassValue } from 'clsx'
import { CHAIN_DATA } from '@wallet/constants'

export const viewScan = (
  hash: string,
  isReturnScan?: boolean
): string | Window | null => {
  const url = `${CHAIN_DATA.sei.scan}/transaction/${hash}`
  if (isReturnScan) {
    return url
  }
  return window.open(url)
}

export const convertBalanceToWei = (
  strValue: string,
  iDecimal: string | number = 18,
  options?: {
    isFormat?: boolean
  }
) => {
  strValue = '' + strValue

  if (Number(strValue) === 0) return 0

  try {
    const multiplyNum = new bigDecimal(Math.pow(10, iDecimal))
    const convertValue = new bigDecimal(String(strValue))
    const result = multiplyNum.multiply(convertValue)
    if (options?.isFormat) {
      return formatMoney(result.getValue()) as any
    }

    return result.getValue() as any
  } catch (error) {
    return 0
  }
}

export const formatNumberBro = (
  number: string | number,
  mantissa?: number = 4,
  isReturnNaN?: boolean,
  textNa?: string,
  trimMantissa?: boolean = true
) => {
  if (
    number !== false &&
    number !== 'null' &&
    !(number === null) &&
    !isNaN(number) &&
    !(number === undefined) &&
    number !== 'NaN' &&
    number !== Infinity
  ) {
    if (number.toString().length > 0) {
      return numeral(number.toString().replace(/,/g, '')).format({
        trimMantissa,
        thousandSeparated: true,
        mantissa,
        roundingFunction: Math.floor
      })
    }
  }
  return isReturnNaN ? textNa || 'N/A' : 0
}

export const formatMoney = (price = '', decimals = 2): string => {
  let mantissa = decimals
  const strPrice = price.toString()

  const beforeDot = strPrice.split('.')[0]
  const afterDot = strPrice.split('.')[1]
    ? strPrice.split('.')[1].split('')
    : null
  const fBefore = beforeDot?.length
  if (fBefore > 1 && fBefore < 3) {
    mantissa = 2
  }

  if (fBefore <= 1) {
    mantissa = 4

    const countZero = afterDot
      ? afterDot.filter((it) => it.toString() === '0')?.length
      : 0
    if (afterDot && countZero > 2) {
      mantissa = 6
    }
  }

  return formatNumberBro(price, mantissa)
}

export const convertWeiToBalance = (
  strValue: string,
  iDecimal: string | number = 18,
  options?: {
    isFormat?: boolean
  }
) => {
  strValue = '' + strValue

  if (Number(strValue) === 0) return 0

  try {
    const decimalFormat = parseFloat(iDecimal.toString())
    const multiplyNum = new bigDecimal(Math.pow(10, decimalFormat))
    const convertValue = new bigDecimal(String(strValue))
    const result = convertValue.divide(multiplyNum, decimalFormat)
    const res = result.round(iDecimal, bigDecimal.RoundingModes.DOWN)

    if (options?.isFormat) {
      return formatMoney(res.getValue())
    }

    return res.getValue() as any
  } catch (error) {
    return 0
  }
}

export const formatTransferData = (params: any) => {
  const { amount, from, memo, options, to, token, gasFee } = params

  const tokenDecimal = Number(get(token, 'decimal', 9))

  let lastAmount = amount

  const totalFee = Number(amount) + Number(gasFee)
  const balanceFee = Number(convertWeiToBalance(token.rawBalance, tokenDecimal))

  if (
    balanceFee < totalFee &&
    !get(params, 'token.address') // temp for now
  ) {
    lastAmount = Number(amount) - Number(gasFee)
  }

  const formatAmount = formatNumberBro(lastAmount, 10)

  const newParams = {
    asset: get(params, 'token.denom'),
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

export const getLength = (str: any) => {
  if (!str) return 0
  if (typeof str === 'object' && !Array.isArray(str)) {
    return Object.keys(str).length
  }
  return str.length || 0
}

export const upperCase = (value: string) => {
  return value ? value.toUpperCase() : value
}

export const truncate = (
  original: string,
  options?: {
    length?: number
    separator?: string
  }
) => {
  const { length = 5, separator = '...' } = options || {}

  const strLength = original.length

  if (strLength < length) {
    return original
  }

  const firstCountLetter = original.slice(0, length)
  const lastCountLetter = original.slice(strLength - length, strLength)

  return `${firstCountLetter}${
    typeof separator === 'string' ? separator : '...'
  }${lastCountLetter}`
}

const twMerge1 = extendTailwindMerge({
  classGroups: {
    'font-size': [
      {
        text: [
          (value: string) => {
            const keys = ['pix', 'body', 'display', 'title', 'button']
            const isMatched = keys.some((it) => value.includes(it))
            return isMatched
          }
        ]
      }
    ]
  }
})

export const sortedObject = (obj: any): number | string | null | object => {
  if (typeof obj !== "object" || obj === null) {
      return obj;
  }
  if (Array.isArray(obj)) {
      return obj.map(sortedObject);
  }
  const sortedKeys = Object.keys(obj).sort();
  const result : any = {};
  // NOTE: Use forEach instead of reduce for performance with large objects eg Wasm code
  sortedKeys.forEach((key) => {
      result[key] = sortedObject(obj[key]);
  });
  return result;
}

export const cx = (...classes: ClassValue[]) => twMerge1(clsx(...classes))
