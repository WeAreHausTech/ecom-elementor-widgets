import { CurrencyCode, PriceRange, SinglePrice } from '@/gql/graphql.ts'
import { CustomHTMLElement } from '@/types'
import { formatPrice, getPrice } from '@/utils/utils'
import { ReactNode } from 'react'

export interface PriceProps extends CustomHTMLElement {
  price: PriceRange | SinglePrice | number
  priceWithTax: PriceRange | SinglePrice | number
  currencyCode: CurrencyCode
  multiplier?: number
  withTax?: boolean
  children: (props: { formattedPrice?: string }) => ReactNode
}

export const Price = ({
  wrapperTag: Wrapper = 'div',
  price,
  priceWithTax,
  currencyCode,
  withTax = false,
  children,
  ...rest
}: PriceProps) => {
  const activePrice = withTax ? priceWithTax : price
  const fromPrice =
    typeof activePrice === 'object' &&
    'min' in activePrice &&
    'max' in activePrice &&
    activePrice.min !== activePrice.max

  const formattedPrice = formatPrice(getPrice(activePrice), currencyCode, fromPrice)

  // TODO: Price should render formatted price instead of passing it to children
  return <Wrapper {...rest}>{children({ formattedPrice })}</Wrapper>
}
