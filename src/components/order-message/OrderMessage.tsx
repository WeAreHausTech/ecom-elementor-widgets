import { useMutation } from '@apollo/client'
import { UPDATE_ORDER_CUSTOM_FIELDS } from '@/providers/vendure/checkout/checkout'
import { ReactNode, useState } from 'react'
import { CustomHTMLElement } from '@/types'

interface OrderMessageProps extends CustomHTMLElement {
  children: (props: {
    message: string
    setMessage: (message: string) => void
    addMessageToOrder: () => void
    isError: boolean
    success: boolean
  }) => ReactNode
}

export const OrderMessage = ({
  wrapperTag: Wrapper = 'div',
  children,
  ...rest
}: OrderMessageProps) => {
  const [message, setMessage] = useState('')
  
  let success = false
  let isError = false

  const [addMessage, { error, data }] = useMutation(UPDATE_ORDER_CUSTOM_FIELDS)

  if (error) {
    isError = true
  }

  if (data) {
    success = true
  }

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

  return <Wrapper {...rest}>{children({ message, setMessage, addMessageToOrder, success, isError })}</Wrapper>
}
