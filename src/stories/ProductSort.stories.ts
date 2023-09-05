import { Meta, StoryObj } from '@storybook/react'

import { ProductSort } from './ProductSort'

const meta = {
  title: 'Products/ProductSort',
  component: ProductSort,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} as Meta<typeof ProductSort>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
