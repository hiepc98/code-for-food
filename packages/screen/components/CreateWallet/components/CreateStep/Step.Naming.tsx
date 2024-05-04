import type { Wallet } from '@wallet/core'
import { Button, Icon, Input } from '@wallet/ui'
import { isEmpty } from 'lodash'
import { type FormEvent, useEffect, useMemo, useState } from 'react'

import { useCreateWalletContext } from '../../context/CreateWalletContext'
import { WalletParams, WalletType } from '../../../../types'
import { useAppSelector } from 'store'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const StepNaming = () => {
  const { t } = useTranslation()

  const [nameInput, setNameInput] = useState<string>('')
  const [errAddress, setErrAddress] = useState<string>('')
  const {
    state,
    onFinishSetupWallet,
    onChangeInputState,
    onSetDefaultName,
    onChangeAvatar
  } = useCreateWalletContext()
  const wallets = useAppSelector((state) => state.wallet.wallets)
  const { type } = useParams<WalletParams>()

  const { name, avatarColor } = state

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
  const defaultName = `Wallet ${wallets.length + 1}`

  useEffect(() => {
    onSetDefaultName?.(defaultName)
  }, [])

  const onFormSubmit = (e: FormEvent) => {
    e.preventDefault()
    // onFinishSetupWallet()
  }

  useMemo(() => {
    if (wallets.find((wallet: Wallet) => wallet.name === nameInput)) {
      setErrAddress(t('change_profile_screen.name_already_taken'))
    }

    if (!isEmpty(nameInput) && nameInput.split('').length > 30) {
      setErrAddress(t('change_profile_screen.wallet_name_too_long'))
    }
  }, [name])

  const description = useMemo(() => {
    if (type === WalletType.Create) {
      return 'Your wallet is created successfully! Please give it a name.'
    }
    return 'Your wallet is restored successfully! Please give it a name.'
  }, [type])

  return (
    <form onSubmit={onFormSubmit} className="flex flex-1 flex-col">
      <div className="my-6 text-ui04">{t(description)}</div>

      <Input
        // maxLength={30}
        isAllowClear
        label={t('change_profile_screen.wallet_name')}
        placeholder={defaultName}
        status={errAddress ? 'error' : 'normal'}
        caption={errAddress}
        value={name}
        onChange={(e) => {
          if (isEmpty(e.target.value)) {
            setErrAddress(t('change_profile_screen.wallet_can_not_be_blank'))
          } else {
            setErrAddress('')
          }
          onChangeInputState?.('name')(e)
          setNameInput(e.target.value)
        }}
      />
      {/* <div className="mt-6">
        <p className="font-semibold text-ui04">{t('step.avatar')}</p>
        <div className="grid grid-cols-5 items-center justify-items-center">
          {AvatarsColor?.map((avatar, index) => {
            return (
              <div
                className="m-2 cursor-pointer"
                key={index}
                onClick={() => onChangeAvatar?.(avatar)}>
                <div
                  className={`w-14 h-14 text-white text-[26px] all-center ${avatar}`}>
                  {avatar === avatarColor && (
                    <Icon name="status_checked" className="text-ui00" />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div> */}

      <div className="mt-auto">
        <Button
          onClick={() => {
            if (wallets.find((wallet: Wallet) => wallet.name === name)) {
              setNameInput(name)
              return false
            }
            onSetDefaultName?.(name)
            onFinishSetupWallet?.()
          }}
          isBlock
          disabled={!isEmpty(errAddress) || !name}>
          {t('step.start_using')}
        </Button>
      </div>
    </form>
  )
}

export default StepNaming
