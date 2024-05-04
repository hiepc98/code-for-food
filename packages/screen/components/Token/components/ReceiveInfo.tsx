import React, { type FC } from 'react'
import type { Wallet } from '@wallet/core'
import { Alert, Icon } from '@wallet/ui'
import { cx } from '@wallet/utils'
import get from 'lodash/get'
import { useTranslation } from 'react-i18next'
import QRCode from 'react-qr-code'
import { useLocation } from 'react-router-dom'

// import { DefaultNetworks } from '~config/networks'
import useClipboard from '../../../hooks/useClipboard'
import type { IToken } from '../../../types'
import { DefaultNetworks } from 'store/constants'

interface LocationState {
  wallet?: Wallet
  fromScreen?: string
  tokenInfo?: IToken
}

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
}

const ReceiveInfo: FC<IProps> = (props) => {
  const { className } = props
  const { t } = useTranslation()
  const { onCopyWithTitle } = useClipboard({t})
  const { state = {} as LocationState } = useLocation<LocationState>()
  // const { getWalletByChain } = useWalletUser()

  const clsx = cx(`h-screen flex flex-col gap-3 relative ${className}`)

  const wallet = get(state, 'wallet')
  const fromScreen = get(state, 'fromScreen')
  const tokenInfo = get(state, 'tokenInfo')

  if (!wallet) return null

  const walletAddress = get(wallet, 'address', '')

  const onCopyAddress = () => {
    onCopyWithTitle(walletAddress, t('main_screen.address'))()
  }

  const networkInfo = () => {
    const chain = DefaultNetworks.find((item) => item.chain === get(tokenInfo, 'chain', 'tomo'))
    return get(chain, 'name', '')
  }

  return (
    <div className={clsx}>
      <div>
        {fromScreen !== 'setting'
          ? (
          <p className="text-base text-ui03 text-center">
            {t('receive_info.scan_address')}
          </p>
            )
          : (
          <div className="text-center flex flex-col gap-3 items-center">
            <div className="avatar cursor-pointer">
              <div
                className={cx(
                  `w-10 h-10 text-white text-[24px] all-center ${get(wallet, 'avatar', '')}`
                )}></div>
            </div>
            <p className="font-semibold text-center text-[16px] text-ui04">
              {wallet.name}
            </p>
          </div>
            )}
      </div>

      <div
        className={cx(
          'transition-all w-50 h-50 p-3 mx-auto cursor-pointer active:opacity-50 bg-white',
          {
            'mt-6 mb-6': fromScreen !== 'setting'
          }
        )}
        onClick={onCopyAddress}>
        <QRCode
          size={200}
          style={{ height: 'auto', maxWidth: '100%', width: '100%' }}
          value={walletAddress}
          viewBox={'0 0 200 200'}
        />
      </div>
      <div className="flex flex-col justify-center items-center">
        <div className="flex flex-col items-center text-[18px] w-full">
          <div className="text-h4 text-center max-w-full break-words text-ui04">
            {walletAddress}
          </div>
        </div>

        <div
          onClick={onCopyAddress}
          className="transition-all flex items-center text-primary text-base mt-4 cursor-pointer hover:opacity-50">
          <Icon className="text-h3" name="copy" />
          <span className="pl-1 text-h5 uppercase">{t('receive_info.copy_address')}</span>
        </div>
      </div>

      {/* {fromScreen !== 'setting' && ( */}
        <div className="mt-auto">
          <Alert type="orange">
            <p className="text-body-14-regular">
              Send only tokens <span className="uppercase">{tokenInfo?.symbol}</span>{' '}
              on Viction to this address.
            </p>
          </Alert>
        </div>
      {/* )} */}
    </div>
  )
}

export default ReceiveInfo
