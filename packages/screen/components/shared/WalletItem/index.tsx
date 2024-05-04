import React, { type FC } from 'react'
import type { Wallet } from '@wallet/core'
import { cx, truncate } from '@wallet/utils'
import { get } from 'lodash'
import { Touch, Icon } from '@wallet/ui'

// import useViewport from '~controllers/hooks/useViewport'
import { useAppSelector } from 'store'
import useViewport from '../../../hooks/useViewport'
import useClipboard from '../../../hooks/useClipboard'
import { useTranslation } from 'react-i18next'
import withI18nProvider from '../../../provider'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  wallet: Wallet
  rightView?: React.ReactNode
}

const WalletItem: FC<Props> = ({ wallet, rightView, ...props }) => {
  const [activeNetwork] = useAppSelector((state) => [state.setting.activeNetwork])
  const { isExpand } = useViewport()
  const { t } = useTranslation()
  const { onCopyWithTitle } = useClipboard({ t })

  const walletName = get(wallet, 'name', '')
  const walletAddress = get(wallet, 'address', '')
  const walletAvatar = get(wallet, 'avatar', '')

  const onCopyAddress = (walletAddress: string) => (e: React.MouseEvent) => {
    e.stopPropagation()
    onCopyWithTitle(walletAddress, t('main_screen.address'))()
  }

  return (
    <div
      className="flex min-h-[76px] hover:bg-01 items-center mx-5 border-b-[1px] border-b-ui01 group-last:border-b-0 cursor-pointer"
      {...props}>
     <div className={cx(`w-8 h-8 text-ui00 text-[24px] all-center mr-3 ${walletAvatar}`)}></div>
      <div className="wallet-info">
        <div
          className={`text-h5 text-ui04 truncate ${
            isExpand ? 'max-w-[400px]' : 'max-w-[260px]'
          }`}>
          {walletName}
        </div>
       
        {activeNetwork && (
          <div className='flex items-center gap-2'>
            <div className="text-ui03 text-h6">
              {truncate(walletAddress, { length: 10 })}
            </div>
              <Touch
              onClick={onCopyAddress(walletAddress)}
              style={{width: 24, height: 24}}
              >
              <Icon name="copy" className="text-ui04 text-h4" style={{width: 24, height: 24}} />
            </Touch>
          </div>

          
        )}
      </div>

      <div className="flex items-center justify-end flex-1 text-h2 text-ui04 ml-auto">
        {rightView}
      </div>
    </div>
  )
}

export default withI18nProvider(WalletItem)
