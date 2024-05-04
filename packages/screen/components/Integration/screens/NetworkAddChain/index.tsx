import { Button, MainLayout } from '@wallet/ui'
import React from 'react'
import { useTranslation } from 'react-i18next'

interface NetworkAddChainScreenProps {
  host?: string
  name?: string
  icon?: string
  blockchain?: string
  symbol?: string
}

const NetworkAddChainScreen = (props: NetworkAddChainScreenProps) => {
  const { t } = useTranslation()
  const {
    host = 'https://pancakeswap.finance',
    name = 'Aura.network',
    icon = '',
    blockchain = 'Aura Network Testnet',
    symbol = 'AURA'
  } = props

  return (
    <div className="flex h-full flex-col justify-around items-center">
      <div className="bg-lineAddChain flex justify-center items-center bg-contain w-full h-24">
        <div className="bg-gradient-to-t from-gradient_yellow1 to-gradient_yellow2 rounded-full w-20 h-20 p-0.5">
          <div className="w-full h-full rounded-full bg-dark flex justify-center items-center">
            <img
              src={icon}
              className="w-11 h-11 object-contain bg-transparent"
            />
          </div>
        </div>
      </div>
      <div className="text-center font-medium text-lg px-10">
        <div
          dangerouslySetInnerHTML={{
            __html: t('addNetworkDesc', {
              name,
              blockchain
            })
          }}></div>
      </div>
      <div className="px-10 w-full">
        <div className="bg-white/6 rounded-2xl px-5 py-6 w-full">
          <div className="mb-7">
            <p className="text-white/50 text-xs">
              {t('network_add_chain.network_name')}
            </p>
            <p className="text-white font-medium text-sm">{blockchain}</p>
          </div>
          <div className="mb-7">
            <p className="text-white/50 text-xs">{t('host')}</p>
            <p className="text-white font-medium text-sm">{host}</p>
          </div>
          <div>
            <p className="text-white/50 text-xs">{t('symbol')}</p>
            <p className="text-white font-medium text-sm">{symbol}</p>
          </div>
        </div>
      </div>
      <div className="w-full text-sm font-medium flex justify-center gap-x-2 items-center">
        <Button className="w-40 px-0 rounded-full" type="gray">
          <p>{t('transaction_screen.cancel')}</p>
        </Button>
        <Button className="w-40 px-0 rounded-full" type="primary">
          <p className="capitalize">{t('network_add_chain.switch_network')}</p>
        </Button>
      </div>
    </div>
  )
}

export default NetworkAddChainScreen
