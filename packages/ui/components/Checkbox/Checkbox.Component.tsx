import { cx } from '@wallet/utils'
import { Icon } from '../Icon/Icon.component'
import React, { FC, HTMLAttributes, useEffect, useState } from 'react'
interface CheckboxProps extends HTMLAttributes<HTMLInputElement>{
    disabled?: boolean
    checked?: boolean
    children?: React.ReactChild
    onChangeValue?: (isChecked: boolean) => any
}
export const Checkbox: FC<CheckboxProps> = ({onChangeValue, children,...props}) => {

    const [isChecked, setIsChecked] = useState<boolean>(!!props.checked)
    
    const onChangeEvent = () => {
        setIsChecked(prev => !prev)
    }
    
    useEffect(()=>{
        onChangeValue && onChangeValue(!!isChecked)
    },[isChecked])

    return (    
        <div onClick={onChangeEvent} className='cursor-pointer flex items-start'>
            <div className='mt-1'>
                <div className={cx("w-5 h-5 border-2 border-ui04 text-white all-center transition-all ease-in-out", {
                    'border-ui02': props.disabled,
                    'bg-primary border-primary': isChecked
                })}>
                    {isChecked && <Icon name="check"/>}
                    <input checked={isChecked} {...props} readOnly className="hidden"/>
                </div>
            </div>
            {children}
        </div>
    )
}
