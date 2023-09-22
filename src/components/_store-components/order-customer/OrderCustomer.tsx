import { ReactNode } from 'react'
import { CreateCustomerInput, Customer, Order, SetCustomerForOrderMutation } from '@/gql/graphql'
import { CustomHTMLElement, GenericApolloError, Loading } from '@/types'
import { useCustomMutation } from '@/hooks/useCustomMutation'
import { SET_CUSTOMER_FOR_ORDER } from '@/providers/vendure/order/order'
import { FetchResult } from '@apollo/client'
import { useActiveOrder } from '@/hooks/useActiveOrder'

export interface OrderCustomerProps extends CustomHTMLElement {
  children: (props: {
    loading: Loading<'order:updateCustomer' | 'order:fetchActiveOrder'>
    error: GenericApolloError
    update: (adress: CreateCustomerInput) => Promise<FetchResult<SetCustomerForOrderMutation>>
    savedData?: Customer | null
  }) => ReactNode
}

export const OrderCustomer = ({
  wrapperTag: Wrapper = 'div',
  children,
  ...rest
}: OrderCustomerProps) => {
  const { data, loading: loadingActiveOrder, error: activeOrderError } = useActiveOrder()
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
          'order:fetchActiveOrder': loadingActiveOrder,
        },
        error: updateCustomerError || activeOrderError,
        savedData: (data?.activeOrder as Order)?.customer,
        update,
      })}
    </Wrapper>
  )
}
