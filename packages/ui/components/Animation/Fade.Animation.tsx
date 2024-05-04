import { Transition } from '@headlessui/react'
import React, { FC, ReactNode } from 'react'

interface IFade{
    children: ReactNode
    show?: boolean
}

export const Fade: FC<IFade> = ({ children, show }) => {
  return (
    <Transition
        show={show}
        enter="transition-all origin-top duration-300 transform ease-linear"
        enterFrom="transform  opacity-0"
        enterTo="transform opacity-100"
        leave="transition-all origin-top duration-300 transform ease-linear"
        leaveFrom="transform opacity-100"
        leaveTo="transform opacity-0">
            {children}
    </Transition>
  )
}
