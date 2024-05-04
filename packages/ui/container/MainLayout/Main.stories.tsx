// Button.stories.ts|tsx

import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'
import MainLayout from './Main.layout'

export default {
  title: 'Layout',
  component: MainLayout,
  argTypes: {
    // checked: { type: 'boolean', defaultValue: false }
  }
} as ComponentMeta<typeof MainLayout>

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof MainLayout> = (args) => <MainLayout {...args} />

export const Main = Template.bind({})

Main.args = {
  children: <div>Hello world</div>,
  title: 'Manage Wallet'
}
