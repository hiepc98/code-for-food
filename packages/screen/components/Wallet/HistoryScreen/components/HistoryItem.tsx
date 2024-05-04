import { type Wallet } from '@wallet/core'
import { Icon, Image } from '@wallet/ui'
import {
  convertBalanceToWei,
  convertWeiToBalance,
  formatNumberBro,
  truncate
} from '@wallet/utils'
import dayjs from 'dayjs'
import get from 'lodash/get'
import { useMemo } from 'react'
import { lowerCase } from '../../../../common/functions'

import { truncateText } from '../../../../utils'
import {
  ADDRESS_ZERO,
  DECIMALS_TOKEN_DISPLAY,
  MAX_LENGTH_BALANCE_DISPLAY
} from '../../../../constants'
import HistoryDetails from './HistoryDetails'
import { DEFAULT_TEXT, HISTORY_TYPE, HistoryType, historyVariant } from '../utils/constants'
import { HistoryItem } from '../services'
import useManageToken from '../../../../hooks/useManageToken'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'store'
import { CHAIN_TYPE } from '@wallet/constants'
import { UNLIMIT_HEX } from '@wallet/evm/src/constants/config'
import {formatTimeStamp} from '../utils/helper'

interface IProps {
  type: string
  history: HistoryItem
  currentWallet?: Wallet
  chain?: string
  fromScreen?: 'tokenDetail' | 'allHistory'
  listToken?: any[]
  tokenDetail?: any,
}

const HistoryItemComponent = (props: IProps) => {
  const { t } = useTranslation()
  const { type, history, currentWallet, listToken, tokenDetail } = props

  const { tokens } = useManageToken()
  const mainToken = listToken?.find((item : any) => !item.address)

  const { text, icon, className } = get(historyVariant, `${type}`) || DEFAULT_TEXT

  const openModalDetail = (history: HistoryItem) => {
    window.openModal({
      type: 'none',
      content: (
        <HistoryDetails
          type={type}
          currentWallet={currentWallet}
          history={history}
          t={t}
          tokenInfo={tokenInfo}
          amount={renderAmount()}
        />
      ),
      contentType: 'other',
      closable: true
    })
  }
  const tokenInfo = useMemo(() => {
    const allToken = listToken || tokens
    const address =
        get(tokenDetail, 'address') ||
        get(history, 'address') ||
        get(history, 'contractAddress', '') ||
        get(history, 'contract.address', '')

    if(!address) return mainToken
    const token = listToken?.find((token: any) => {
      return token.address?.toLowerCase() === address?.toLowerCase()
    })
    const finalData = { ...token, ...history }

    return finalData
  }, [tokenDetail, listToken])

  const prefix = type === HISTORY_TYPE.SEND
    ? '-'
    :  type === HISTORY_TYPE.RECEIVE ? '+' : ''
  const renderAmount = () => {
    const chain = get(history, 'chain')

    const tokenAmount = get(history, 'amount')
    const decimal = get(history, 'tokenDecimal') || get(tokenInfo, 'decimal')

    // const getRawValue = convertBalanceToWei(String(tokenAmount), decimal)

    const value =
      chain === CHAIN_TYPE.sei
        ? get(history, 'amount', '')
        : get(history, 'value', '') || tokenAmount

    const isDecimal = Number(decimal)
    const formatNumberMantissa = DECIMALS_TOKEN_DISPLAY[get(mainToken, 'symbol', '')] || 4

    const amount = formatNumberBro(
      convertWeiToBalance(value as string, isDecimal),
      formatNumberMantissa
    )
    if(Number(value) >= Number(UNLIMIT_HEX)) return 'UNLIMITED'

    return truncateText(amount as string, MAX_LENGTH_BALANCE_DISPLAY / 2)
  }

  // let historyByToken = history as any
  // const checkExistInTokens = tokens.find(it => lowerCase(get(it, 'address', ADDRESS_ZERO)) === lowerCase(get(history, 'address', ADDRESS_ZERO)))
  // if (!checkExistInTokens) return
  // if (get(history, 'address')) {
  //   const tokenHistoty = tokens.find(it => (it.address && lowerCase(it.address)) === lowerCase(get(history, 'address', '')))
  //   historyByToken = tokenHistoty && { ...history, tokenSymbol: get(tokenHistoty, 'symbol', '') }
  // }
  // if (!historyByToken) return
  // const symbol = get(historyByToken, 'tokenSymbol', 'TOMO')

  return (
    <div
      onClick={() => openModalDetail(history)}
      className="grid grid-cols-2 gap-2 text-tiny border-b border-ui01 px-4 last:border-b-0 pt-4 pb-4 cursor-pointer hover:bg-ui01">
      <div className="flex items-center">
        <div className="avatar mr-3 relative pl-1">
          <div className="w-8 h-8 flex items-center justify-center bg-ui01">
            <Icon
              className="font-semibold text-ui04"
              name={icon}
              style={{ fontSize: '20px' }}
            />
          </div>
          {/* <Image
            src={get(tokenInfo, 'image', '/public/img/icons/default-token.svg')}
            className="w-5 h-5 absolute rounded-full"
            style={{ top: '-4px', left: '-4px' }}
          /> */}
        </div>
        <div>
          <div className="flex items-center text-ui04">
            <p className="text-h6">{t(text)}</p>
            <span className="p-1 text-ui03 text-body-14-regular">
              {type === HISTORY_TYPE.SEND
                ? truncate(get(history, 'to', ''))
                : truncate(get(history, 'from', ''))}
            </span>
          </div>
          <div className="text-ui03 text-body-14-regular">
            {formatTimeStamp(get(history, 'timestamp', 0) as number)}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end justify-around">
        <p className={className}>
          {prefix}
          {renderAmount()}
        </p>
        <div className='flex items-center gap-1'>
          <Image
            src={get(tokenInfo, 'image', '/public/img/icons/default-token.svg')}
            className="w-4 h-4 rounded-full"
          />
        <span className="text-ui03 text-body-14-regular uppercase">{get(tokenInfo, 'symbol')}</span>
        </div>
      </div>
    </div>
  )
}

export default HistoryItemComponent
