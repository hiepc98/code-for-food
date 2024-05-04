import type { Wallet } from '@wallet/core'
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
import { useTranslation } from 'react-i18next'

import { truncateText, lowerCase } from '../../../common/functions'
// import {
//   DECIMALS_TOKEN_DISPLAY,
//   GAS_DECIMAL_SEI,
//   HISTORY_TYPE,
//   type HistoryType,
//   MAX_LENGTH_BALANCE_DISPLAY
// } from '~constants/misc'
import HistoryDetails from './HistoryDetails'
import type { HistoryItem } from '../../Wallet/HistoryScreen/services'
import {
  DECIMALS_TOKEN_DISPLAY,
  MAX_LENGTH_BALANCE_DISPLAY
} from '../../../constants'
import { useAppSelector } from 'store'
import {
  HistoryType,
  HISTORY_TYPE,
} from '../../Wallet/HistoryScreen/utils/constants'

type HistoryVariantItem = {
  text: string
  icon: string
  className: string
}
type HistoryVariant = {
  send: HistoryVariantItem
  receive: HistoryVariantItem
  self: HistoryVariantItem
}

interface IProps {
  type: Partial<HistoryType>
  history: HistoryItem
  currentWallet?: Wallet
  chain?: string
  fromScreen?: 'tokenDetail' | 'allHistory'
  listToken?: any[]
  tokenDetail?: any
}

const HistoryItemComponent = (props: IProps) => {
  const { t } = useTranslation()

  const { type, history, currentWallet, listToken, tokenDetail } = props

  const [tokens] = useAppSelector((state) => {
    return [state.wallet.tokens]
  })

  // const { tokens } = useManageToken()

  const getTokenMain = () => {
    return tokens.find((item) => !item.address)
  }

  // @ts-ignore
  const historyVariant: HistoryVariant = {
    [HISTORY_TYPE.SEND]: {
      text: t('send_nft_success.send'),
      icon: 'arrow_up',
      className: 'text-red'
    },
    [HISTORY_TYPE.RECEIVE]: {
      text: t('history_item.receive'),
      icon: 'arrow_down',
      className: 'text-green'
    },
    [HISTORY_TYPE.SELF]: {
      text: t('history_detail.self'),
      icon: 'refresh',
      className: 'text-green'
    }
  }

  const { text, icon, className } = historyVariant[type]

  const openModalDetail = (history: HistoryItem) => {
    window.openModal({
      type: 'none',
      content: (
        <HistoryDetails
          currentWallet={currentWallet}
          history={history}
          tokenInfo={tokenDetail}
          t={t}
          amount={renderAmount()}
        />
      ),
      contentType: 'other',
      closable: true
    })
  }

  const renderMainToken = () => {
    return getTokenMain() || {}
  }

  const tokenInfo = useMemo(() => {
    const chain = get(history, 'chain', '')
    const allToken = listToken || tokens

    const token = allToken.find((token) => {
      const address =
        get(tokenDetail, 'address') ||
        get(history, 'contractAddress', '') ||
        get(history, 'contract.address', '')

      if (!address) {
        return token.chain === chain && !token.address
      }
      return token.address?.toLowerCase() === address.toLowerCase()
    })

    const finalData = { ...token, ...history }

    return finalData
  }, [tokenDetail, listToken])

  const prefix = type !== HISTORY_TYPE.SEND ? '+' : '-'

  const renderAmount = () => {
    const chain = get(history, 'chain', 'tomo')
    const mainToken = getTokenMain()


    const tokenAmount = get(history, 'amount', '0')
    const decimal = get(tokenDetail, 'decimal', 18)
    const isDecimal = Number(decimal)
    const formatNumberMantissa = 4

    const amount = formatNumberBro(
      convertWeiToBalance(tokenAmount as string, isDecimal),
      formatNumberMantissa
    )

    return truncateText(amount as string, MAX_LENGTH_BALANCE_DISPLAY / 2)
  }

  return (
    <div
      onClick={() => openModalDetail(history)}
      className="grid grid-cols-2 gap-2 text-tiny border-b border-ui01 pr-4 last:border-b-0 pt-4 pb-4 cursor-pointer hover:bg-ui01">
      <div className="flex items-center">
        <div className="avatar mr-3 relative pl-1">
          <div className="w-10 h-10 flex items-center justify-center bg-ui01">
            <Icon
              className="font-semibold text-ui04"
              name={icon}
              style={{ fontSize: '20px' }}
            />
          </div>
          {listToken && listToken.length > 1 && (
            <Image
              src={get(
                tokenInfo,
                'image',
                '/public/img/icons/default-token.svg'
              )}
              className="w-5 h-5 absolute rounded-full"
              style={{ top: '-4px', left: '-4px' }}
            />
          )}
        </div>
        <div>
          <div className="flex items-center text-ui04">
            <p className="font-semibold">{text}</p>
            <span className="p-1 text-ui03">
              {type === HISTORY_TYPE.SEND
                ? truncate(get(history, 'to', ''))
                : truncate(get(history, 'from', ''))}
            </span>
          </div>
          <div className="text-ui03">
            {dayjs((get(history, 'date', 0) as number) * 1000).format(
              'HH:mm DD/MM/YYYY'
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col items-end justify-center">
        <p className={className}>
          {prefix}
          {renderAmount()}
        </p>
        <span className="text-ui03 uppercase">
          {get(tokenDetail, 'symbol', 'TOMO')}
        </span>
      </div>
    </div>
  )
}

export default HistoryItemComponent
