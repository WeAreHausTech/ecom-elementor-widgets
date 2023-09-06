import { CurrencyCode, PriceRange, SinglePrice } from '@/gql/graphql'

export const getPrice = (priceWithTax: PriceRange | SinglePrice) => {
  if (priceWithTax == null) {
    return null
  }
  if (typeof priceWithTax === 'number') {
    return priceWithTax
  }
  if ('value' in priceWithTax) {
    return priceWithTax.value
  }
  if (priceWithTax.min === priceWithTax.max) {
    return priceWithTax.min
  }
}

export const formatPrice = (value: number, currency: CurrencyCode, fromPrice?: boolean) => {
  //TODO use currency ('sv-SE') from context
  return `${fromPrice ? 'Från' : ''} ${new Intl.NumberFormat('sv-SE', {
    style: 'currency',
    currency,
  }).format(value / 100)}`
}
