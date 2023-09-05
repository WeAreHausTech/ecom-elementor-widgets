import { Meta, StoryObj } from '@storybook/react'

import { Product } from './Product'
import { CurrencyCode } from '@/gql/graphql'

const meta = {
  title: 'Products/Product',
  component: Product,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    thumbnailSize: { control: ['number', 'number'] },
  },
} satisfies Meta<typeof Product>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    thumbnailSize: [200, 200],
    product: {
      productId: '1',
      productName: 'Product 1',
      slug: 'product-1',
      productVariantId: '1',
      description: 'Product 1 description',
      score: 1,
      price: { value: 100 },
      priceWithTax: { value: 100 },
      currencyCode: CurrencyCode.Eur,
      productAsset: {
        id: '1',
        preview:
          'https://demo.vendure.io/assets/preview/b8/kelly-sikkema-685291-unsplash__preview.jpg',
      },
    },
  },
  argTypes: {
    thumbnailSize: { control: 'array' },
  },
}
