import { type Wallet } from '@wallet/core'
import { Button, Icon, Image, Touch } from '@wallet/ui'
import { cx, truncate } from '@wallet/utils'
import get from 'lodash/get'
import { type FC } from 'react'
import { useTranslation } from 'react-i18next'

// import { getAvatar } from '~config/helpers'
import { useIntegrationContext } from '../../context'
import ListWalletSelect from '../../../Token/components/ListWalletSelect'
import { useAppSelector } from 'store'
import withI18nProvider from '../../../../provider'
import { COIN_IMAGE } from '@wallet/constants'

const ConnectScreen = () => {
  const { t } = useTranslation()
  const { request, onRejectRequest, onAcceptRequest } =
    useIntegrationContext()

  

  const [activeNetwork] = useAppSelector((state) => [
    state.setting.activeNetwork
  ])

  const symbol = get(activeNetwork, 'symbol', 'ETH')

  const { favIconUrl, title } = request?.sender?.tab || {
    favIconUrl: COIN_IMAGE[symbol],
    title: `${get(activeNetwork, 'name')} Network`
  }
  const { origin } = get(request, 'sender', '')

  const [activeWallet, wallets] = useAppSelector((state) => [
    state.wallet.activeWallet,
    state.wallet.wallets
  ])

  const onChangeWallet = () => {
    window.openModal({
      type: 'none',
      content: (
        <ListWalletSelect
          t={t}
          typeList='connect'
          wallets={wallets}
          walletSelected={activeWallet}
        />
      ),
      contentType: 'other',
      closable: true
    })
  }

  return (
    <div className="bg-ui00 h-full w-full px-5 pb-6 flex flex-col overflow-auto">
      <div className="pt-10 mt-4 pb-6 text-h3 font-bold all-center capitalize text-center">
        <div className="max-w-[220px] truncate text-ui04">
          {t('confirmation.connect_wallet')}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-start items-center bg-ui01 px-2 py-2">
          <div className="connector mr-3">
            <img
              src={favIconUrl || COIN_IMAGE[symbol]}
              className="w-10 h-10 rounded-full"
              alt=""
            />
          </div>
          <div className="flex flex-col">
            <div className="leading-6 text-[14px] font-semibold text-ui04">{title}</div>
            <div className="text-tiny text-ui03">{origin}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 px-2">
          <img src="/public/img/icons/connection.svg" alt="" className='w-10 h-10' />
          <div className="text-[14px] text-ui03">
            {t('confirmation.wants_connect')}:
          </div>
        </div>

        <div
          className="flex gap-3 bg-ui01 px-2 py-2 cursor-pointer"
          onClick={onChangeWallet}>

          <div className="avatar">
            <div
              className={cx(
                `w-10 h-10 rounded-full ${get(activeWallet, 'avatar')}`
              )}></div>
          </div>

          <div>
            <div className="leading-6 text-[14px] font-semibold text-ui04">
              {get(activeWallet, 'name')}
            </div>
            <div className="text-tiny text-ui03">
              {truncate(get(activeWallet, 'address'))}
            </div>
          </div>

          <div className="ml-auto flex items-center gap-1">
            {/* <div className="h-8 w-8 rounded-full overflow-hidden">
              <Image src={favIconUrl} className="w-full h-full" />
            </div> */}

            <Touch
              size={{ height: 20, width: 20 }}
              className="text-h3"
              >
              <Icon name="chevron_right" className='text-ui04' />
          </Touch>
          </div>
        </div>
      </div>

      <div>
        <div className="text-[14px] font-medium text-ui03 mt-10 mb-3">
          {t('confirmation.app_site')}:
        </div>

        <div className="flex items-center mb-3">
          <Image src="/public/img/icons/checked.svg" className="mr-2" />
          <div className="leading-6 text-[14px] text-ui04">
            {t('confirmation.can_view')}
          </div>
        </div>

        <div className="flex items-center mb-3">
          <Image src="/public/img/icons/checked.svg" className="mr-2" />
          <div className="leading-6 text-[14px] text-ui04">
            {t('confirmation.can_request')}
          </div>
        </div>

        <div className="flex items-center">
          <Image src="/public/img/icons/reject.svg" className="mr-2" />
          <div className="leading-6 text-[14px] text-ui04">
            {t('confirmation.can_not_move')}
          </div>
        </div>
      </div>

      <div className="mt-auto flex">
        <Button
          className="flex-1 mr-4 border-ui02"
          type="primary"
          outline
          onClick={onRejectRequest}>
          {t('confirmation.reject')}
        </Button>
        <Button className="flex-1" type="primary" onClick={onAcceptRequest}>
          {t('confirmation.connect')}
        </Button>
      </div>
    </div>
  )
}

export default withI18nProvider(ConnectScreen)
