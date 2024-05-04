import { Button, Icon, Image, Input, Slider, Touch, TypeInput } from '@wallet/ui'
import { base58, formatMoney } from '@wallet/utils'
import get from 'lodash/get'
import React, { type ChangeEvent, type FC, useState } from 'react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useLocation } from 'react-router-dom'

import { useAppSelector } from 'store'
import { useIntegrationContext } from '../../context'
import ClosableContent from '../../../shared/ClosableContent'
import withI18nProvider from '../../../../provider'
import ViewData from './Components/ViewData'
import { cloneDeep } from 'lodash'
import { UNLIMIT_HEX } from '@wallet/evm/src/constants/config'
import ApproveSignDetail from './Components/ApproveSignDetail'

interface IState {
  isAdvance: boolean
  gas: string
  gasIndex: number
}

const TransactionScreen = (props: any) => {
  const { encryptService } = props
  const { t } = useTranslation()
  const { state: LocationState } = useLocation<any>()
  const { renderRequest = {} } = LocationState || {}
  const { data } = renderRequest
  const activeNetwork = useAppSelector((state) => state.setting.activeNetwork)
  const { request, onRejectRequest, onAcceptRequest } = useIntegrationContext()

  const [activeWallet] = useAppSelector((state) => [state.wallet.activeWallet])

  const txData = get(data, 'messages')
  const gas = get(txData, 'authInfo.fee.gasLimit', '250000')
  const priceStep = [0.01, 0.025, 0.03]
  const maxStepValue = Math.floor(100 / (priceStep.length - 1))
  const isMsgWithString = JSON.stringify(request).includes('isMsgString')
  const isEmptyData = !get(data, 'messages') && !get(data, 'options')
  const isPermit = get(txData, 'primaryType') === 'Permit'

  const [state, setState] = useState<IState>({
    isAdvance: false,
    gas,
    gasIndex: 0
  })

  const [isApproveUnlimited, setIsApproveUnlimited] = useState(false)
  const [approvedTxData, setApprovedTxData] = useState()

  const onChangeState = (name: string, value: any | object) => {
    if (typeof value === 'object') {
      return setState((prev) => ({ ...prev, ...value }))
    }
    setState((prev) => ({ ...prev, [name]: value }))
  }

  const onChangeGas = (e: ChangeEvent<HTMLInputElement>) => {
    onChangeState('gas', e.target.value)
  }

  const onChangeSlider = (sValue: number) => {
    const gasIndex = Math.floor(sValue / maxStepValue)
    onChangeState('gasIndex', gasIndex)
  }

  const onConfirm = () => {
    const decryptedWallet = encryptService.decryptWallet(activeWallet)
    const originalPrivateKey = decryptedWallet.privateKey.toString()

    const santizedPrivateKey = originalPrivateKey.startsWith('0x')
      ? originalPrivateKey.slice(2)
      : originalPrivateKey

    const newTxData = cloneDeep(txData)
    if(isApproveUnlimited){
      newTxData.message.value = Number(UNLIMIT_HEX)
    }
    onAcceptRequest({
      advance: {
        privateKeyBuffer: Buffer.from(santizedPrivateKey, 'hex'),
        wallet: decryptedWallet,
        data: newTxData
      }
    })
  }

  const renderDappInfo = () => {
    const imgSrc = get(request, 'sender.tab.favIconUrl')
    const origin = get(request, 'sender.origin')
    const title = get(request, 'sender.tab.title')
    return <div className='flex bg-ui01 box-border p-3 items-center mt-3'>
        <div className='flex-none w-10 h-10 mr-3'> 
          <Image 
            defaultRender={() => {
              return <div className='w-full h-full bg-ui02'></div>
            }} 
            src={imgSrc} 
            className='w-full h-full object-fit' 
          />
        </div>
        <div className='flex flex-1 flex-col overflow-hidden'>
          <div className='header-06 text-tx-primary truncate'>{title || 'Dapp Name'}</div>
          <div className='body-14-regular text-tx-secondary truncate'>{origin || 'Dapp Link'}</div>
        </div>
      </div>
  }

  const renderGasText = useMemo(() => {
    switch (state.gasIndex) {
      case 0:
        return t('Slow')
      case 1:
        return t('Medium')
      case 2:
        return t('Fast')
    }
  }, [state.gasIndex])

  const computedGas = useMemo(() => {
    const minDenomValue = Number(state.gas) * Number(priceStep[state.gasIndex])
    return {
      rawValue: minDenomValue,
      value: 0,
      fiatValue: 0
    }
  }, [state.gasIndex, state.gas])

  const messages = useMemo(() => {
    if (isMsgWithString) {
      const msgs = (get(txData, 'msgs', []) as any[]).map((it) => {
        if (it.value.data && isMsgWithString) {
          it.value.data = Buffer.from(base58.decode(it.value.data)).toString()
        }
        return it
      })
      return JSON.stringify(msgs, null, 2)
    }

    return JSON.stringify(get(txData, 'txBody.messages', txData || []), null, 2)
  }, [txData, isMsgWithString])

  const checkSignatureApprove = JSON.parse(messages)?.fee?.gas === '0' || !JSON.parse(messages)?.fee?.gas


  const tabs = [
    {
      name: t('Data'),
      content: <ClosableContent data={messages} hideTitle={true} />
    }
  ]

  const handleOpenViewData = () => {
    window.openModal({
      type: 'none',
      content: <ViewData tabs={tabs} className="h-full w-full mt-20" />,
      contentType: 'other',
      closable: true
    })
  }

  const onChangeApproveUnlimited = (value) => {
    setIsApproveUnlimited(value)
  }

  const transactionName = isPermit ? t('confirmation.token_request') : t('signature_request.signature_request')

  return (
    <div className="bg-ui00 h-full w-full flex flex-col px-5 pb-5 text-ui04">
      <div className="flex flex-col mt-10 overflow-auto">
        <div className="all-center text-[40px]">
          <Icon name="status_alert" className="text-orange" />
        </div>

        <div className="mt-3 mb-6 all-center font-bold">
          {transactionName}
        </div>

        {
          isPermit && <p>{t('confirmation.token_request_description')}</p>
        }

        {/* <ClosableContent title={t('Data')} data={messages} /> */}
        {renderDappInfo()}

        <div className="mt-3">
          <h3 className="text-tiny text-ui03 font-medium">Details:</h3>
          <div className="text-base mt-2 leading-6 text-ui04">
            Verify signature permission.{' '}
            <a
              className="text-primary cursor-pointer"
              onClick={handleOpenViewData}>
              View Data
            </a>
          </div>
        </div>

        {
          isPermit &&   
          <ApproveSignDetail
            onChangeApproveUnlimited={onChangeApproveUnlimited}
            isApproveUnlimited={isApproveUnlimited}
            t={t} 
            approveData={txData} 
            // transaction={transaction}
          />
        }

        {!isMsgWithString && !checkSignatureApprove && !isEmptyData && (
          <div className="bg-ui01 rounded-lg p-4 mt-2">
            <div className="flex justify-between items-center">
              <div className="font-bold">{renderGasText}</div>
              <div className="text-h2">
                <Touch
                  onClick={() => onChangeState('isAdvance', !state.isAdvance)}>
                  <Icon name="custom" />
                </Touch>
              </div>
            </div>

            <div className="mt-5 mb-6">
              <Slider
                onChange={onChangeSlider}
                step={Math.floor(100 / (priceStep.length - 1))}
                max={100}
              />
            </div>

            <div className="flex justify-between items-center">
              <div className="text-ui03 text-tiny">
                {t('Estimated gas fee')}
              </div>
              <div className="text-ui04 text-tiny">
                <span className="truncate">{formatMoney('0')}</span> SEI ~$
                {computedGas.fiatValue}
              </div>
            </div>
          </div>
        )}

        {state.isAdvance && (
          <div className="mt-2 rounded-lg bg-ui01">
            <Input
              typeInput={TypeInput.Number}
              maxLength={10}
              label={t('transaction_screen.gas_price')}
              placeholder={t('transaction_screen.default_250000')}
              value={state.gas}
              onChange={onChangeGas}
            />
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-auto">
        <Button
          type="primary"
          outline
          className="flex-1 border-ui02 mr-4"
          onClick={onRejectRequest}>
          {t('transaction_screen.cancel')}
        </Button>

        <Button type="primary" className="flex-1" onClick={onConfirm}>
          {t('setting_screen.confirm')}
        </Button>
      </div>
    </div>
  )
}

export default withI18nProvider(TransactionScreen)
