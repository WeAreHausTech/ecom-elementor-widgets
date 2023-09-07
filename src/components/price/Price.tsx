import { CurrencyCode, PriceRange, SinglePrice } from '@/gql/graphql.ts'
import { CustomHTMLElement } from '@/types'
import { formatPrice, getPrice } from '@/utils/utils'
import { ReactNode } from 'react'

interface PriceProps extends CustomHTMLElement {
  price: PriceRange | SinglePrice
  priceWithTax: PriceRange | SinglePrice
  currencyCode: CurrencyCode
  children: (props: { formattedPrice?: string }) => ReactNode
}

// TODO: where to get showTax from?
const showTax = true

export const Price = ({
  wrapperTag: Wrapper = 'div',
  price,
  priceWithTax,
  currencyCode,
  children,
  ...rest
}: PriceProps) => {
  const activePrice = showTax ? priceWithTax : price
  const fromPrice =
    typeof activePrice === 'object' &&
    'min' in activePrice &&
    'max' in activePrice &&
    activePrice.min !== activePrice.max

  const formattedPrice = formatPrice(getPrice(activePrice), currencyCode, fromPrice)

  return <Wrapper {...rest}>{children({ formattedPrice })}</Wrapper>
}
