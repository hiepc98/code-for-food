// Button.stories.ts|tsx
// @ts-nocheck
import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'
import {Slider as HSlider} from './Slider.component'

export default {
  title: 'Form',
  component: HSlider,
  argTypes: {
    // checked: { type: 'boolean', defaultValue: false }
  }

} as ComponentMeta<typeof HSlider>

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof HSlider> = (args) => <HSlider {...args} />

export const Slider = Template.bind({})

Slider.args = {
  min: 0,
  max: 100,
  step: 5,
  hasTooltip: true,
  tipFormatter: (value: string) => `${value}%`
}
