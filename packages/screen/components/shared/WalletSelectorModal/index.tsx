import { Wallet } from '@wallet/core'
import { Icon } from '@wallet/ui'
import { get } from 'lodash'
import { type FC } from 'react'

import WalletItem from '../WalletItem'
import { useAppSelector } from 'store'

interface Props {
  currentWallet?: Wallet
  onChangeWallet?: (wallet: Wallet) => any
}

const WalletSelectorModal: FC<Props> = ({ currentWallet, onChangeWallet }) => {
  const wallets = useAppSelector((state) => state.wallet.wallets)

  const onSelectWallet = (wallet: Wallet) => () => {
    onChangeWallet && onChangeWallet(wallet)
    window.closeModal()
  }

  return (
    <div className="flex-1 h-full w-full mt-20 overflow-auto">
      {wallets.map((wallet) => {
        const isActive = get(wallet, 'address', '') === get(currentWallet, 'address', '')
        return (
          <WalletItem
            wallet={wallet}
            key={wallet.name}
            onClick={onSelectWallet(wallet)}
            rightView={isActive && <Icon name="check" />}
          />
        )
      })}
    </div>
  )
}

export default WalletSelectorModal
