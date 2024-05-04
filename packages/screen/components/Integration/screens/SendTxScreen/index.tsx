import { Button } from '@wallet/ui'
import { convertHexToDecimal, formatNumberBro, truncate } from '@wallet/utils'
import React, { type FC, useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { base58, convertWeiToBalance } from '@wallet/utils'

import { useIntegrationContext } from '../../context'
import ViewMessagesData from '../ViewMessagesData'
import GasSlider from '../../../shared/GasSlider'
import withI18nProvider from '../../../../provider'
import ViewData from '../TransactionScreen/Components/ViewData'
import { useLocation } from 'react-router-dom'
import { get } from 'lodash'
import ClosableContent from '../../../shared/ClosableContent'
import { useSendTokenContext } from '../../../Token/context'
import useTokenLocal from '../../../../hooks/useTokenLocal'
import { decodeMessage } from '@wallet/abi-decoder'

const SendTxScreen = () => {
  const { t } = useTranslation()
  const { request, activeWallet, isLoading, onRejectRequest, onAcceptRequest } =
    useIntegrationContext()
  const [isCustomGas, setIsCustomGas] = useState(false)
  const [gasPrice, setGasPrice] = useState(25)
  const [gasLimit, setGasLimit] = useState(21000)
  const { isGasFree } = useSendTokenContext()
  const { getTokenMain, tokensLocal } = useTokenLocal()
  const mainToken = getTokenMain()
  let amount: string | number
  let symbol: string

  const gasFee = gasPrice * gasLimit

  const { favIconUrl, title } = request?.sender?.tab || {
    favIconUrl:
      'https://coin98.s3.ap-southeast-1.amazonaws.com/Currency/sei.png',
    title: ' 1inch Network'
  }
  const { origin } = request?.sender || { origin: 'https://1inch.io/wallet' }

  // Get amount and symbol token swap
  if (get(request, 'params[0].value')) {
    const valueHex = get(request, 'params[0].value')
    amount = formatNumberBro(
      convertWeiToBalance(convertHexToDecimal(valueHex).toString(), 18),
      4
    )
    symbol = get(mainToken, 'symbol', 'VIC')
  } else {
    const dataDecode = decodeMessage({ name: 'swap' }, request?.params[0].data)
    amount = formatNumberBro(
      convertWeiToBalance(dataDecode[0].toString(), 18),
      4
    )
    const dataToken = tokensLocal.find(
      (it) =>
        get(it, 'address', '').toLowerCase() === dataDecode[2][0].toLowerCase()
    )
    symbol = get(dataToken, 'symbol', '').toUpperCase()
  }

  const { state: LocationState } = useLocation<any>()
  const { renderRequest = {} } = LocationState || {}

  const isMsgWithString = JSON.stringify(request).includes('isMsgString')

  const onChangeGas = (gasFee: number) => {}

  // const onViewData = () => {
  //   window.openModal({
  //     type: 'none',
  //     content: <ViewMessagesData />,
  //     contentType: 'other',
  //     closable: true
  //   })
  // }
  const { data } = renderRequest

  const txData = get(data, 'transaction')

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

  const tabs = [
    {
      name: t('Data'),
      content: <ClosableContent data={messages} hideTitle={true} />
    }
  ]

  const onViewData = () => {
    window.openModal({
      type: 'none',
      content: <ViewData tabs={tabs} className="h-full w-full mt-20" />,
      contentType: 'other',
      closable: true
    })
  }

  return (
    <div className="bg-ui00 h-full w-full px-5 pb-6 flex flex-col">
      <div className="pt-10 pb-6 text-h3 font-bold all-center capitalize text-center">
        <div className="max-w-[220px] truncate text-ui04">
          {t('confirmation.sign_transaction')}
        </div>
      </div>

      <div className="flex flex-col gap-2 mx-2">
        <div className="flex items-center bg-ui01 px-1 py-2">
          <div className="connector mr-3">
            <img
              src={favIconUrl ?? '/public/img/brand/logo.svg'}
              className="w-10 h-10 rounded-full"
              alt=""
            />
          </div>
          <div className="flex flex-col">
            <div className="leading-6 text-[14px] font-semibold text-ui04">
              {title}
            </div>
            <div className="text-tiny text-ui03">{origin}</div>
          </div>
        </div>
      </div>

      <div>
        <div className="text-[14px] text-ui03 mt-10 mb-3">
          {t('confirmation.transaction_details')}:
        </div>

        <div className="leading-6 text-base">
          <p className="text-ui04">
            {t('confirmation.verify_signature', { amount, symbol })}
          </p>
          <div className="text-primary cursor-pointer" onClick={onViewData}>
            {t('confirmation.view_data')}
          </div>
        </div>
      </div>

      {/* <div className="flex justify-between items-center pt-10">
        <div className="text-ui03 text-tiny">{t("Estimated gas fee")}</div>
        <div className="text-ui04 text-[14px]">
          <span className="truncate">15.48 SEI</span> SEI ~$1.20
        </div>
      </div> */}

      {isGasFree ? (
        <div className="flex pt-5 min-h-[180px]">
          <GasSlider
            isLoading={false}
            isCustomGas={isCustomGas}
            gasFee={gasFee}
            gasLimit={gasLimit}
            className="w-full"
            onChange={onChangeGas}
            setIsCustomGas={setIsCustomGas}
            symbol="VIC"
          />
        </div>
      ) : (
        <div className="body-14-regular text-ui04">
          {t('wrap_send.network_gas_free')}
        </div>
      )}

      <div className="mt-auto flex">
        <Button
          className="flex-1 mr-4 border-ui02"
          type="primary"
          outline
          onClick={onRejectRequest}>
          {t('confirmation.reject')}
        </Button>

        <Button
          className="flex-1"
          type="primary"
          isLoading={isLoading}
          onClick={onAcceptRequest}>
          {t('confirmation.sign')}
        </Button>
      </div>
    </div>
  )
}

export default withI18nProvider(SendTxScreen)
