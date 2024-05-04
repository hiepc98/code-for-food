// Button.stories.ts|tsx

import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'
import {Switch as CSwitch} from './Switch.component'

export default {
  title: 'Form',
  component: CSwitch,
  argTypes: {
    checked: { type: 'boolean', defaultValue: false }
  }
} as ComponentMeta<typeof CSwitch>

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof CSwitch> = (args) => <CSwitch {...args} />

export const Switch = Template.bind({})
