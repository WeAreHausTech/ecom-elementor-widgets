import { CurrencyCode, ListedOrderLinesFragment, ListedProductFragment } from '@/gql/graphql.ts'
import { ReactNode } from 'react'

interface PriceProps {
  className?: string
  product: ListedProductFragment | ListedOrderLinesFragment
  children: (props: { formattedPrice?: string }) => ReactNode
}

export const Price = ({ className, product, children }): PriceProps => {
  //TODO where to get showTax from?
  const showTax = true

  const priceWithTax =
    product.__typename === 'OrderLine'
      ? product.productVariant.priceWithTax
      : showTax
      ? product.priceWithTax
      : product.price
  const currencyCode =
    product.__typename === 'OrderLine' ? product.productVariant.currencyCode : product.currencyCode

  if (priceWithTax === null || !currencyCode) {
    return <></>
  }

  let formattedPrice = null
  if (typeof priceWithTax === 'number') {
    formattedPrice = formatPrice(priceWithTax, currencyCode)
  } else if ('value' in priceWithTax) {
    formattedPrice = formatPrice(priceWithTax.value, currencyCode)
  } else if (priceWithTax.min === priceWithTax.max) {
    formattedPrice = `${formatPrice(priceWithTax.min, currencyCode)}`
  } else {
    //TODO: Translate "Från"
    formattedPrice = `Från ${formatPrice(priceWithTax.min, currencyCode)}`
  }

  return <div className={className}>{children({ formattedPrice })}</div>
}

export function formatPrice(value: number, currency: CurrencyCode) {
  //TODO use currency ('sv-SE') from context
  return new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency,
  }).format(value / 100)
}
