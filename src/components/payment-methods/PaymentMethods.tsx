import { ReactNode, useCallback, useEffect, useState } from 'react'
import {
  ELIGIBLE_PAYMENT_METHODS,
  ELIGIBLE_PAYMENT_METHODS_FRAGMNENT,
} from '@/providers/vendure/payment/payment'
import { AddPaymentToOrderMutation, EligiblePaymentMethodsFragment } from '@/gql/graphql'
import { getFragmentData } from '@/gql'
import { CustomHTMLElement, GenericApolloError, Loading } from '@/types'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { useCustomMutation } from '@/hooks/useCustomMutation'
import { FetchResult } from '@apollo/client'
import { ADD_PAYMENT_TO_ORDER } from '@/providers/vendure/order/order'

export interface PaymentMethodsProps extends CustomHTMLElement {
  paymentMethod?: string | null
  children: (props: {
    eligiblePaymentMethods: readonly EligiblePaymentMethodsFragment[] | null
    loading: Loading<'payment:fetchPaymentMethods' | 'payment:updatingPayment'>
    error: GenericApolloError
    setSelectedPaymentMethod: (method: string) => void
    updatePaymentMethod: () => Promise<FetchResult<AddPaymentToOrderMutation> | undefined>
  }) => ReactNode
}

export const PaymentMethods = ({
  wrapperTag: Wrapper = 'div',
  paymentMethod = null,
  children,
  ...rest
}: PaymentMethodsProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null)

  const {
    loading: paymentMethodLoading,
    error: paymentMethodError,
    data: paymentMethodData,
  } = useCustomQuery(ELIGIBLE_PAYMENT_METHODS)

  const eligiblePaymentMethods =
    getFragmentData(
      ELIGIBLE_PAYMENT_METHODS_FRAGMNENT,
      paymentMethodData?.eligiblePaymentMethods,
    ) ?? null

  const [updatePaymentMethodFunc, { error: updatepaymentError, loading: updatingPaymentLoading }] =
    useCustomMutation(ADD_PAYMENT_TO_ORDER)

  const updatePaymentMethod = useCallback(async () => {
    if (!selectedPaymentMethod) return

    return updatePaymentMethodFunc({
      variables: { input: { method: selectedPaymentMethod, metadata: {} } },
    })
  }, [selectedPaymentMethod, updatePaymentMethodFunc])

  useEffect(() => {
    if (
      paymentMethod &&
      eligiblePaymentMethods &&
      eligiblePaymentMethods.find((method) => method.code === 'pre-payment')
    ) {
      setSelectedPaymentMethod('pre-payment')
    }
  }, [eligiblePaymentMethods, paymentMethod])

  return (
    <Wrapper {...rest}>
      {children({
        loading: {
          'payment:fetchPaymentMethods': paymentMethodLoading,
          'payment:updatingPayment': updatingPaymentLoading,
        },
        error: paymentMethodError || updatepaymentError,
        eligiblePaymentMethods,
        setSelectedPaymentMethod,
        updatePaymentMethod,
      })}
    </Wrapper>
  )
}
