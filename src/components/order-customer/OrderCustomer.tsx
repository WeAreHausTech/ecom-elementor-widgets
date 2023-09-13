import { ReactNode, useCallback, useState } from 'react'
import { SET_CUSTOMER_FOR_ORDER } from '@/providers/vendure/checkout/checkout'
import { CreateCustomerInput, SetCustomerForOrderMutation } from '@/gql/graphql'
import { CustomHTMLElement, GenericApolloError, Loading } from '@/types'
import { useCustomMutation } from '@/hooks/useCustomMutation'
import { FetchResult } from '@apollo/client'

interface OrderCustomerProp extends CustomHTMLElement {
  children: (props: {
    loading: Loading<'order:updateCustomer'>
    error: GenericApolloError
    formData: CreateCustomerInput | null
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    updateCustomer: () => Promise<FetchResult<SetCustomerForOrderMutation>>
  }) => ReactNode
}

export const OrderCustomer = ({
  wrapperTag: Wrapper = 'div',
  children,
  ...rest
}: OrderCustomerProp) => {
  const [formData, setFormData] = useState<CreateCustomerInput>({
    firstName: '',
    lastName: '',
    emailAddress: '',
    phoneNumber: '',
  })

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const [updateCustomer, { error: updateCustomerError, loading: loadingUpdatingCustomer }] =
    useCustomMutation(SET_CUSTOMER_FOR_ORDER, {
      variables: { input: formData },
    })

  return (
    <Wrapper {...rest}>
      {children({
        loading: {
          'order:updateCustomer': loadingUpdatingCustomer,
        },
        error: updateCustomerError,
        formData,
        handleChange,
        updateCustomer
      })}
    </Wrapper>
  )
}
