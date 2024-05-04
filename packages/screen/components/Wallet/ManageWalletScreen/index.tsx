import type { Wallet } from '@wallet/core'
import { Icon, Image, ListItem, MainLayout, Touch } from '@wallet/ui'
import get from 'lodash/get'
import { useHistory, useLocation } from 'react-router-dom'
import { removeWallet, useAppDispatch } from 'store'
import { useTranslation } from 'react-i18next'

// import { getAvatar } from '~config/helpers'
import UnlockScreen from '../../Auth/screens/UnlockScreen'
import withI18nProvider from '../../../provider'

interface LocationState {
  wallet: Wallet
}

const ManageWalletScreen = ({ encryptService }) => {
  const { t } = useTranslation()
  const history = useHistory()
  const { state = {} as LocationState } = useLocation<LocationState>()
  const dispatch = useAppDispatch()

  const { wallet } = state

  if (!wallet) return null

  const onRemoveWallet = () => {
    window.openModal({
      okText: t('wallet_settings.remove'),
      cancelText: t('wallet_settings.cancel'),
      title: t('change_profile_screen.are_you_sure'),
      content: t('wallet_settings.remove_wallet_subtitle'),
      type: 'confirm',
      btnType: 'confirm',
      displayType: 'compact',
      iconType: 'danger',
      closable: false,
      onOk: () => {
        dispatch(removeWallet(wallet))
        history.goBack()
      }
    })
  }

  const onBackupPassphrase = () => {
    window.openModal({
      title: t('wallet_settings.backup_warning_button'),
      content: t('wallet_settings.backup_subtitle'),
      okText: t('wallet_settings.backup'),
      type: 'confirm',
      btnType: 'warning',
      iconType: 'warning',
      closable: false,
      displayType: 'compact',
      onOk: () => {
        window.openModal({
          closable: true,
          type: 'none',
          content: (
            <UnlockScreen
              isModal
              t={t}
              encryptService={encryptService}
              cb={() => {
                window.closeModal()
                history.push('/main/wallet/manage/backup', {
                  wallet
                })
              }}
            />
          )
        })
      }
    })
    // window.openModal({
    //   title: t('wallet_settings.backup_warning_button'),
    //   content: t('wallet_settings.backup_subtitle'),
    //   okText: t('wallet_settings.view_passphrase'),
    //   type: 'warning',
    //   btnType: 'orange',
    //   iconType: 'warning',
    //   closable: true,
    //   onOk: () => {
    //     console.log({window});
    //     window.openModal({
    //       closable: true,
    //       type: 'none',
    //       content: (
    //         <UnlockScreen
    //           isModal
    //           t={t}
    //           encryptService={encryptService}
    //           cb={() => {
    //             window.closeModal()
    //             history.push('/main/wallet/manage/backup', {
    //               wallet
    //             })
    //           }}
    //         />
    //       )
    //     })
    //   }
    // })
  }

  const onChangeProfile = () => {
    history.push('/main/wallet/manage/change-profile', {
      wallet
    })
  }

  const onShowQR = () => {
    history.push('/main/wallet/manage/receive', {
      wallet,
      fromScreen: 'setting'
    })
  }

  const renderRightView = () => {
    return (
      <Touch className="text-h2 mr-5" onClick={onShowQR}>
        <Icon name="show_qr" className="text-ui04" />
      </Touch>
    )
  }

  const onManageConnection = () => {
    history.push('/main/wallet/manage/connections', {
      wallet
    })
  }

  const MenuList = [
    {
      title: 'wallet_details.change_profile',
      action: onChangeProfile
    },
    {
      title: 'wallet_details.backup_passphrase',
      action: onBackupPassphrase
    },
    {
      title: 'wallet_details.manage_connections',
      action: onManageConnection
    }
  ]

  // const walletAvatar = get(wallet, 'avatar', 'google')

  // Uppercase first letter of walletAvatar
  // const linkedType = walletAvatar.charAt(0).toUpperCase() + walletAvatar.slice(1)

  return (
    <MainLayout title={get(wallet, 'name')} right={renderRightView()}>
      {/* <ListItem
        title={get(wallet, 'name')}
        hideImage={true}
        description={
          <div className="flex items-center">
            <div>
              {t('wallet_details.account_linked', { account: linkedType })}
            </div>
            <Icon className="text-h3 ml-1 text-green" name="status_checked" />
          </div>
        }
        rightView={
          <div className="ml-auto h-8 w-8 mr-0">
            <Image src={getAvatar(walletAvatar)} className="w-full h-full" />
          </div>
        }
      /> */}
      <div className="">
        {MenuList.map((menu) => {
          return (
            <ListItem
              hideImage={true}
              key={menu.title}
              title={t(menu.title)}
              showArrow
              onClick={menu.action}
            />
          )
        })}
      </div>
      <div className="mt-auto mb-6">
        <div
          className="transition-all text-red all-center text-h6 hover:opacity-50 cursor-pointer uppercase"
          onClick={onRemoveWallet}>
          <Icon name="delete" className="mr-2 text-h3" />
          {t('Remove wallet')}
        </div>
      </div>
    </MainLayout>
  )
}

export default withI18nProvider(ManageWalletScreen)
