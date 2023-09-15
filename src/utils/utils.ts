import { CurrencyCode, ErrorCode, ErrorResult, PriceRange, SinglePrice } from '@/gql/graphql'
import { GenericApolloError } from '@/types'
import { ApolloError } from '@apollo/client'
import { some } from 'lodash'

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

export const isErrorResult = (input: unknown): boolean => {
  return some((input as object), (i) => {
    return i && (i as ErrorResult).errorCode !== undefined
  })
}

export const isApolloError = (input: unknown): input is ApolloError => {
  return !!(input && (input as ApolloError).graphQLErrors !== undefined)
}

export const isError = (input: unknown): input is GenericApolloError => {
  return isErrorResult(input) || isApolloError(input)
}

export const getError = (error: GenericApolloError): GenericApolloError | null => {
  if (isErrorResult(error)) {
    console.log(error)
  // for (const key in (error as { [key: string]: ErrorResult })) {
  //   if ((input as { [key: string]: ErrorResult })[key].hasOwnProperty('errorCode')) {
  //     return 
  //     break;
  //   }
  // }
    return error
  } else if (isApolloError(error)) {
    return {
      errorCode: ErrorCode.UnknownError,
      message: 'Unknown error',
    }
  }
  return null
}
