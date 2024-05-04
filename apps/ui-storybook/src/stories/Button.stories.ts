import type { Meta, StoryObj } from '@storybook/react';


import { Button } from '@wallet/ui/components/Button/Button.component'

// More on how to set up stories at: https://storybook.js.org/docs/react/writing-stories/introduction
const meta = {
  title: 'Example/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    type: { control: "select", options: ['primary', 'blue', 'orange', 'green', 'red'] },
    outline: { control: "boolean" },
    isBlock: { control: "boolean" },
    isLoading: { control: "boolean" },
    disabled: {control:"boolean", defaultValue:false}
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/react/writing-stories/args
export const Primary: Story = {
  args: {
    label: "Primary",
    isLoading:false
  },
};