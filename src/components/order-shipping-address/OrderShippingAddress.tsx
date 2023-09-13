import { ReactNode, useCallback, useState } from 'react'
import {
  UPDATE_SHIPPING_ADDRESS,
  ACTIVE_ORDER_SHIPPING_ADDRESS,
  ORDER_ADDRESS_FRAGMNENT,
} from '@/providers/vendure/checkout/checkout'
import { CreateAddressInput, OrderAddress } from '@/gql/graphql'
import { getFragmentData } from '@/gql'
import { CustomHTMLElement, GenericApolloError, Loading } from '@/types'
import { map, omit } from 'lodash'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { useCustomMutation } from '@/hooks/useCustomMutation'

export interface OrderShippingAddressProps extends CustomHTMLElement {
  children: (props: {
    loading: Loading<'order:shippingAddress' | 'order:updatingShippingAddress'>
    error: GenericApolloError
    formData: OrderAddress | null
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  }) => ReactNode
}

export const OrderShippingAddress = ({
  wrapperTag: Wrapper = 'div',
  children,
  ...rest
}: OrderShippingAddressProps) => {
  const [formData, setFormData] = useState<OrderAddress | null>(null)

  const {
    loading: loadingShippingAdress,
    error: shippingError,
    data: shippingData,
  } = useCustomQuery(ACTIVE_ORDER_SHIPPING_ADDRESS)

  const savedData =
    getFragmentData(ORDER_ADDRESS_FRAGMNENT, shippingData?.activeOrder?.shippingAddress) ?? null

  if (!formData && savedData) {
    const initialValues = map(omit(savedData, ['__typename', 'country']), (value, key) => ({
      [key]: value ?? '',
    })).reduce((acc, cur) => ({ ...acc, ...cur }), {} as CreateAddressInput)

    setFormData(initialValues)
  }

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const [updateAddress, { error: updateAddressError, loading: updatingAddress }] =
    useCustomMutation(UPDATE_SHIPPING_ADDRESS)

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      updateAddress({ variables: { input: formData as CreateAddressInput } })
    },
    [formData, updateAddress],
  )

  return (
    <Wrapper {...rest}>
      {children({
        loading: {
          'order:shippingAddress': loadingShippingAdress,
          'order:updatingShippingAddress': updatingAddress,
        },
        error: shippingError || updateAddressError,
        formData,
        handleChange,
        handleSubmit,
      })}
    </Wrapper>
  )
}
