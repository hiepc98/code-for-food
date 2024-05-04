import { Disclosure, Transition } from '@headlessui/react'
import React, { ReactElement, ReactNode } from 'react'
import { cx } from '@wallet/utils'

interface IExpandable {
  type: 'card' | 'block'
  title: string | ReactNode | ReactElement
  content?: string | ReactNode
  isOpen: boolean
  children?: string | ReactNode
  className?: string
  isViewCard?: boolean
}

export const Expandable: React.FC<IExpandable> = ({
  type = 'block',
  title,
  content,
  children,
  isOpen = false,
  className,
  isViewCard
}) => {
  const btnCls = {
    block:
      'bg-gray15 px-5 py-4 text-white rounded-3xl w-full text-left text-sm',
    card: cx('transition-all duration-500 bg-gray15 px-5 py-4 text-white rounded-3xl w-full text-left text-sm', !isViewCard && isOpen && 'pb-6')
  }

  const panelCls = {
    block: 'py-3',
    card: 'bg-gray25 rounded-3xl -mt-4 mb-3 text-white overflow-hidden'
  }

  return (
    <Disclosure defaultOpen={isOpen}>
      <Disclosure.Button className={cx(btnCls[type], className)}>
        {title}
      </Disclosure.Button>
      {!isViewCard && <Transition
        show={isOpen}
        enter="relative transition-all origin-top duration-500 transform ease-linear mb-3"
        enterFrom="opacity-0"
        enterTo="opacity-1"
        leave="relative transition-all origin-top duration-500 ease-linear"
        leaveFrom="opacity-1"
        leaveTo="opacity-0">
        <Disclosure.Panel className={cx(panelCls[type])}>
          {content ?? children}
        </Disclosure.Panel>
      </Transition>}
    </Disclosure>
  )
}
