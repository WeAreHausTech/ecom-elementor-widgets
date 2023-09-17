import { ReactNode } from 'react'
import { CreateCustomerInput, SetCustomerForOrderMutation } from '@/gql/graphql'
import { CustomHTMLElement, GenericApolloError, Loading } from '@/types'
import { useCustomMutation } from '@/hooks/useCustomMutation'
import { SET_CUSTOMER_FOR_ORDER } from '@/providers/vendure/order/order'
import { FetchResult } from '@apollo/client'

export interface OrderCustomerProps extends CustomHTMLElement {
  children: (props: {
    loading: Loading<'order:updateCustomer'>
    error: GenericApolloError
    update: (adress: CreateCustomerInput) => Promise<FetchResult<SetCustomerForOrderMutation>>
  }) => ReactNode
}

export const OrderCustomer = ({
  wrapperTag: Wrapper = 'div',
  children,
  ...rest
}: OrderCustomerProps) => {
  const [updateCustomer, { error: updateCustomerError, loading: loadingUpdatingCustomer }] =
    useCustomMutation(SET_CUSTOMER_FOR_ORDER)

  const update = (customer: CreateCustomerInput) => {
    return updateCustomer({ variables: { input: customer } })
  }

  return (
    <Wrapper {...rest}>
      {children({
        loading: {
          'order:updateCustomer': loadingUpdatingCustomer,
        },
        error: updateCustomerError,
        update,
      })}
    </Wrapper>
  )
}
