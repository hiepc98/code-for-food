// Button.stories.ts|tsx

import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'
import PopupLayout from './Popup.layout'

export default {
  title: 'Layout',
  component: PopupLayout,
  argTypes: {
    // checked: { type: 'boolean', defaultValue: false }
  }
} as ComponentMeta<typeof PopupLayout>

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof PopupLayout> = (args) => <PopupLayout {...args} />

export const Popup = Template.bind({})
