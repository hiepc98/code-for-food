import { Wallet } from '@wallet/core'
import { Alert, Button, Icon, Input, MainLayout, Touch } from '@wallet/ui'
import ErrorFallback from '@wallet/ui/components/Utilities/ErrorFallback'
import get from 'lodash/get'
import React, { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useLocation } from 'react-router-dom'

import useClipboard from '../../../hooks/useClipboard'
import withI18nProvider from '../../../provider'

interface LocationState {
  wallet: Wallet
}

const BackupScreen = ({ encryptService }: { encryptService: any}) => {
  const history = useHistory()
  const { t } = useTranslation()
  const { onCopyWithTitle } = useClipboard({ t })
  const { state = {} as LocationState } = useLocation<LocationState>()

  const wallet = useMemo<Wallet>(() => {
    if (!state.wallet) return {} as Wallet
    return encryptService.decryptWallet(state.wallet)
  }, [state?.wallet])

  const privateKey = get(wallet, 'privateKey', '')
  const mnemonic = wallet?.mnemonic as string

  if (!privateKey && !mnemonic) {
    return <ErrorFallback error={{}} />
  }

  const onGoBack = () => {
    history.goBack()
  }

  return (
    <MainLayout title={t('Backup Passphrase')} className="px-5">
      <div className="bg-ui01 px-2 py-3">
        <div className="flex items-center justify-between">
          <div className='text-tiny text-ui03'>
            {t('PrivateKey')}
          </div>
          <div className='text-[16px] leading-5 text-ui04'>
            <Icon name="copy" onClick={onCopyWithTitle(privateKey as string, t('PrivateKey'))} className="hover:opacity-50 cursor-pointer active:opacity-70" />
          </div>
        </div>
        <div className="break-all mt-2 text-base text-ui04">
          {privateKey as string}
        </div>
      </div>
      <div className="columns-2 mt-2">
        {mnemonic?.split(' ').map((word: string, index: number) => {
          return (
            <div
              key={word}
              className="bg-ui01 mb-2 items-center p-3 leading-4 grid grid-cols-5">
              <div className="span-col-1 font-semibold text-ui03">
                {index + 1}
              </div>
              <div className="span-col-4 text-ui04">{word}</div>
            </div>
          )
        })}
      </div>

      {mnemonic && (
        <div className="w-full mt-1">
          <div
            className="all-center text-primary hover:opacity-50 cursor-pointer active:opacity-70"
            onClick={onCopyWithTitle(mnemonic as string, t('step.passphrase'))}>
            <Icon name="copy" className="mr-2 text-h3" />
            <div className="text-h5 uppercase">
              {t('step_passphrase.copy_passphrase')}
            </div>
          </div>
        </div>
      )}

      <div className="w-full">
        <Alert type="orange" className="mt-4">
          <span className="leading-none">
            {t('step_passphrase.never_share_passphrase')}
          </span>
        </Alert>
      </div>

      {/* <Button className="mt-2" onClick={onGoBack}>
        {t('backup_screen.close_now')}
      </Button> */}
    </MainLayout>
  )
}

export default withI18nProvider(BackupScreen)
