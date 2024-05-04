import { Key } from '@wallet/core'
import { Button, Checkbox, Input, Selection } from '@wallet/ui'
import { getLength } from '@wallet/utils'
import React, { useEffect, useState } from 'react'
import { CHAIN_TYPE } from 'store/constants'
import { useTranslation } from 'react-i18next'
import { useCreateWalletContext } from '../../context/CreateWalletContext'
import RadioSelection from '@wallet/ui/components/RadioSelection/RadioSelection.component'
import { useAppSelector } from 'store'

const StepRestore = () => {
  const { t } = useTranslation()
  const { state, onChangeInputState, onRestore, onChangeIsOldWalletStandard } = useCreateWalletContext()
  const services = window.walletServices && window.walletServices.engines[0]
  const { privateKeyOrPassphrase, isOldStandard } = state
  const [isValidMnemonic, setIsValidMnemonic] = useState<boolean>(true)

  const [isShowWalletStandard, setIsShowWalletStandard] = useState(true)

  const [ activeNetwork] = useAppSelector((state) => [
    state.setting.activeNetwork
  ])

  const validatePhraseOrPrivateKey = async () => {
    setIsShowWalletStandard(true)
    if (privateKeyOrPassphrase) {
      try {
        if (!isText(privateKeyOrPassphrase)) return setIsValidMnemonic(false)
        if (!privateKeyOrPassphrase.includes(' ')) {
          const key = privateKeyOrPassphrase.startsWith('0x')
            ? privateKeyOrPassphrase.slice(2)
            : privateKeyOrPassphrase

          if (getLength(key) > 64) return setIsValidMnemonic(false)
        }
        if (Key.isMnemonic(privateKeyOrPassphrase)) {
          const PassphraseLength = privateKeyOrPassphrase.split(' ').length
          if (PassphraseLength < 12) return setIsValidMnemonic(false)
          return setIsValidMnemonic(true)
        }else{
          setIsShowWalletStandard(false)
        }
        
        await services.createOrRestore({
          name: 'xx',
          chain: activeNetwork?.chain,
          isPrivateKey: true,
          privateKey: privateKeyOrPassphrase
        })
        return setIsValidMnemonic(true)
      } catch (e) {
        setIsValidMnemonic(false)
      }
    }
    setIsValidMnemonic(false)
  }

  const isText = (text: string) => {
    // Check space at start or and mnemonic
    if (/^\s|\s$/.test(text)) return false

    // Check space between text
    if (Key.isMnemonic(privateKeyOrPassphrase)) {
      if (text.match(/\s{2,}/g)) return false
    } else {
      if (text.match(/\s{1,}/g)) return false
    }

    return true
  }


  useEffect(() => {
    validatePhraseOrPrivateKey()
  }, [privateKeyOrPassphrase])

  const isKeyError = privateKeyOrPassphrase && !isValidMnemonic

  const listStandard = [
    {
      title: 'Old Standard',
      description: "Derivation Path m/44/889/0'0'",
      value: 'old'
    },
    {
      title: 'New Standard',
      description: "Derivation Path m/44/60'/0'/0'",
      value: 'new'
    },
  ]

  const handleChangeStandard = (item) => {
    const isOld = item.value === 'old'
    onChangeIsOldWalletStandard?.(isOld)
  }

  return (
    <>
      <div className="my-6 text-ui04">Enter your passphrase string here: </div>

      <Input
        textarea
        rows={3}
        isAllowClear
        isPastable
        label={'Passphrase'}
        placeholder={'hairy cat...'}
        value={privateKeyOrPassphrase}
        onChange={(e: React.ChangeEvent<HTMLInputElement> | any) => {
          if (e.nativeEvent?.inputType === 'insertLineBreak') {
            return e.preventDefault()
          }
          onChangeInputState?.('privateKeyOrPassphrase')(e)
        }}
        status={isKeyError ? 'error' : undefined}
        caption={
          isKeyError ? t('step_restore.invalid_passphrase_or_pk') : undefined
        }
      />


      <div className="mt-auto">
        <Button
          isBlock
          onClick={onRestore}
          disabled={privateKeyOrPassphrase.length === 0 || isKeyError}>
          {t('step_restore.restore')}
        </Button>
      </div>
    </>
  )
}

export default StepRestore
