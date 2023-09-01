import { ListedProductFragment } from '@/gql/graphql'

export const getPrice = (priceWithTax: number | ListedProductFragment['priceWithTax']) => {
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
