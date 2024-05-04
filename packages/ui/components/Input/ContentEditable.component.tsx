import React, { forwardRef, useState } from 'react'
import { cx } from '@wallet/utils'

interface IContentEditable extends React.HTMLAttributes<HTMLDivElement> {
  value?: string
  placeholder?: string
  disabled?: boolean
  readOnly?: boolean
}

const ContentEditable = forwardRef<HTMLInputElement, IContentEditable>(({ value, placeholder, onChange, disabled, readOnly, className, onClick,...rest }, ref) => {
  const [state, setState] = useState({
    isFocus: false,
    defaultValue: ''
  })

  const onInput = (e: React.ChangeEvent<HTMLDivElement>): any => {
    if (onChange) {
      // @ts-expect-error
      onChange({ target: { value: e.target.outerText } } as Event)
    }

    setState((state) => ({ ...state, defaultValue: e.target.outerText }))
  }

  const onFocusInput = (e: React.FocusEvent<HTMLDivElement>): any => {
    setState((state) => ({ ...state, isFocus: true }))
    if (rest.onFocus) {
      rest.onFocus(e)
    }
  }

  const onBlurInput = (e: React.FocusEvent<HTMLDivElement>): any => {
    setState(state => ({ ...state, isFocus: false }))
    if (rest.onBlur) {
      rest.onBlur(e)
    }
  }

  const onPaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault()
    // @ts-ignore
    const text = (e.originalEvent || e).clipboardData.getData('text/plain')

    if (document.queryCommandSupported('insertText')) {
      document.execCommand('insertText', false, text)
    } else {
      // Insert text at the current position of caret
      const range = document.getSelection().getRangeAt(0)
      range.deleteContents()

      const textNode = document.createTextNode(text)
      range.insertNode(textNode)
      range.selectNodeContents(textNode)
      range.collapse(false)

      const selection = window.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
    }
  }

  const renderValue = value || state.defaultValue

  return (
    <>
        <div suppressContentEditableWarning className={cx("outline-none whitespace-pre-wrap break-word flex-1 break-words", className)} contentEditable={!readOnly && !disabled} onInput={onInput} onFocus={onFocusInput} onBlur={onBlurInput} onPaste={onPaste} onClick={onClick}>
            {!renderValue && !state.isFocus && <span className='text-gray4 text-xs'>{placeholder}</span>}
            {value}
        </div>
        <input type="hidden" ref={ref} value={renderValue} {...rest}/>
    </>
  )
})

ContentEditable.displayName = 'ContentEditable'

export default ContentEditable
