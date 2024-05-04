import { Icon } from '@wallet/ui'
import { cx, truncate } from '@wallet/utils'
import get from 'lodash/get'
import WalletAvatar from '../../shared/WalletAvatar'

import type { Wallet } from '@wallet/core'
import { onActiveWallet, useAppDispatch } from 'store'
import useClipboard from '../../../hooks/useClipboard'
import { useTranslation } from 'react-i18next'

interface IProps {
  walletSelected: Wallet | null
  typeList?: string
  toAddress?: string
  isHideAddress?: boolean
  chainSelected?: string
  setWalletReceiver?: (wallet: Wallet) => void
  onChangeWalletSelected?: (wallet: Wallet) => void
  setToAddress?: (address: string) => void
  setErrAddress?: (message: string) => void
  wallets?: Wallet[]
  t?: any
}

const ListWalletSelect = (props: IProps) => {
  const {
    toAddress,
    walletSelected,
    typeList,
    isHideAddress = false,
    setToAddress,
    setErrAddress,
    onChangeWalletSelected,
    setWalletReceiver,
    wallets,
    t
  } = props

  // const { t } = useTranslation()

  const { onCopyWithTitle } = useClipboard({ t })

  // const handleSelectWallet = (wallet: Wallet) => () => {
  //   if (typeList) {
  //     setToAddress?.(wallet.address)
  //     setWalletReceiver?.(wallet)
  //     setErrAddress?.('')
  //   } else {
  //     onChangeWalletSelected?.(wallet)
  //   }
  //   window.closeModal()
  // }

  const dispatch = useAppDispatch()

  const handleSelectWallet = (wallet: Wallet) => () => {
    switch (typeList) {
      case 'receiver':
        setToAddress?.(wallet.address)
        setWalletReceiver?.(wallet)
        setErrAddress?.('')
        break
      case 'connect':
        dispatch(onActiveWallet(wallet))
        break
      default:
        onChangeWalletSelected?.(wallet)
        break
    }
    window.closeModal()
  }

  const handleCopyAddress = (address: string) => (e: any) => {
    e.stopPropagation()
    onCopyWithTitle(address, t('main_screen.address'))()
  }
  return (
    <div className="h-full w-full mt-20 overflow-auto">
      {wallets?.map((wallet) => (
        <div
          onClick={handleSelectWallet(wallet)}
          key={wallet.address}
          className={cx(
            'flex items-center justify-between border-b border-ui01 px-5 py-4 last:border-0 cursor-pointer hover:bg-ui01',
            typeList === 'receiver' &&
              get(walletSelected, 'address', '') === wallet.address &&
              'hidden'
          )}>
          <div className="flex items-center">
            <div className="avatar mr-3">
              <div className={cx(`w-8 h-8 ${get(wallet, 'avatar')}`)}></div>
            </div>
            <div>
              <p className="text-base font-semibold text-ui04 max-w-[200px] truncate">
                {get(wallet, 'name', '')}
              </p>
              <span className="text-ui03 text-tiny">
                {truncate(get(wallet, 'address', ''), { length: 10 })}
              </span>
              <Icon
                name="copy"
                className="ml-2 hover:opacity-50 transition-all text-ui03"
                onClick={handleCopyAddress(get(wallet, 'address', ''))}
              />
            </div>
          </div>
          <div className={cx('font-semibold text-h2')}>
            {(get(walletSelected, 'address') === wallet.address ||
              (typeList && toAddress === wallet.address)) && (
              <Icon className={cx('text-ui04')} name="check" />
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ListWalletSelect
