/* eslint-disable react/display-name */
import React, {
  FC,
  forwardRef,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react'
import { Transition } from '@headlessui/react'
import { Icon } from '../Icon/Icon.component'
import { Icons } from '../../constants/Icons'
import ContentEditable from './ContentEditable.component'
import { NumericFormat } from 'react-number-format'
import { cx, getLength } from '@wallet/utils'
import { useDeepCompareEffect } from 'react-use'
import { get } from 'lodash'
interface Action {
  icon: (typeof Icons)[number]
  action?: () => any
  className?: string
}

export enum TypeInput {
  Text = 'text',
  Number = 'number'
}

interface IInput extends React.ComponentPropsWithRef<'input'> {
  label?: string | ReactNode
  labelType?: 'normal' | 'primary'
  value?: string
  placeholder?: string
  status?: 'error' | 'success' | 'normal'
  colorInput?: string

  textarea?: boolean
  rows?: number
  caption?: string | Element | ReactNode
  isBlock?: boolean
  isAllowClear?: boolean
  isPastable?: boolean
  isAuto?: boolean

  right?: Action | Action[]
  left?: Action | Action[]
  typeInput?: TypeInput
  disabled?: boolean
  formatFunction?: (value: string) => string
  className?: string
  isAnim?: boolean
  decimalScale?: number

  maxNum?: number
  maxNumberDecimal?: number
}

const BoxAction: React.FC<Action> = ({ icon, action, className }) => {
  const onClickAction = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    e.preventDefault()
    action && action()
  }

  return (
    <div
      className={cx(
        'cursor-pointer all-center transition-all hover:text-yellow active:brightness-90 text-h3',
        className
      )}
      onClick={onClickAction}>
      <Icon name={icon} className="text-ui04" />
    </div>
  )
}

export const Input = forwardRef<HTMLInputElement, IInput>((props, ref) => {
  const {
    label,
    left,
    right,
    labelType = 'normal',
    value,
    placeholder,
    id = Math.random().toString(),
    isAllowClear = false,
    caption,
    status,
    isAuto = false,
    isPastable,
    textarea = false,
    onChange,
    type,
    className,
    onFocus,
    onBlur,
    formatFunction,
    decimalScale,
    typeInput = TypeInput.Text,
    colorInput,
    disabled,
    isAnim,
    maxNum,
    maxNumberDecimal,
    ...rest
  } = props
  const cls = cx(
    'bg-transparent transition-all outline-none border-none text-sm w-full flex items-end gap-2'
  )

  const [state, setState] = useState({
    isShow: false,
    isFocus: false,
    valueInput: ''
  })

  const activeRef = ref || useRef(null)
  const isFirst = useRef<boolean>(true)
  const timer = useRef<any>(null)

  const captionRef = useRef<HTMLDivElement>()

  const Actions: FC<{ action?: Action | Action[] }> = ({ action }) => {
    if (!action) return null

    if (Array.isArray(action)) {
      return (
        <div className="flex gap-2">
          {action.map((act, index) => {
            return (
              <BoxAction
                key={index}
                {...act}
                action={() => {
                  // @ts-ignore
                  activeRef.current.focus()
                  if (act) {
                    // @ts-expect-error
                    act?.action()
                  }
                }}
              />
            )
          })}
        </div>
      )
    }
    return (
      <BoxAction
        {...action}
        action={() => {
          // @ts-ignore
          activeRef.current.focus()
          if (action) {
            // @ts-expect-error
            action?.action()
          }
        }}
      />
    )
  }

  const onPasteValue = async () => {
    try {
      onChange &&
        onChange({
          target: {
            // @ts-expect-error
            value: await navigator.clipboard.readText()
          }
        } as unknown as React.ChangeEvent<HTMLInputElement>)
    } catch (e) {
      console.log({ e })
      // @ts-expect-error
      activeRef.current.focus()
      setTimeout(() => {
        // @ts-expect-error
        document.execCommand('paste')
      }, 0)
    }
  }

  const onClearData = () => {
    onChange &&
      onChange({
        target: {
          value: ''
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>)
  }

  const renderPastable = () => {
    if (!isPastable || value) return null
    return (
      <div
        className="cursor-pointer text-primary text-base hover:opacity-50"
        onClick={onPasteValue}>
        Paste
      </div>
    )
  }

  const renderClearable = () => {
    if (!isAllowClear) return null

    if (value && value.length > 0) {
      return (
        <div
          className={cx(
            'cursor-pointer text-primary text-base mt-auto hover:opacity-50'
          )}
          onClick={onClearData}>
          Clear
        </div>
      )
    }

    return null
  }

  const onRevealOrHide = () => {
    setState((state) => ({ ...state, isShow: !state.isShow }))
  }

  const PasswordReveal = () => {
    if (type === 'password') {
      return (
        <BoxAction
          icon={state.isShow ? 'eye_on' : 'eye_off'}
          action={onRevealOrHide}
        />
      )
    }
    return null
  }

  const onInputFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setState((state) => ({ ...state, isFocus: true }))
    onFocus && onFocus(e)
  }

  const onInputBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setState((state) => ({ ...state, isFocus: false }))
    onBlur && onBlur(e)
  }

  const renderType = useMemo(() => {
    if (type === 'password' && state.isShow) {
      return 'text'
    }

    return type
  }, [type, state.isShow])

  const onChangeNumber = (value: string) => {
    setState((state) => ({ ...state, valueInput: value }))
    onChange &&
      onChange({
        target: {
          value
        }
      } as unknown as React.ChangeEvent<HTMLInputElement>)
  }

  const validateNumInput = (value: any) => {
    try {
      const floatValue = value.floatValue || ''
      const amount = floatValue.toString()
      const valueInputSplit = amount.split('.')
      const numberInt = valueInputSplit[0]
      const numberDecimal = valueInputSplit[1]

      if (
        getLength(numberInt) > 11 ||
        getLength(numberDecimal) > maxNumberDecimal
      ) {
        return false
      }
      if (Number(amount) >= maxNum) {
        return false
      }

      return true
    } catch (e) {
      return false
    }
  }

  const renderValue =
    !state.isFocus && formatFunction ? formatFunction(value || '') : value

  const renderInput = () => {
    if (textarea) {
      return (
        <textarea
          ref={activeRef}
          placeholder={placeholder}
          className={cx(
            'w-full outline-none bg-transparent flex-1 placeholder:text-ui02 placeholder:text-base resize-none text-base text-ui04',
            className
          )}
          onChange={onChange}
          value={value}
          {...rest}
        />
      )
    }
    if (isAuto) {
      return (
        <ContentEditable
          ref={activeRef}
          value={value}
          placeholder={placeholder}
          className={cx(
            type === 'password' && !state.isShow && 'security-text',
            'text-base',
            className
          )}
          onChange={onChange}
          {...rest}
        />
      )
    }
    if (typeInput === TypeInput.Number) {
      return (
        <NumericFormat
          onValueChange={(event) => onChangeNumber(event.value)}
          placeholder={placeholder}
          allowNegative={false}
          thousandSeparator=","
          decimalScale={decimalScale}
          isAllowed={validateNumInput}
          className={cx(
            'text-base w-full outline-none bg-transparent text-ui04 flex-1 placeholder:text-ui02 placeholder:text-base',
            className
          )}
          id={id}
          value={value}
          disabled={disabled}
        />
      )
    }
    return (
      <input
        onFocus={onInputFocus}
        onBlur={onInputBlur}
        ref={activeRef}
        id={id}
        value={renderValue}
        placeholder={placeholder}
        className={cx(
          'text-base w-full outline-none bg-transparent flex-1 text-ui04 placeholder:text-ui02 placeholder:text-base',
          className
        )}
        onChange={onChange}
        type={renderType}
        {...rest}
      />
    )
  }

  useDeepCompareEffect(() => {
    // console.log('test',isFirst.current)
    if (caption && captionRef.current && isAnim) {
      // @ts-expect-error
      captionRef.current.classList.remove('shaking')
      setTimeout(() => {
        // @ts-expect-error
        captionRef.current.classList.add('shaking')
      }, 50)
    }
  }, [caption])

  return (
    <>
      <div
        className={cx(
          `w-full block bg-ui01 rounded-xl p-3 mb-2 border-[1px] border-ui02 ${className}`,
          {
            'border-red': status === 'error'
          }
        )}>
        {label && (
          <label
            htmlFor={id}
            className={cx('block flex justify-between items-center mb-3', {
              'text-yellow': labelType === 'primary',
              'text-ui04': labelType === 'normal'
            })}>
            <span className={cx("text-[14px] leading-[16px]", {
              "text-tx-secondary": value
            })}>{label}</span>
            <Actions action={right} />
          </label>
        )}

        <div className={cx(cls, colorInput && colorInput)}>
          <Actions action={left} />

          {renderInput()}

          {renderPastable()}
          {renderClearable()}
          <PasswordReveal />
        </div>
      </div>
      <Transition
        show={!!caption}
        // @ts-expect-error
        ref={captionRef}
        appear={true}
        enter="transition-all duration-300"
        enterFrom="opacity-0 "
        enterTo="opacity-100"
        leave="transition-all duration-300"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        className={cx('text-tiny max-w-[80/100]', {
          'text-red': status === 'error',
          'text-green truncate': status === 'success'
        })}>
        {caption ?? ''}
      </Transition>
    </>
  )
})

Input.displayName = 'Input'
