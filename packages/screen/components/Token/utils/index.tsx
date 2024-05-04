import dayjs from 'dayjs'
import { type HistoryFromScreen } from '../../../types'
import { convertBalanceToWei } from 'utils'
import { get } from 'lodash'


const getDateFormat = (data: any, chain: string, screen: number | string) => {
  switch (screen) {
    case 'tokenDetail': {
      // if (chain === CHAIN_TYPE.solana) return dayjs.unix(data.timestamp)
      return data.date || data.timestamp
    }

    case 'allHistory':
      const cv = Number(data.timestamp || data.timeStamp)
      return isNaN(cv) ? data.timestamp : dayjs.unix(cv)

    default:
      break
  }
}

export const mappingDataHistory = (
  data: any,
  chain: string,
  screen: HistoryFromScreen
) => {
  return data.map((item:any) => {
    // only case tomo
    const contractAddress = item.address || item.contractAddress

    const date = getDateFormat(item, chain, screen)

    const newDate = typeof date !== 'number' ? get(item, 'timestamp') : date
    const amount = item?.value ? get(item, 'value') : get(item, 'amount')
    
    const result = {
      ...item,
      contractAddress,
      date: newDate,
      chain,
      amount
    }

    return result
  })
}
