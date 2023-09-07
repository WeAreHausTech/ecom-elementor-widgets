import { ApolloError, useMutation } from '@apollo/client'
import { UPDATE_ORDER_CUSTOM_FIELDS } from '@/providers/vendure/checkout/checkout'
import { ReactNode, useState } from 'react'
import { CustomHTMLElement, Loading } from '@/types'

interface OrderMessageProps extends CustomHTMLElement {
  children: (props: {
    message: string
    loading: Loading
    error: ApolloError | undefined
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
  const [addMessage, { error, loading }] = useMutation(UPDATE_ORDER_CUSTOM_FIELDS)

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
