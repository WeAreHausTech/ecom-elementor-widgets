import { CartAction, cartChannel } from '@/eventbus/channels/cart-channel'
import { getFragmentData } from '@/gql'
import { CurrencyCode, ListedOrderLinesFragment } from '@/gql/graphql'
import { useCustomMutation } from '@/hooks/useCustomMutation'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import {
  ADJUST_ORDER_LINE,
  GET_ACTIVE_ORDER,
  LISTED_ORDER_LINES_FRAGMENT,
  ORDER_DETAIL_FRAGMENT,
  REMOVE_ORDER_LINE,
} from '@/providers/vendure/order/order'
import { ChildrenProps, CustomHTMLElement } from '@/types'
import { get, isError } from 'lodash'
import { HTMLAttributes, ReactNode, useCallback, useEffect, useState } from 'react'
import { formatPrice, getPrice, renderChildren } from '@/utils/utils'
import { Price } from '@/components/_store-components/price/Price'

export interface OrderLinesProps extends CustomHTMLElement {
  itemTag?: keyof JSX.IntrinsicElements
  loadingElement?: ReactNode
  children: ChildrenProps<{
    orderLines: readonly ListedOrderLinesFragment[]
    totalPrice: string
  }>
}

export const OrderLines = ({
  wrapperTag: Wrapper = 'ul',
  loadingElement = 'Loading...',
  children,
  ...rest
}: OrderLinesProps) => {
  const { loading, error, data: activeOrderResponse, refetch } = useCustomQuery(GET_ACTIVE_ORDER)

  const activeOrder = getFragmentData(ORDER_DETAIL_FRAGMENT, activeOrderResponse?.activeOrder)
  const orderLines =
    getFragmentData(LISTED_ORDER_LINES_FRAGMENT, activeOrderResponse?.activeOrder?.lines) ?? []

  useEffect(() => {
    const unsubscribeFromCartUpdated = cartChannel.on('cart:updated', () => {
      refetch()
    })

    return () => {
      unsubscribeFromCartUpdated()
    }
  }, [refetch])

  const totalPrice = formatPrice(
    orderLines.reduce((acc, orderLine) => {
      const { productVariant } = orderLine
      const { priceWithTax } = productVariant
      const activePrice = priceWithTax * orderLine.quantity

      return acc + getPrice(activePrice)
    }, 0),
    activeOrder?.currencyCode ?? CurrencyCode.Sek,
  )

  if (error) {
    return <div {...rest}>{error.message}</div>
  }
  return (
    <Wrapper {...rest}>
      {loading ? loadingElement : renderChildren(children, { orderLines, totalPrice })}
    </Wrapper>
  )
}

export interface OrderLineItemProps extends CustomHTMLElement {
  orderLine: ListedOrderLinesFragment
  children: ReactNode
}

// OrderLineItem ==============================
const OrderLineItem = ({
  wrapperTag: Wrapper = 'li',
  orderLine,
  children,
  ...rest
}: OrderLineItemProps) => {
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    const unsubscribeFromCartUpdating = cartChannel.on('cart:updating', (data) => {
      setIsUpdating((data?.data as ListedOrderLinesFragment).id === orderLine.id)
    })
    const unsubscribeFromCartUpdated = cartChannel.on('cart:updating', (data) => {
      setIsUpdating((data?.data as ListedOrderLinesFragment).id !== orderLine.id)
    })

    return () => {
      unsubscribeFromCartUpdating()
      unsubscribeFromCartUpdated()
    }
  }, [orderLine])

  return (
    <Wrapper data-loading={isUpdating} {...rest}>
      {children}
    </Wrapper>
  )
}

export interface OrderLineItemRemoveProps extends CustomHTMLElement {
  children?: ReactNode
  orderLine: ListedOrderLinesFragment
}

// OrderLineImage ==============================

interface OrderLineImageProps extends HTMLAttributes<HTMLImageElement> {
  orderLine: ListedOrderLinesFragment
  imageSize?: [number, number]
}

const OrderLineImage = ({ orderLine, imageSize, ...rest }: OrderLineImageProps) => {
  const src = get(
    orderLine,
    ['productVariant', 'featuredAsset', 'preview'],
    orderLine.featuredAsset?.preview,
  )

  return (
    <img
      src={`${src}?w=${get(imageSize, [0], '128')}&h=${get(imageSize, [1], '128')}`}
      alt={orderLine.productVariant.name}
      {...rest}
    />
  )
}

// OrderLineItemRemove ==============================

const OrderLineItemRemove = ({
  wrapperTag: Wrapper = 'button',
  children,
  orderLine,
  ...rest
}: OrderLineItemRemoveProps) => {
  const [removeOrderLineFunc, { error, loading }] = useCustomMutation(REMOVE_ORDER_LINE)

  const removeOrderLine = useCallback(
    async (orderLineId: string) => {
      try {
        cartChannel.emit('cart:updating', { data: orderLine, action: CartAction.REMOVE })
        const removedItem = await removeOrderLineFunc({ variables: { orderLineId } })
        if (removedItem.data) {
          isError(removedItem.data)
            ? cartChannel.emit('cart:error', { data: removedItem.data, action: CartAction.REMOVE })
            : cartChannel.emit('cart:updated', {
                data: removedItem.data,
                action: CartAction.REMOVE,
              })
        }

        return removedItem
      } catch {
        cartChannel.emit('cart:error', { data: error, action: CartAction.REMOVE })
      }
    },
    [removeOrderLineFunc, error, orderLine],
  )

  return (
    <Wrapper
      aria-label="Close"
      data-loading={loading}
      data-error={!!error}
      onClick={() => removeOrderLine(orderLine.id)}
      {...rest}
    >
      {children || 'X'}
    </Wrapper>
  )
}

// OrderLineAdjust ==============================

interface OrderLineAdjustProps extends CustomHTMLElement {
  orderLine: ListedOrderLinesFragment
  adjustable?: boolean
}

const OrderLineAdjust = ({
  wrapperTag: Wrapper = 'button',
  adjustable = true,
  orderLine,
  ...rest
}: OrderLineAdjustProps) => {
  const [adjustOrderLineFunc, { error, loading }] = useCustomMutation(ADJUST_ORDER_LINE)

  const adjustOrderLine = useCallback(
    async (productId: string, quantity: number) => {
      try {
        cartChannel.emit('cart:updating', { data: orderLine, action: CartAction.UPDATE })
        const adjustedItem = await adjustOrderLineFunc({
          variables: { orderLineId: productId, quantity },
        })
        if (adjustedItem.data) {
          isError(adjustedItem.data)
            ? cartChannel.emit('cart:error', {
                data: adjustedItem.data,
                action: CartAction.UPDATE,
              })
            : cartChannel.emit('cart:updated', {
                data: adjustedItem.data,
                action: CartAction.UPDATE,
              })
        }

        return adjustedItem
      } catch {
        cartChannel.emit('cart:error', { data: error, action: CartAction.UPDATE })
      }
    },
    [adjustOrderLineFunc, error, orderLine],
  )

  return (
    <Wrapper data-loading={loading} data-error={!!error} {...rest}>
      {adjustable ? (
        <select
          value={orderLine.quantity}
          onClick={(e) => e.stopPropagation()}
          onChange={(e) => adjustOrderLine(orderLine.id, parseInt(e.target.value))}
        >
          {[...Array(50)].map((_, i) => (
            <option key={i} value={i + 1}>
              {i + 1} st
            </option>
          ))}
        </select>
      ) : (
        <span>{orderLine.quantity} st</span>
      )}
    </Wrapper>
  )
}

interface OrderLinePriceProps extends CustomHTMLElement {
  orderLine: ListedOrderLinesFragment
  withTax?: boolean
}
// OrderLinesPrice ==============================
const OrderLinesPrice = ({ orderLine, withTax = false, ...rest }: OrderLinePriceProps) => {
  const { productVariant } = orderLine
  const { price, priceWithTax, currencyCode } = productVariant

  return (
    <Price
      price={price}
      priceWithTax={priceWithTax}
      currencyCode={currencyCode}
      withTax={withTax}
      {...rest}
    >
      {({ formattedPrice }) => formattedPrice}
    </Price>
  )
}

// OrderLines.Root = OrderLines
OrderLines.Item = OrderLineItem
OrderLines.Remove = OrderLineItemRemove
OrderLines.Quantity = OrderLineAdjust
OrderLines.Image = OrderLineImage
OrderLines.Price = OrderLinesPrice
