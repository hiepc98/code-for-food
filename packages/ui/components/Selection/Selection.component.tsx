import React, { ReactNode } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { Icon } from '../Icon/Icon.component'
import { cx } from '@wallet/utils'

export interface SelectionItem<T = any> {
  title: string | ReactNode
  value: T
}

interface ISelection {
  label?: string
  labelType?: "primary" | "normal"
  items: SelectionItem[]
  value?: SelectionItem
  placeholder?: string
  onChange: (item: SelectionItem) => void
  renderMethod?: (item: SelectionItem) => React.ReactNode
}

export const Selection: React.FC<ISelection> = ({ label, labelType = "normal", items = [], value, placeholder, onChange, renderMethod }) => {
  const displayButton = value?.title ?? placeholder

  return (
    <div>
        {label && (
        <label className={cx('text-xs pl-5 mb-1 block', {
          'text-yellow': labelType === 'primary',
          'text-gray4': labelType === 'normal'
        })}>
          {label}
        </label>
        )}
        <Listbox onChange={onChange} value={value}>
          {({ open }) => (
            <div className='relative'>
              <Listbox.Button className="bg-gray05 w-full text-yellow text-sm text-left px-5 py-4 rounded-3xl flex items-center justify-between">
                <span>{displayButton}</span>
                <span className={cx('transition-all duration-300', open && 'rotate-180')}>
                    <Icon name="app_drop_down"/>
                </span>
              </Listbox.Button>

              <Transition
                enter="transition duration-100 ease-out"
                enterFrom="transform scale-95 opacity-0"
                enterTo="transform scale-100 opacity-100"
                leave="transition duration-75 ease-out"
                leaveFrom="transform scale-100 opacity-100"
                leaveTo="transform scale-95 opacity-0"
              >
                <Listbox.Options className="rounded-3xl bg-gray2 mt-0 absolute w-full max-h-52 overflow-auto">
                    {items.map((item, index) => {
                      const isActive = item?.value === value?.value
                      return (
                        <Listbox.Option className={cx('px-5 py-4 text-white text-xs transition hover:bg-gray25 cursor-pointer', {
                          'text-yellow': isActive
                        })} key={`${item.title}${index}`} value={item}>
                            {renderMethod ? renderMethod(item) : item.title}
                        </Listbox.Option>
                      )
                    })}
                </Listbox.Options>
              </Transition>
            </div>
          )}
        </Listbox>
    </div>
  )
}
