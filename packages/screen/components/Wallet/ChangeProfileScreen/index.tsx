import React, { type ChangeEvent, type FormEvent, useState } from 'react'
import type { Wallet } from '@wallet/core'
import { Button, Icon, Input, MainLayout } from '@wallet/ui'
import { useHistory, useLocation } from 'react-router-dom'
import { toast } from 'react-toastify'
import { onUpdateWallet, useAppDispatch, useAppSelector } from 'store'
import withI18nProvider from '../../../provider'
import { useTranslation } from 'react-i18next'

// import {
//   useAppDispatch,
//   useAppSelector
// } from '~controllers/stores/configureStore'
// import { onUpdateWallet } from '~controllers/stores/reducers/storages/walletSlice'

interface LocationState {
  wallet: Wallet
}

const ChangeProfileScreen = () => {
  const { t } = useTranslation()
  const history = useHistory()
  const { state = {} as LocationState } = useLocation<LocationState>()
  const wallets = useAppSelector((state) => state.wallet.wallets)
  const [walletName, setWalletName] = useState<string>(state?.wallet?.name)
  const [walletAvatar, setWalletAvatar] = useState<string>(
    state?.wallet?.avatar
  )
  const [activeButton, setActiveButton] = useState<boolean>(false)

  const dispatch = useAppDispatch()
  const AvatarsColor = [
    'bg-primary-bold',
    'bg-blue-light',
    'bg-purple',
    'bg-pink',
    'bg-red-thin',
    'bg-red-bold',
    'bg-orange-bold',
    'bg-yellow-bold',
    'bg-green-board',
    'bg-green-light'
  ]

  const onFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    onChangeProfile()
  }

  const onChangeProfile = async () => {
    const { address } = state?.wallet
    dispatch(
      onUpdateWallet({
        address,
        changes: {
          name: walletName,
          avatar: walletAvatar
        }
      })
    )

    toast(t('change_profile_screen.your_profile_is_updated'))
    history.go(-2)
  }

  const onChangeWalletName = (e: ChangeEvent<HTMLInputElement>) => {
    setActiveButton(true)
    setWalletName(e.target.value)
  }

  const onChangeAvatar = (avatar: string) => {
    setActiveButton(true)
    setWalletAvatar(avatar)
  }

  const isNameError = !!wallets.find(
    (wallet: Wallet) =>
      wallet.name !== state?.wallet?.name && wallet.name === walletName
  )

  const isLengthNameError = walletName.split('').length > 30

  return (
    <MainLayout title={t('change_profile_screen.name_wallet')} className="p-5">
      <form onSubmit={onFormSubmit} className="flex flex-1 flex-col mt-8">
        <Input
          // maxLength={25}
          isAllowClear
          label={t('change_profile_screen.wallet_name')}
          placeholder={t('change_profile_screen.enter_wallet')}
          value={walletName}
          onChange={onChangeWalletName}
          // @ts-expect-error
          caption={
            (isNameError ? (
              <span className="text-red">
                {t('change_profile_screen.name_already_taken')}
              </span>
            ) : undefined) ||
            (isLengthNameError ? (
              <span className="text-red">
                {t('change_profile_screen.wallet_name_too_long')}
              </span>
            ) : undefined)
          }
        />

        <div className="mt-6">
          <p className="font-semibold text-ui04">Avatar</p>
          <div className="grid grid-cols-5 items-center justify-items-center">
            {AvatarsColor?.map((avatar, index) => {
              return (
                <div
                  className="m-2 cursor-pointer"
                  key={index}
                  onClick={() => onChangeAvatar(avatar)}>
                  <div
                    className={`w-14 h-14 text-white text-[26px] all-center ${avatar}`}>
                    {avatar === walletAvatar && (
                      <Icon name="status_checked" className="text-ui04" />
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="mt-auto">
          <Button
            isBlock
            onClick={onChangeProfile}
            disabled={
              !walletName || isNameError || isLengthNameError || !activeButton
            }>
            {t('change_profile_screen.save')}
          </Button>
        </div>
      </form>
    </MainLayout>
  )
}

export default withI18nProvider(ChangeProfileScreen)
