import { ReactNode } from 'react'
import {
  UPDATE_BILLING_ADDRESS,
  ACTIVE_ORDER_BILLING_ADDRESS,
  ORDER_ADDRESS_FRAGMNENT,
} from '@/providers/vendure/checkout/checkout'
import { CreateAddressInput } from '@/gql/graphql'
import { useMutation, useQuery } from '@apollo/client'
import { getFragmentData } from '@/gql'
import { CustomHTMLElement } from '@/types'

interface BillingAddressProp extends CustomHTMLElement {
  children: (props: {
    update: (adress: CreateAddressInput) => void
    savedData: CreateAddressInput | null
    isError: boolean
    success: boolean
  }) => ReactNode
}

export const OrderBillingAddress = ({
  wrapperTag: Wrapper = 'div',
  children,
  ...rest
}: BillingAddressProp) => {
  let success = false
  let isError = false

  const { error: billingError, data: billingData } = useQuery(ACTIVE_ORDER_BILLING_ADDRESS)

  const savedData =
    getFragmentData(ORDER_ADDRESS_FRAGMNENT, billingData?.activeOrder?.billingAddress) as CreateAddressInput ?? null

  const [updateAddress, { error, data }] = useMutation(UPDATE_BILLING_ADDRESS)

  if (data) {
    success = true
  }

  if (error || billingError) {
    isError = true
  }

  const update = (address: CreateAddressInput) => {
    updateAddress({ variables: { input: address } })
  }

  return <Wrapper {...rest}>{children({ update, savedData, success, isError })}</Wrapper>
}
