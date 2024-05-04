// @ts-nocheck
import { Dialog, Transition } from '@headlessui/react'
import React, { FC, useEffect, useRef, useState } from 'react'
import { cx } from '@wallet/utils'
import type { IconType } from '@ui'

import ActionButton from './Components/ActionButton'
import ModalBoxContent from './Components/ModalBoxContent'
import ModalIcon from './Components/ModalIcon'
import { ButtonType } from '../../Button/ButtonLegacy.component'
import { Icon } from '../../Icon/Icon.component'
import { Touch } from '../../Touch/Touch.Component'
import { useClickAway } from 'react-use'

declare module globalThis {
  var isModalOpen: boolean

  var openModal: (element: IModalProps) => void
  var closeModal: () => void
  var onPasteContent: () => () => any
  var refreshUI: () => any
}

type IAction = {
  name: IconType,
  handler: () => void,
  defaultBehavior: boolean
}

export interface IModalProps {
  title?: string;
  description?: string;
  type: 'error' | 'success' | 'confirm' | 'warning' | 'icon' | 'none';
  contentType?: 'default' | 'with-background' | 'other';
  btnType?: ButtonType;
  iconType?: 'error' | 'danger' | 'warning';
  content: React.ReactNode | string;
  okText?: string;
  cancelText?: string;
  closable?: boolean;
  left?: IAction;
  right?: IAction;
  onCancel?: () => any;
  onOk?: () => any;
  disableClickOutside?: boolean;
  className?: string;
  displayType?: 'full' | 'compact'
}

interface IState {
  isOpen: boolean;
  element?: IModalProps;
}

const defaultState: IState = {
  isOpen: false,
  element: undefined
}

export const Modal: FC = () => {
  const [state, setState] = useState<IState>(defaultState)
  const dialogPanelRef = useRef<any>()
  // @ts-ignore
  const {
    isOpen,
    element = {} as IModalProps
  }: { isOpen: boolean; element: IModalProps } = state

  const closeModal = () => {
    setState((state) => ({ ...state, isOpen: false }))

    if (element?.onCancel) {
      element.onCancel()
    }
    globalThis.isModalOpen = false
  }

  const onPanelClickAway = useClickAway(dialogPanelRef, () => {
    if (element.displayType === 'compact' && !disableClickOutside) {
      closeModal()
    }
  })

  const { type, btnType, okText, cancelText, closable, iconType, left, right, disableClickOutside } =
    element || {}

  const isExpand = window.location.href.includes('expand=true') || window.location.href.includes('welcome')

  const openModal = (element: IModalProps) => {
    if (globalThis.isModalOpen) {
      closeModal()
      // @ts-ignore
      return setTimeout(() => {
        setState((state) => ({ ...state, element, isOpen: true }))
      }, 500)
    }
    setState((state) => ({ ...state, element, isOpen: true }))
    globalThis.isModalOpen = true
  }

  const getModalDisplayStyle = () => {
    return element.displayType === 'full' || !element.displayType ? 'h-full' : 'h-auto mx-5'
  }

  const checkShowModalHeader = () => {
    return closable || left || right
  }

  useEffect(() => {
    globalThis.openModal = openModal
    globalThis.closeModal = closeModal
    globalThis.onPasteContent = () => () => {}
    globalThis.refreshUI = () => {}
  }, [])

  const transition = {
    enter: {
      value: 'duration-300 ease-in-out',
      from: 'duration-300 transform translate-y-[200%]',
      to: 'duration-300 transform translate-y-0'
    },
    leave: {
      value: 'duration-200 ease-in-out',
      from: 'duration-300 transform translate-y-0',
      to: 'duration-300 transform translate-y-[200%]',
    }
  }

  if (element.displayType === 'compact') {
    transition.enter.value = 'ease-in-out duration-100';
    transition.enter.from = 'visibility hidden';
    transition.enter.to = 'visibility visble';

    transition.leave.value = 'ease-out duration-75';
    transition.leave.from = 'visibility visble';
    transition.leave.to = 'visibility hidden';
  }

  return (
    <Transition
      show={isOpen}
      appear={true}
      enter={`transition ${transition.enter.value}`}
      enterFrom={`transition ${transition.enter.from}`}
      enterTo={`transition ${transition.enter.to}`}
      leave={`transition ease-in-out ${transition.leave.value}`}
      leaveFrom={`transition ${transition.leave.from}`}
      leaveTo={`transition ${transition.leave.to}`}
      as={React.Fragment}
    >
      {element && (
        <Dialog
          onClose={() => {}}
          className='fixed left-0 top-0 right-0 z-50 h-screen w-screen'
        >
          {element.displayType === 'compact' && <div className='bg-bg-modal-backdrop fixed left-0 right-0 width-full h-full'></div>}
          <div className='fixed h-full inset-0 flex items-center justify-center'>
            <Dialog.Panel
              ref={dialogPanelRef}
              onClick={onPanelClickAway}
              className={cx(
                'relative h-full w-[390px] all-center flex-col bg-dialog-bg rounded-dialog-bg-radius',
                {
                  'p-5': type && type !== 'none',

                  'w-[525px]': isExpand
                }
              , getModalDisplayStyle(), element.className)}
            >
            {checkShowModalHeader() && (<div className='absolute left-5 top-5 right-5 text-tx-primary text-h2 cursor-pointer z-[99999]'>
                <div className='relative w-full text-center'>
                  <div className='flex absolute right-0 top-0 items-center gap-x-2'>
                    {right && (
                      <Touch
                        onClick={right.defaultBehavior ? closeModal : right.handler}
                        className='text-h2'
                      >
                        <Icon name={right?.name} className='text-icon-primary' />
                    </Touch>
                    )}

                    {closable && (
                      <Touch
                        onClick={closeModal}
                        className='text-h2'
                      >
                        <Icon name='close' className='text-icon-primary' />
                      </Touch>
                      )
                    }
                  </div>
                  {!!element.title && type === 'none' && (
                    <div className='text-h3 text-center w-full mt-1 z-10 truncate'>
                      {element.title}
                    </div>
                  )}
                  {left && (
                    <Touch
                      onClick={left.defaultBehavior ? closeModal : left.handler}
                      className='absolute left-0 top-0 text-h2'
                    >
                      <Icon name={left.name} className='text-icon-primary' />
                    </Touch>
                  )}
                </div>
                </div>
              )}

              <div className='h-full w-full all-center flex-col'>
                <ModalIcon type={type} iconType={iconType} />

                {type !== 'none' && (
                  <Dialog.Title
                    className='text-h4 text-tx-primary text-center mb-0 mt-6'
                    hidden={!element.title}
                  >
                    {element.title}
                  </Dialog.Title>
                )}

                <Dialog.Description
                  className='text-base text-ui04 text-justify'
                  hidden={!element.description}
                >
                  {element.description}
                </Dialog.Description>

                <ModalBoxContent
                  type={element.contentType}
                  content={element.content}
                />
              </div>

              {type !== 'none' && (
                <div className='mt-4 w-full'>
                  <ActionButton
                    btnType={btnType}
                    okText={okText}
                    cancelText={cancelText}
                    type={type}
                    onCancel={element.onCancel}
                    onOk={element.onOk}
                  />
                </div>
              )}
            </Dialog.Panel>
          </div>
        </Dialog>
      )}
    </Transition>
  )
}
