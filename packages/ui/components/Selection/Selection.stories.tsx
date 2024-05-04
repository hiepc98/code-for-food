// Button.stories.ts|tsx

import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'
import {Selection as CSelection} from './Selection.component'

export default {
  title: 'Form',
  component: CSelection
} as ComponentMeta<typeof CSelection>

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof CSelection> = (args) => <CSelection {...args} />

export const Selection = Template.bind({})

Selection.args = {
  placeholder: 'Select',
  items: [
    {
      title: 'Chain 1',
      value: 'Chain 1'
    },
    {
      title: 'Chain 2',
      value: 'Chain 2'
    },
    {
      title: 'Chain 3',
      value: 'Chain 3'
    },
    {
      title: 'Chain 4',
      value: 'Chain 4'
    }
  ]
}
