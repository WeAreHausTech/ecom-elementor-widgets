import { ReactNode, useState, useCallback } from 'react'
import {
  ELIGIBLE_ORDER_SHIPPING_METHODS,
  ELIGIBLE_ORDER_SHIPPING_METHODS_FRAGMNENT,
} from '@/providers/vendure/checkout/checkout'
import { EligibleShippingMethodsFragment, SetOrderShippingMethodMutation } from '@/gql/graphql'
import { getFragmentData } from '@/gql'
import { CustomHTMLElement, GenericApolloError, Loading } from '@/types'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { useCustomMutation } from '@/hooks/useCustomMutation'
import { FetchResult } from '@apollo/client'
import { SET_ORDER_SHIPPING_METHOD } from '@/providers/vendure/order/order'

export interface ShippingMethodsProps extends CustomHTMLElement {
  children: (props: {
    eligibleShippingMethods: readonly EligibleShippingMethodsFragment[] | null
    loading: Loading<'shipping:fetchshippingMethods' | 'shipping:updatingshipping'>
    error: GenericApolloError
    setSelectedshippingMethod: (method: string) => void
    updateShippingMethod: () => Promise<FetchResult<SetOrderShippingMethodMutation> | undefined>
    selectedshippingMethod: string | null
  }) => ReactNode
}

export const ShippingMethod = ({
  wrapperTag: Wrapper = 'div',
  children,
  ...rest
}: ShippingMethodsProps) => {
  const [selectedshippingMethod, setSelectedshippingMethod] = useState<string | null>(null)

  const {
    loading: shippingMethodLoading,
    error: shippingMethodError,
    data: shippingMethodData,
  } = useCustomQuery(ELIGIBLE_ORDER_SHIPPING_METHODS)

  const eligibleShippingMethods =
    getFragmentData(
      ELIGIBLE_ORDER_SHIPPING_METHODS_FRAGMNENT,
      shippingMethodData?.eligibleShippingMethods,
    ) ?? null

  const [
    updateShippingMethodFunc,
    { error: updateshippingError, loading: updatingshippingLoading },
  ] = useCustomMutation(SET_ORDER_SHIPPING_METHOD)

  const updateShippingMethod = useCallback(async () => {
    if (!selectedshippingMethod) return

    return updateShippingMethodFunc({
      variables: { shippingMethodId: selectedshippingMethod },
    })
  }, [selectedshippingMethod, updateShippingMethodFunc])

  return (
    <Wrapper {...rest}>
      {children({
        loading: {
          'shipping:fetchshippingMethods': shippingMethodLoading,
          'shipping:updatingshipping': updatingshippingLoading,
        },
        error: shippingMethodError || updateshippingError,
        eligibleShippingMethods,
        setSelectedshippingMethod,
        updateShippingMethod,
        selectedshippingMethod,
      })}
    </Wrapper>
  )
}
