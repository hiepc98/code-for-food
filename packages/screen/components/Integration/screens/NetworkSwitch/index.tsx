import { ChainData } from '@wallet/core'
import { Button, Icon, type IconType } from '@wallet/ui'
import { type FC, useEffect } from 'react'

import { useIntegrationContext } from '../../context'
import { useTranslation } from 'react-i18next'
import withI18nProvider from '../../../../provider'

const NetworkSwitch= () => {
  const { t } = useTranslation()

  // const { request  } = useIntegrationContext()
  const request = {
    sender: {
      tab: {
        favIconUrl:
          'https://coin98.s3.ap-southeast-1.amazonaws.com/Currency/sei.png',
        title: ' 1inch Network'
      },
      origin: 'https://1inch.io/wallet'
    },
    params: [
      {
        chainId: '0x1'
      }
    ]
  }

  const { favIconUrl, title } = request?.sender?.tab || {}
  const { origin } = request?.sender || {}

  const chainData = ChainData.find(
    (chain) =>
      chain.chainId?.toLowerCase() === request.params[0]?.chainId.toLowerCase()
  )

  useEffect(() => {
    if (request && !chainData) {
      window.openModal({
        type: 'error',
        content: t('network_switch.network_not_available'),
        onCancel: window.close
      })
    }
  }, [chainData])

  const onCancel = () => {}
  const onAccept = () => {}

  return (
    <div className="bg-ui00 h-full w-full px-5 pb-6 flex flex-col overflow-auto">
      <div className="flex flex-col justify-center text-center px-10 mt-auto mb-5">
        <div className="m-auto mb-3">
          <img src="/public/img/icons/warning.svg" alt="" />
        </div>

        <p className="text-sub text-ui04 font-semibold leading-6">
          {t('confirmation.switch_network')}
        </p>

        <p className="text-base text-ui03 mt-5">
          {t('confirmation.allow_this_site')}
        </p>
      </div>

      <div className="grid grid-cols-3 justify-center items-center mb-[128px]">
        <div className="flex justify-start items-center px-1 py-2">
          <div className="w-10 h-10 rounded-full shrink-0 overflow-auto mr-3">
            <img src={favIconUrl} className="w-full h-full" alt="" />
          </div>
          <div className="leading-6 text-[14px] font-semibold">
            {t('network_switch.ethereum')}
          </div>
        </div>

        <div className="flex justify-center">
          <Icon name="arrow_right" className="text-ui02 text-h2" />
        </div>

        <div className="flex justify-end items-center px-1 py-2">
          <div className="leading-6 text-[14px] font-semibold mr-3">
            {t('network_switch.bsc')}
          </div>
          <div className="w-10 h-10 rounded-full overflow-auto shrink-0">
            <img src={favIconUrl} className="w-full h-full" alt="" />
          </div>
        </div>
      </div>

      <div className="flex">
        <Button
          className="flex-1 mr-4 border-ui02"
          type="primary"
          outline
          onClick={onCancel}>
          {t('confirmation.cancel')}
        </Button>
        <Button className="flex-1" type="primary" onClick={onAccept}>
          {t('confirmation.switch')}
        </Button>
      </div>
    </div>
  )
}

export default withI18nProvider(NetworkSwitch)
