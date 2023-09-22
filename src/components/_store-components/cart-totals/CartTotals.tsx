import { HTMLAttributes, ReactNode, useEffect } from 'react'
import { cartChannel } from '@/eventbus/channels/cart-channel'
import { getFragmentData } from '@/gql'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { GET_ACTIVE_ORDER, ORDER_PRICE_DATA_FRAGMENT } from '@/providers/vendure/order/order'
import { CurrencyCode, OrderPriceDataFragment } from '@/gql/graphql'
import { Price } from '@/components/_store-components/price/Price'
export interface CartTotalsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  loadingElement?: ReactNode
  children: (props: { totalPrice: OrderPriceDataFragment }) => ReactNode
}

export const CartTotals = ({
  children,
  loadingElement = 'Loading...',
  ...rest
}: CartTotalsProps) => {
  const { loading, error, data, refetch } = useCustomQuery(GET_ACTIVE_ORDER)

  useEffect(() => {
    const unsubscribeFromCartUpdated = cartChannel.on('cart:updated', () => {
      refetch()
    })

    return () => {
      unsubscribeFromCartUpdated()
    }
  }, [refetch])

  const totalPrice = getFragmentData(ORDER_PRICE_DATA_FRAGMENT, data?.activeOrder)

  if (error) {
    return <div {...rest}>{error.message}</div>
  }

  return totalPrice ? (
    <div
      data-loading={loading}
      data-error={!!error}
      {...rest}
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {loading ? loadingElement : children({ totalPrice })}
    </div>
  ) : null
}

interface CartTotalsItemProps extends HTMLAttributes<HTMLDivElement> {
  item: {
    label: string
    value: number
  }
  order?: number
}

const CartTotalsItem = ({ item, order, ...rest }: CartTotalsItemProps) => {
  return (
    <div data-order={order} {...rest} style={{ order }}>
      <div>{item.label}</div>
      <Price price={item.value} priceWithTax={item.value} currencyCode={CurrencyCode.Usd} withTax>
        {({ formattedPrice }) => formattedPrice}
      </Price>
    </div>
  )
}

CartTotals.Item = CartTotalsItem
