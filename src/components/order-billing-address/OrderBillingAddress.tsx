import { ReactNode } from 'react'
import {
  UPDATE_BILLING_ADDRESS,
  ACTIVE_ORDER_BILLING_ADDRESS,
  ORDER_ADDRESS_FRAGMNENT,
} from '@/providers/vendure/checkout/checkout'
import { CreateAddressInput } from '@/gql/graphql'
import { getFragmentData } from '@/gql'
import { CustomHTMLElement, GenericApolloError, Loading } from '@/types'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { useCustomMutation } from '@/hooks/useCustomMutation'

export interface OrderBillingAddressProps extends CustomHTMLElement {
  children: (props: {
    update: (adress: CreateAddressInput) => void
    savedData: CreateAddressInput | null
    error: GenericApolloError
    loading: Loading<'order:fetchBillingAddress' | 'order:updateBillingAddress'>
  }) => ReactNode
}

export const OrderBillingAddress = ({
  wrapperTag: Wrapper = 'div',
  children,
  ...rest
}: OrderBillingAddressProps) => {
  const {
    error: billingError,
    data: billingData,
    loading: loadingBillingData,
  } = useCustomQuery(ACTIVE_ORDER_BILLING_ADDRESS)

  const savedData =
    (getFragmentData(
      ORDER_ADDRESS_FRAGMNENT,
      billingData?.activeOrder?.billingAddress,
    ) as CreateAddressInput) ?? null

  const [updateAddress, { error: updateAddressError, loading: loadingUpdatingAddress }] =
    useCustomMutation(UPDATE_BILLING_ADDRESS)

  const update = (address: CreateAddressInput) => {
    updateAddress({ variables: { input: address } })
  }

  return (
    <Wrapper {...rest}>
      {children({
        update,
        savedData,
        loading: {
          'order:fetchBillingAddress': loadingBillingData,
          'order:updateBillingAddress': loadingUpdatingAddress,
        },
        error: billingError || updateAddressError,
      })}
    </Wrapper>
  )
}
