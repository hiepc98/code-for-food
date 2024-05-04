/* eslint-disable multiline-ternary */
import { Icon, Input, Touch, BoxContent } from '@wallet/ui'
import { cx, truncate } from '@wallet/utils'
import get from 'lodash/get'
import isEmpty from 'lodash/isEmpty'

import { useSendTokenContext } from '../context'
import ListWalletSelect from './ListWalletSelect'
import WalletAvatar from '../../shared/WalletAvatar'
import useViewport from '../../../hooks/useViewport'
import { useAppSelector } from 'store'
import useReceiveAddress from '../../../hooks/useReceiveAddress'
import { useTranslation } from 'react-i18next'

const SendToToken = () => {
  const {
    errAddress,
    memo,
    toAddress,
    tokenSelected,
    walletSelected,
    // recentContactList,
    getRecentContactList,
    setErrAddress,
    setToAddress,
    setWalletReceiver,
    getWalletByAddress,
    onChangeWalletSelected,
    onRemoveContact,
    onChangeAddressSendTo,
    onChangeMemo,
    handleSelectRecentAddress
  } = useSendTokenContext()

  const { t } = useTranslation()

  const { isExpand } = useViewport()
  // const { getRecentContactList } = useReceiveAddress()
  const handleClearRecentAddress = () => {
    onRemoveContact?.(get(walletSelected, 'address', ''))
  }
  const [wallets] = useAppSelector((state) => [state.wallet.wallets])

  const openModalWalletList = () => {
    window.openModal({
      type: 'none',
      content: (
        <ListWalletSelect
          walletSelected={walletSelected}
          typeList={'receiver'}
          setToAddress={setToAddress}
          setErrAddress={setErrAddress}
          chainSelected={tokenSelected?.chain}
          onChangeWalletSelected={onChangeWalletSelected}
          setWalletReceiver={setWalletReceiver}
          toAddress={toAddress}
          wallets={wallets}
          t={t}
        />
      ),
      contentType: 'other',
      closable: true
    })
  }

  const renderListRecent = () => {
    const recentContactList = getRecentContactList(walletSelected!)
    if (recentContactList.length === 0) return
    return (
      <div>
        <p className="text-tiny text-ui04 font-bold mt-4 mb-2 capitalize">
          {t('recents')}
        </p>
        <div className="mb-4">
          {recentContactList?.map((item: any) => {
            const address = get(item, 'address')
            const isActive = toAddress === address
            return (
              <div
                key={get(item, 'address', '')}
                className="flex py-2 items-center justify-between cursor-pointer border-b border-ui01 last:border-none"
                onClick={handleSelectRecentAddress?.(address)}>
                <div className="flex items-center ml-2">
                  <div className="w-6 h-6 bg-ui02 mr-2"></div>
                  <div className="text-tiny leading-[16px] text-ui04">
                    {truncate(address, { length: 10 })}
                  </div>
                </div>
                <Icon
                  name="check"
                  className={`${!isActive && 'hidden'} text-h2 text-ui04`}
                />
              </div>
            )
          })}
        </div>

        <div
          className="text-primary text-base cursor-pointer"
          onClick={handleClearRecentAddress}>
          {t('send_to_token.clear_all')}
        </div>
      </div>
    )
  }

  const addressReceive = getWalletByAddress?.(toAddress)
  const walletAvatar = get(addressReceive, 'avatar', '')
  return (
    <div className="pl-4 pr-4">
      <BoxContent>
        <div className="text-base">
          <div className="flex justify-between items-center pt-3">
            {isEmpty(addressReceive) ? (
              <p className="text-tiny text-ui04 leading-[16px]">
                {t('send_nft_success.to')}
              </p>
            ) : (
              <div className="flex items-center">
                <div
                  className={cx(
                    `w-5 h-5 text-ui00 all-center mr-3 ${walletAvatar}`
                  )}></div>
                <p
                  className={`truncate text-tiny text-ui04 ${
                    isExpand ? 'max-w-[300px]' : 'max-w-[200px]'
                  }`}>
                  {' '}
                  {get(addressReceive, 'name')}
                </p>
              </div>
            )}

            {wallets.length > 1 && (
              <Touch
                onClick={() => openModalWalletList()}
                size={{ height: 20, width: 20 }}>
                <Icon name="contacts" className="text-h4 text-ui04" />
              </Touch>
            )}
          </div>
          <Input
            textarea
            rows={2}
            status={errAddress ? 'error' : 'normal'}
            caption={errAddress}
            value={toAddress}
            className="px-0 border-none"
            onChange={onChangeAddressSendTo}
            placeholder={t('send_to_token.send_to_address_placeholder')}
            isPastable
            isAllowClear
          />
        </div>
{/*
        <Input
          className="mb-0 border-none px-0"
          maxLength={256}
          value={memo}
          onChange={onChangeMemo}
          placeholder={t('send_to_token.memo_optional')}
        /> */}
      </BoxContent>

      <div>{renderListRecent()}</div>
    </div>
  )
}

export default SendToToken
