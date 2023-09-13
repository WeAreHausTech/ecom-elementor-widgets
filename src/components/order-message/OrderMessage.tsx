import { UPDATE_ORDER_CUSTOM_FIELDS } from '@/providers/vendure/checkout/checkout'
import { ReactNode, useState } from 'react'
import { CustomHTMLElement, GenericApolloError, Loading } from '@/types'
import { useCustomMutation } from '@/hooks/useCustomMutation'

export interface OrderMessageProps extends CustomHTMLElement {
  children: (props: {
    message: string
    loading: Loading<'order:updateMessage'>
    error: GenericApolloError
    setMessage: (message: string) => void
    addMessageToOrder: () => void
  }) => ReactNode
}

export const OrderMessage = ({
  wrapperTag: Wrapper = 'div',
  children,
  ...rest
}: OrderMessageProps) => {
  const [message, setMessage] = useState('')
  const [addMessage, { error, loading }] = useCustomMutation(UPDATE_ORDER_CUSTOM_FIELDS)

  //requires a custom field called CustomerMessage in vendure
  const addMessageToOrder = () => {
    addMessage({
      variables: {
        input: {
          customFields: {
            CustomerMessage: message,
          },
        },
      },
    })
  }

  return (
    <Wrapper {...rest}>
      {children({
        message,
        loading: { 'order:updateMessage': loading },
        error,
        setMessage,
        addMessageToOrder,
      })}
    </Wrapper>
  )
}
