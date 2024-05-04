import React, { ReactElement, ReactNode } from 'react'
import cx from 'clsx'
import { Icon } from '../../components/Icon/Icon.component'
import { Touch } from '../../components/Touch/Touch.Component'

interface IPopupLayout {
  children: ReactNode
  left?: string | ReactNode
  right?: string | ReactNode | ReactElement
  title?: string | ReactNode
  align?: 'left' | 'center' | 'right'
  hideBack?: boolean
  backAction?: Function

  // Additional Class
  className?: string
  containerClass?: string
}

export const PopupLayout: React.FC<IPopupLayout> = ({ children, left, right, title, align, hideBack, backAction, className, containerClass }) => {
  const onPreventClosing = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
  }

  const titleCls = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right'
  }

  return (
    <div className={cx('flex-1 flex flex-col overflow-hidden h-screen', containerClass)} onClick={window.closeModal}>
      <div className="main-layout-header z-50 flex justify-between items-center relative py-6">
        <div className={cx('main-layout-left-action left-0 h-full flex items-center justify-center', {
          absolute: align === 'center'
        })}>
          {left ?? (!hideBack && (
            <Touch size={32} onClick={backAction || (window as any).closeModal} className="ml-3">
              <Icon name="app_close"/>
            </Touch>
          ))}

        </div>
        <div className={cx('flex-1 text-white', {
          'pl-2': !hideBack && !align,
          'pl-5': hideBack && !align
        }, titleCls[align])}>
          {title}
        </div>
        <div className={cx('main-layout-right-action right-0 h-full flex items-center justify-center', {
          absolute: align === 'center'
        })}>
          {right}
        </div>
      </div>

      <div className={cx('main-layout-content flex-1 rounded-3xl mb-3 text-white text-sm flex flex-col overflow-auto', className)} >
        {children}
      </div>
    </div>
  )
}
