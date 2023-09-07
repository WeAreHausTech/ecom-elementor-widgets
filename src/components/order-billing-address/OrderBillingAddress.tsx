import { ReactNode } from 'react'
import {
  UPDATE_BILLING_ADDRESS,
  ACTIVE_ORDER_BILLING_ADDRESS,
  ORDER_ADDRESS_FRAGMNENT,
} from '@/providers/vendure/checkout/checkout'
import { CreateAddressInput } from '@/gql/graphql'
import { ApolloError, useMutation, useQuery } from '@apollo/client'
import { getFragmentData } from '@/gql'
import { CustomHTMLElement, Loading } from '@/types'

interface BillingAddressProp extends CustomHTMLElement {
  children: (props: {
    update: (adress: CreateAddressInput) => void
    savedData: CreateAddressInput | null
    error: ApolloError | undefined
    loading: Loading
  }) => ReactNode
}

export const OrderBillingAddress = ({
  wrapperTag: Wrapper = 'div',
  children,
  ...rest
}: BillingAddressProp) => {
  const {
    error: billingError,
    data: billingData,
    loading: loadingBillingData,
  } = useQuery(ACTIVE_ORDER_BILLING_ADDRESS)

  const savedData =
    (getFragmentData(
      ORDER_ADDRESS_FRAGMNENT,
      billingData?.activeOrder?.billingAddress,
    ) as CreateAddressInput) ?? null

  const [updateAddress, { error: updateAddressError, loading: loadingUpdatingAddress }] =
    useMutation(UPDATE_BILLING_ADDRESS)

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
