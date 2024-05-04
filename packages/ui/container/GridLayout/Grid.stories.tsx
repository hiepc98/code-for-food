// Button.stories.ts|tsx

import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'
import GridLayout from './Grid.layout'

export default {
  title: 'Layout',
  component: GridLayout,
  argTypes: {
    // checked: { type: 'boolean', defaultValue: false }
  }
} as ComponentMeta<typeof GridLayout>

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof GridLayout> = (args) => <GridLayout {...args} />

export const Grid = Template.bind({})
