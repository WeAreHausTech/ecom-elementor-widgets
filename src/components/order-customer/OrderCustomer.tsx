import { ReactNode } from 'react'
import { SET_CUSTOMER_FOR_ORDER } from '@/providers/vendure/checkout/checkout'
import { CreateCustomerInput } from '@/gql/graphql'
import { CustomHTMLElement, GenericApolloError, Loading } from '@/types'
import { useCustomMutation } from '@/hooks/useCustomMutation'

export interface OrderCustomerProps extends CustomHTMLElement {
  children: (props: {
    loading: Loading<'order:updateCustomer'>
    error: GenericApolloError
    update: (adress: CreateCustomerInput) => void
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
    updateCustomer({ variables: { input: customer } })
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
