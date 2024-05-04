export const HISTORY_TYPE = {
  SEND: 'send',
  RECEIVE: 'receive',
  SELF: 'self',
  APPROVE: 'approve',
  SWAP: 'swap',
  MULTICALL: 'multicall',
  EXECUTE_CONTRACT: 'execute',
  VOTE: 'vote',
  UNVOTE: 'unvote',
  WITHDRAW: 'withdraw'
}

export const historyVariant = {
  [HISTORY_TYPE.SEND]: {
    text: 'send_nft_success.send',
    icon: 'arrow_up',
    className: 'text-red'
  },
  [HISTORY_TYPE.RECEIVE]: {
    text: 'history_item.receive',
    icon: 'arrow_down',
    className: 'text-green'
  },
  [HISTORY_TYPE.SELF]: {
    text: 'history_item.self',
    icon: 'refresh',
    className: 'text-green'
  }
}

// export const historyVariant = {
//   [HISTORY_TYPE.SEND]: {
//     text: ('send_nft_success.send'),
//     icon: 'arrow_up',
//     className: 'text-red'
//   },
//   [HISTORY_TYPE.RECEIVE]: {
//     text: ('history_item.receive'),
//     icon: 'arrow_down',
//     className: 'text-green'
//   },
//   [HISTORY_TYPE.SELF]: {
//     text: ('history_item.self'),
//     icon: 'refresh',
//     className: 'text-green'
//   },
//   [HISTORY_TYPE.APPROVE]: {
//     text: ('history_item.approve'),
//     icon: 'smart_contract',
//     className: 'text-primary'
//   },
//   [HISTORY_TYPE.SWAP]: {
//     text: ('history_item.swap'),
//     icon: 'menu_swap',
//     className: 'text-primary'
//   },
//   [HISTORY_TYPE.VOTE]: {
//     text: ('history_item.vote'),
//     icon: 'add',
//     className: 'text-primary'
//   },
//   [HISTORY_TYPE.UNVOTE]: {
//     text: ('history_item.unvote'),
//     icon: 'minus',
//     className: 'text-primary'
//   },
//   [HISTORY_TYPE.WITHDRAW]: {
//     text: ('history_item.withdraw'),
//     icon: 'chevron_down',
//     className: 'text-primary'
//   }

// }

export const DEFAULT_TEXT = {
  text: 'history_item.execute',
  icon: 'smart_contract',
  className: 'text-primary'
}

export const ADDRESS_ZERO = '0x'

export type HistoryType = 'send' | 'receive' | 'self'
