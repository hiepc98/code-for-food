/* eslint-disable multiline-ternary */
import React, { FC } from 'react'
import { MoonLoader } from 'react-spinners'
import { cx } from '@wallet/utils'

export type ButtonType =
  | 'primary'
  | 'blue'
  | 'orange'
  | 'green'
  | 'red'
  | 'transparent'
  | 'custom'
  | 'secondary'

interface IButton extends React.HTMLAttributes<HTMLButtonElement> {
  type?: Partial<ButtonType>
  isBlock?: boolean
  hoverReveal?: boolean
  children?: string | React.ReactNode
  isLoading?: boolean
  disabled?: boolean | ''
  htmlType?: 'button' | 'submit' | 'reset'
  label?: string
  outline?: boolean
}

export const Button: FC<IButton> = ({
  children,
  label,
  className,
  isLoading,
  isBlock = false,
  type = 'primary',
  hoverReveal,
  disabled,
  htmlType,
  outline,
  ...rest
}) => {
  // Variants Class
  const variants = {
    primary: 'bg-primary text-ui00',
    blue: 'bg-blue text-ui00 border-blue',
    orange: 'bg-orange text-ui00 border-orange',
    green: 'bg-green text-ui00 border-green',
    red: 'bg-red text-ui04 border-red',
    transparent: 'bg-transparent border-transparent text-primary'
  }

  const variantsDisable = {}

  // BaseClass
  const cls = cx(
    'all-center cursor-pointer uppercase border-box cursor-pointer transition outline-none py-3 px-6 text-tiny leading-6 font-medium transition-all duration-300 hover:brightness-90 hover:drop-shadow-sm active:brightness-80 rounded-xl',
    !disabled && variants[type],
    {
      'w-full': isBlock,
      '!bg-gray15': hoverReveal,
      'bg-ui00 border-2 border-primary text-ui04': outline,
      // 'border-none': !outline,
      'bg-ui01 text-ui02 border-ui02': disabled
    },
    className
  )

  return (
    <button
      type={htmlType}
      disabled={disabled || isLoading}
      className={cls}
      {...rest}>
      {isLoading ? (
        <MoonLoader
          color="var(--ui02)"
          speedMultiplier={0.5}
          size={24}
          loading={true}
        />
      ) : (
        label ?? children
      )}
    </button>
  )
}
