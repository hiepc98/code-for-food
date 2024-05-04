import React from 'react'
import type { Wallet } from '@wallet/core'
import { Icon, Image, MainLayout, Touch } from '@wallet/ui'
import { cx, truncate } from '@wallet/utils'
import get from 'lodash/get'
import { sleep } from '../../../common/functions'
import { useHistory } from 'react-router-dom'

import useClipboard from '../../../hooks/useClipboard'

import TypeSelectionModal from '../../CreateWallet/components/TypeSelectionModal'
import { useAppDispatch, useAppSelector, onActiveWallet as activeAction } from 'store'
import { TomoWallet } from 'store/types'
import withI18nProvider from '../../../provider'
import { useTranslation } from 'react-i18next'

const MyWalletScreen = () => {
  const history = useHistory()
  const { t } = useTranslation()
  const [wallets, activeWallet, walletsByUser, activeNetwork] = useAppSelector(
    (state) => [
      state.wallet.wallets,
      state.wallet.activeWallet,
      state.wallet.walletsByUser,
      state.setting.activeNetwork
    ]
  )
  const { onCopyWithTitle } = useClipboard({ t })
  const dispatch = useAppDispatch()

  const onRouting = (path: string, state?: any) => (e: React.MouseEvent) => {
    e.stopPropagation()
    return history.push(`/main/wallet/${path}`, state)
  }

  const onActiveWallet = (wallet: TomoWallet) => async () => {
    dispatch(activeAction(wallet))
    await sleep(300)
    history.goBack()
  }

  const onSelectTypeModal = () => {
    // if (!isExpand) {
    //   if (!window.location.href.includes('expand=true')) {
    //     return window.open(
    //       `${window.location.href}?redirect=/startup&expand=true`
    //     )
    //   }
    // }
    window.openModal({
      type: 'none',
      title: t('wizard.add_wallet'),
      content: <TypeSelectionModal/>,
      contentType: 'other',
      closable: true
    })
  }

  const onCopyAddress = (walletAddress: string) => (e: React.MouseEvent) => {
    e.stopPropagation()
    onCopyWithTitle(walletAddress, t('main_screen.address'))()
  }

  const backAction = () => {
    return history.push('/main')
  }


  const renderWallets = () => {
    return wallets.map((wallet) => {
      const isActive = wallet.address === activeWallet.address
      const walletName = get(wallet, 'name', '')
      const walletAvatar = get(wallet, 'avatar', 'bg-ui02')
      const walletAddress = get(wallet, 'address', '')
      return (
        // Refactor Avatar
        <div
          key={wallet.address}
          className="hover:bg-ui01 group cursor-pointer"
          onClick={onActiveWallet(wallet)}>
          <div className="flex min-h-[76px] items-center mr-5 border-b-[1px] border-b-ui01 group-last:border-b-0">
            <div
              className={cx(
                `w-1 h-6 bg-ui04 mr-4 rounded-r-sm ${
                  isActive ? 'visible' : 'invisible'
                }`
              )}></div>
            <div
              className={cx(
                `w-8 h-8 text-ui00 text-[24px] all-center mr-3 ${walletAvatar}`
              )}>
              {/* <Image src={getAvatar(walletAvatar)} className="w-full h-full" /> */}
            </div>
            <div className="wallet-info">
              <div className="font-semibold text-tiny leading-4 text-ui04 truncate max-w-[150px] mb-1">
                {walletName}
              </div>
              <div className="text-ui03">
                {truncate(walletAddress, { length: 10 })}
              </div>
            </div>

            <div className="flex items-center justify-end flex-1 text-h3 ml-3">
              <Touch
                className={cx('mr-3')}
                onClick={onCopyAddress(walletAddress)}>
                <Icon name="copy" className="text-ui04" />
              </Touch>
              <Touch onClick={onRouting('manage', { wallet })}>
                <Icon name="menu_settings" className="text-ui04" />
              </Touch>
            </div>
          </div>
        </div>
      )
    })
  }

  return (
    <MainLayout
      backAction={backAction}
      title={t('my_wallet_screen.my_wallets')}
      right={
        <Touch className="text-[24px]" onClick={onSelectTypeModal}>
          <Icon name="add" className="text-ui04" />
        </Touch>
      }>
      <div className="mt-0">{renderWallets()}</div>
    </MainLayout>
  )
}

export default withI18nProvider(MyWalletScreen)
