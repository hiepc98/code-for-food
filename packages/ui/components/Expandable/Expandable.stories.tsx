import React from 'react'

import { ComponentStory, ComponentMeta } from '@storybook/react'
import { Expandable as CExpandable } from './Expandable.component'

export default {
  title: 'Expandable',
  component: CExpandable,
  argTypes: {
    checked: { type: 'boolean', defaultValue: false }
  }
} as ComponentMeta<typeof CExpandable>

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof CExpandable> = (args) => <CExpandable {...args} />

export const ExpandableCard = Template.bind({})

ExpandableCard.args = {
  type: 'card',
  title: 'Ví số 1',
  content: (
    <div>
      h1 <br />
      h1 <br />
      h1 <br />
      h1 <br />
    </div>
  )
}

export const ExpandableBlock = Template.bind({})

ExpandableBlock.args = {
  type: 'block',
  title: 'NFT Name + image',
  content: (
    <div className='grid grid-cols-2 gap-3'>
      <div className='flex items-center justify-center bg-red p-5'>
        NFT 1
      </div>

      <div className='flex items-center justify-center bg-red p-5'>
        NFT 2
      </div>

      <div className='flex items-center justify-center bg-red p-5'>
        NFT 3
      </div>

      <div className='flex items-center justify-center bg-red p-5'>
        NFT 4
      </div>
    </div>
  )
}
