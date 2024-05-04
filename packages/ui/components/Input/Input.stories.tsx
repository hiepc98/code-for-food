import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'
import {Input} from './Input.component'

export default {
  title: 'Form',
  component: Input,
  argTypes: {
    label: { control: 'text' },
    labelType: {
      options: ['normal', 'primary'],
      control: { type: 'radio' },
      defaultValue: 'normal'
    },
    value: { control: 'text', label: 'Value' },
    placeholder: { control: 'text', label: 'Placeholder', defaultValue: 'Enter your text here' },
    caption: { control: 'text' },
    status: {
      options: ['success', 'error'],
      control: { type: 'radio' }
    },
    disabled: { control: 'boolean' },
    isAuto: { control: 'boolean', defaultValue: false }
  }
} as ComponentMeta<typeof Input>

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Input> = (args) => <Input {...args} />

export const Normal = Template.bind({})

Normal.args = {
  left: {
    icon: 'app_search_left'
  },
  right: [
    {
      icon: 'app_paste'
    },
    {
      icon: 'app_show'
    }
  ]
}

export const Auto = Template.bind({})

Auto.args = {
  isAuto: true,
  right: [
    {
      icon: 'app_paste'
    },
    {
      icon: 'app_show'
    }
  ]
}
