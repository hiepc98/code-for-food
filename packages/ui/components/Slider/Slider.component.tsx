import React, { FC } from 'react'
import HSlider, { SliderProps } from 'rc-slider'
import 'rc-slider/assets/index.css'

const TooltipSlider = HSlider.createSliderWithTooltip(HSlider)

interface ISlider extends SliderProps {
  hasTooltip?: boolean
  height?: number
  step?: number
  tipFormatter?: (val: number | string) => React.ReactNode
  onChange?: (val: string | number) => void
}

export const Slider: React.FC<ISlider> = ({ hasTooltip = false, height = 5, step, onChange, ...rest }) => {
  const RenderSlider = hasTooltip ? TooltipSlider : HSlider

  const handleChange = (val: string | number) => {
    if (typeof onChange === 'function') {
      onChange(val)
    }
  }

  return (
    <div className="ranger-slider">
      <RenderSlider
        defaultValue={0}
        step={step}
        trackStyle={{ backgroundColor: 'var(--primary)', height }}
        onChange={handleChange}
        handleStyle={{
          borderColor: 'var(--primary)',
          boxShadow: 'none',
          height: 16,
          width: 16,
          opacity: 1,
          marginTop: -5,
          backgroundColor: 'var(--primary)'
        }}
        railStyle={{ backgroundColor: 'var(--ui02)', height }}

        {...rest}
      />
    </div>
  )
}
