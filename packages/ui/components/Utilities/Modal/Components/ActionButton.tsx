import React, { useMemo, useState, PropsWithChildren } from 'react'
import type { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, ButtonType } from '../../../Button/Button.component'
import LoadingCircle from '../../../../../screen/components/shared/LoadingCircle'

interface IActionButton {
    type: 'error' | 'success' | 'confirm' | 'warning' | 'icon' | 'none'
    btnType?: string
    okText?: string
    cancelText?: string

    onOk?: () => any
    onCancel?: () => any
}

enum STATUS {
    ACCEPT = 'ACCEPT',
    REJECT = 'REJECT'
}

type TStatus = STATUS.ACCEPT | STATUS.REJECT

interface IModalButton {
  type: 'confirm' | 'warning' | 'outline'
  onClick: () => void
  children: React.ReactNode | string
  className?: string
  isLoading?: boolean
  isBlock?: boolean
  size?: 'default' | 'small'
}
const ModalButton = ({ size = 'default', type, onClick, className, children, isLoading = false, isBlock } : IModalButton) => {
  const getButtonSize = () => {
    if (size === 'default') {
      return 'button-02'
    }
    return 'button-02'
  }

  const getButtonStyle = () => {
    if (type === 'outline')
      return 'border-2 border-primary bg-transparent text-btn-on-secondary'
    if (type === 'confirm') {
      return 'bg-sem-danger'
    }
    if (type === 'warning') {
      return 'bg-orange'
    }
    return 'bg-btn-on-primary'
  }
  
  return <div 
    className={`appearance-none all-center cursor-pointer 
      cursor-pointer rounded-btn-bg-radius transition outline-none 
      py-2 px-6 transition-all duration-300 hover:drop-shadow-sm active:brightness-80 
      ${getButtonStyle()} 
      ${className}
      ${isBlock && 'w-full'} 
      ${isLoading && 'bg-btn-bg-loading'}
      ${getButtonSize()}
    `}
    onClick={onClick}
  >
    {isLoading ? (
        <LoadingCircle
          height='32px'
          width='32px'
        />
      ) : (
        children
      )}
  </div>
}

const ActionButton: FC<IActionButton> = ({ type, btnType, okText, cancelText, onOk, onCancel }) => {
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const onUserResponse = (status: TStatus) => async () => {
    if (status === STATUS.REJECT) {
      setIsLoading(true)
      onCancel && await onCancel()
      setIsLoading(false)
    }
    if (status === STATUS.ACCEPT) {
      setIsLoading(true)
      onOk && await onOk()
      setIsLoading(false)
    }
    window.closeModal()
  }

  const btnColor = useMemo(() => {
    switch (type) {
      case 'success':
        return "green"
      case 'error':
        return "red"
      default:
        return 'primary'
    }
  }, [type])

  if (!type || type === 'none') return null

  if (type === 'confirm') {
    return (
      <div className="flex gap-4 w-full">
        <ModalButton type='outline' className='flex-1 uppercase text-h5' onClick={onUserResponse(STATUS.REJECT)}>
            {cancelText ?? t('Cancel')}
        </ModalButton>
        <ModalButton type={btnType as 'warning' | 'confirm' | 'outline'} className="flex-1 uppercase text-h5 text-ui00" isLoading={isLoading} onClick={onUserResponse(onOk ? STATUS.ACCEPT : STATUS.REJECT)}>
            {okText ?? t('setting_screen.confirm')}
        </ModalButton>
      </div>
    )
  }

  return <Button type={btnType as ButtonType ?? btnColor} isBlock onClick={onUserResponse(onOk ? STATUS.ACCEPT : STATUS.REJECT)}>{okText ?? t('done')}</Button>
}

export default ActionButton
