import React, { ReactElement, ReactNode } from 'react'
import cx from 'clsx'
import { Icon } from '../../components/Icon/Icon.component'
import { Touch } from '../../components/Touch/Touch.Component'

interface IMainLayout {
  children: ReactNode
  left?: string | ReactNode
  right?: string | ReactNode | ReactElement
  title?: string | ReactNode
  align?: 'left' | 'center' | 'right'
  hideBack?: boolean
  isFullScreen?: boolean
  backAction?: Function
  currentStep?: number
  sendTokenStep?: string
  stakeStep?: string
  walletType?: string

  // Additional Class
  className?: string
  containerClass?: string
  headerClass?: string
  stylesContent?: React.CSSProperties
  footer?: ReactNode
}

enum WalletType {
  Create = 'create',
  Restore = 'restore'
}

export const MainLayout: React.FC<IMainLayout> = ({
  children,
  left,
  right,
  title,
  align = 'center',
  hideBack,
  isFullScreen,
  backAction,
  className,
  containerClass,
  headerClass,
  currentStep,
  sendTokenStep,
  walletType,
  stylesContent,
  footer,
  stakeStep
}) => {
  const titleCls = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }

  const checkLastStepCreateWallet =
    (walletType === WalletType.Create && currentStep === 3) ||
    (walletType === WalletType.Restore && currentStep === 1)
  const typeSendTokenOrNFTStep = sendTokenStep === 'confirm'

  const typeStake = stakeStep === 'confirm'

  return (
    <div
      className={cx(
        'bg-ui00 flex-1 flex flex-col overflow-hidden',
        containerClass
      )}>
      <div
        className={cx(
          'main-layout-header z-50 flex justify-between items-center relative pt-6',
          headerClass || 'pb-6',
          {
            hidden: isFullScreen
          }
        )}>
        <div
          className={cx(
            'main-layout-left-action h-full flex items-center justify-center',
            {
              absolute: align === 'center',
              'right-5':
                checkLastStepCreateWallet ||
                typeSendTokenOrNFTStep ||
                typeStake,
              'left-5':
                !checkLastStepCreateWallet &&
                !typeSendTokenOrNFTStep &&
                !typeStake
            }
          )}>
          {left ??
            (!hideBack && (
              <Touch
                size={32}
                // @ts-ignore: Unreachable code error
                onClick={backAction || (window as any).goBack}
                className="text-[24px]">
                {checkLastStepCreateWallet ||
                typeSendTokenOrNFTStep ||
                typeStake ? (
                  <Icon name="close" className="text-icon-primary" />
                ) : (
                  <Icon name="arrow_left" className="text-icon-primary" />
                )}
              </Touch>
            ))}
        </div>
        <div
          className={cx(
            'flex-1 header-03 text-tx-primary font-bold all-center capitalize',
            {
              'pl-2': !hideBack && !align,
              'pl-5': hideBack && !align,
              invisible: !title
            },
            titleCls[align]
          )}>
          <div className="max-w-[220px] truncate text-h3 leading-8">{title || 'Fake title'}</div>
        </div>
        <div
          className={cx(
            'main-layout-right-action right-5 h-full flex items-center justify-center',
            {
              absolute: align === 'center'
            }
          )}>
          {right}
        </div>
      </div>

      <div
        className={cx(
          'main-layout-content flex-1 text-sm flex flex-col overflow-auto',
          {
            'mb-0': !isFullScreen
          },
          className
        )}
        style={stylesContent}>
        {children}
      </div>
      {footer && footer}
    </div>
  )
}
