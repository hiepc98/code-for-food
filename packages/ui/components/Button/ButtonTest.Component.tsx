/* eslint-disable multiline-ternary */
import React, { FC } from 'react'
import { MoonLoader } from 'react-spinners'
import { cx } from '@wallet/utils'

export type ButtonTestType = 'default' | 'outline' | 'ghost'
export type ButtonTestSize = 'default' | 'small'

interface IButton extends React.HTMLAttributes<HTMLButtonElement> {
  type?: Partial<ButtonTestType>
  size?: Partial<ButtonTestSize>
  isBlock?: boolean
  hoverReveal?: boolean
  children?: string | React.ReactNode
  isLoading?: boolean
  disabled?: boolean | ''
  htmlType?: 'button' | 'submit' | 'reset'
  label?: string
  outline?: boolean
}

export const ButtonTest: FC<IButton> = ({
  children,
  label,
  className,
  isLoading,
  isBlock = false,
  type = 'default',
  size = 'default',
  hoverReveal,
  disabled,
  htmlType,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  outline,
  ...rest
}) => {
  // Variants Class
  const variants = {
    default: 'bg-btn-bg-primary',
    outline: 'bg-transparent text-btn-on-secondary border-btn-bg-secondary',
    ghost: 'bg-btn-bg-tertiary text-btn-on-tertiary border-transparent'
  }

  const variantsDisable = {
    default: 'bg-btn-bg-disabled-primary text-btn-bg-disabled-primary',
    outline:
      'bg-btn-bg-disabled-secondary text-btn-on-disabled-secondary border-btn-bg-disabled-secondary border-2',
    ghost:
      'bg-btn-bg-disabled-tertiary text-btn-on-disabled-tertiary border-transparent'
  }

  const sizeVariants = {
    default: 'text-button-01',
    small: 'text-button-02'
  }

  // BaseClass
  const cls = cx(
    'appearance-none all-center cursor-pointer border-box cursor-pointer transition outline-none py-4 px-6 transition-all duration-300 hover:brightness-90 hover:drop-shadow-sm active:brightness-80',
    !disabled && variants[type],
    disabled && variantsDisable[type],
    sizeVariants[size],
    {
      'w-full': isBlock
      // '!bg-gray15': hoverReveal
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
          color="var(--brand-highlight)"
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
