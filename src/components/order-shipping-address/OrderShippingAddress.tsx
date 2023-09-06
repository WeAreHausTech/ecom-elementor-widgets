import { ReactNode, useCallback, useState } from 'react'
import {
  UPDATE_SHIPPING_ADDRESS,
  ACTIVE_ORDER_SHIPPING_ADDRESS,
  ORDER_ADDRESS_FRAGMNENT,
} from '@/providers/vendure/checkout/checkout'
import { CreateAddressInput, OrderAddress } from '@/gql/graphql'
import { useMutation, useQuery } from '@apollo/client'
import { getFragmentData } from '@/gql'
import { CustomHTMLElement } from '@/types'
import { map, omit } from 'lodash'

interface ShippingAddressProps extends CustomHTMLElement {
  children: (props: {
    loading: boolean
    formData: OrderAddress | null
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    isError: boolean
    success: boolean
  }) => ReactNode
}

export const OrderShippingAddress = ({
  wrapperTag: Wrapper = 'div',
  children,
  ...rest
}: ShippingAddressProps) => {
  let success = false
  let isError = false

  const [formData, setFormData] = useState<OrderAddress | null>(null)

  const { loading, error: shippingError, data: shippingData } = useQuery(ACTIVE_ORDER_SHIPPING_ADDRESS)

  const savedData =
    getFragmentData(ORDER_ADDRESS_FRAGMNENT, shippingData?.activeOrder?.shippingAddress) ?? null

  if (!formData && savedData) {
    const initialValues = map(omit(savedData, ['__typename', 'country']), (value, key) => ({ [key]: value ?? '' })).reduce(
      (acc, cur) => ({ ...acc, ...cur }),
      {} as CreateAddressInput
    )

    setFormData(initialValues)
  }

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const [updateAddress, { error, data }] = useMutation(UPDATE_SHIPPING_ADDRESS)

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      updateAddress({ variables: { input: formData as CreateAddressInput } })
    },
    [formData, updateAddress]
  )

  if (data) {
    success = true
  }

  if (error || shippingError) {
    isError = true
  }

  return <Wrapper {...rest}>{children({ loading, formData, handleChange, handleSubmit, success, isError })}</Wrapper>
}
