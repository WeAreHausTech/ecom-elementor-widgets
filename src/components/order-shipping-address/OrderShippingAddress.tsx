import { ReactNode, useCallback, useState } from 'react'
import {
  UPDATE_SHIPPING_ADDRESS,
  ACTIVE_ORDER_SHIPPING_ADDRESS,
  ORDER_ADDRESS_FRAGMNENT,
} from '@/providers/vendure/checkout/checkout'
import { CreateAddressInput, OrderAddress } from '@/gql/graphql'
import { ApolloError, useMutation, useQuery } from '@apollo/client'
import { getFragmentData } from '@/gql'
import { CustomHTMLElement, Loading } from '@/types'
import { map, omit } from 'lodash'

interface ShippingAddressProps extends CustomHTMLElement {
  children: (props: {
    loading: Loading
    error: ApolloError | undefined
    formData: OrderAddress | null
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  }) => ReactNode
}

export const OrderShippingAddress = ({
  wrapperTag: Wrapper = 'div',
  children,
  ...rest
}: ShippingAddressProps) => {
  const [formData, setFormData] = useState<OrderAddress | null>(null)

  const {
    loading: loadingShippingAdress,
    error: shippingError,
    data: shippingData,
  } = useQuery(ACTIVE_ORDER_SHIPPING_ADDRESS)

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
    useMutation(UPDATE_SHIPPING_ADDRESS)

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
