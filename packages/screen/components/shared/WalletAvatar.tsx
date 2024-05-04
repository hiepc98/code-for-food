import type { Wallet } from '@wallet/core'
import { cx } from '@wallet/utils'

import get from 'lodash/get'
import { getLength } from '../../utils'

type TypeWalletAvatar = {
  walletSelected: Wallet | null | any
  className?: string
}

const WalletAvatar = (props: TypeWalletAvatar) => {
  const { walletSelected, className } = props

  const walletAvatar =
    getLength(get(walletSelected, 'avatar')) === 0
      ? 'bg-ui02'
      : get(walletSelected, 'avatar')
  return (
    <div
      className={cx(
        `text-ui00 text-[24px] all-center ${walletAvatar} ${className}`
      )}></div>
  )
}

export default WalletAvatar
