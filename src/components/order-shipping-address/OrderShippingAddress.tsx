import { ReactNode } from 'react'
import {
  UPDATE_SHIPPING_ADDRESS,
  ACTIVE_ORDER_SHIPPING_ADDRESS,
  ORDER_ADDRESS_FRAGMNENT,
} from '@/providers/vendure/checkout/checkout'
import { CreateAddressInput, OrderAddress } from '@/gql/graphql'
import { getFragmentData } from '@/gql'
import { CustomHTMLElement, GenericApolloError, Loading } from '@/types'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { useCustomMutation } from '@/hooks/useCustomMutation'

export interface OrderShippingAddressProps extends CustomHTMLElement {
  children: (props: {
    loading: Loading<'order:shippingAddress' | 'order:updatingShippingAddress'>
    error: GenericApolloError
    update: (adress: CreateAddressInput) => void
    savedData: OrderAddress | null
  }) => ReactNode
}

export const OrderShippingAddress = ({
  wrapperTag: Wrapper = 'div',
  children,
  ...rest
}: OrderShippingAddressProps) => {
  const {
    loading: loadingShippingAdress,
    error: shippingError,
    data: shippingData,
  } = useCustomQuery(ACTIVE_ORDER_SHIPPING_ADDRESS)

  const savedData =
    (getFragmentData(
      ORDER_ADDRESS_FRAGMNENT,
      shippingData?.activeOrder?.shippingAddress,
    ) as CreateAddressInput) ?? null

  const [updateAddress, { error: updateAddressError, loading: loadingUpdatingAddress }] =
    useCustomMutation(UPDATE_SHIPPING_ADDRESS)

  const update = (address: CreateAddressInput) => {
    updateAddress({ variables: { input: address } })
  }

  return (
    <Wrapper {...rest}>
      {children({
        update,
        savedData,
        loading: {
          'order:shippingAddress': loadingShippingAdress,
          'order:updatingShippingAddress': loadingUpdatingAddress,
        },
        error: shippingError || updateAddressError,
      })}
    </Wrapper>
  )
}
