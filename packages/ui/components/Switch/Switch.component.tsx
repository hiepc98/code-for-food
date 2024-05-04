import React from 'react'
import { Switch as HSwitch } from '@headlessui/react'

interface ISwitch {
  checked?: boolean
  onChange?: (isChecked: boolean) => void
}

export const Switch: React.FC<ISwitch> = ({ checked = false, onChange }) => {
  return (
    <HSwitch
      as="div"
      checked={checked}
      onChange={onChange}
      className={`${checked ? 'bg-primary' : 'bg-ui02'
        } relative inline-flex h-8 w-12 items-center`}
    >
      {/* <span className="sr-only">Enable notifications</span> */}
      <span
        className={`${checked ? 'translate-x-6' : 'translate-x-2'
          } inline-block h-4 w-4 transform bg-white transition`}
      />
    </HSwitch>
  )
}
