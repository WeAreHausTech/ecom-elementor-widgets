import { CartTotals } from '@haus-tech/ecom-components'

interface CartOrderProps {
  subTotal: number
  tax: number
  shipping: number
  totalWithTax: number
}

interface CartTotalsProps {
  className?: string
  totalWithTax?: boolean
  subTotal?: boolean
  tax?: boolean
  shipping?: boolean
  order?: CartOrderProps
}

export const CartPrice = (props: CartTotalsProps) => {
  return (
    <CartTotals className={props.className}>
      {({ totalPrice }) => {
        return (
          <>
            {props.subTotal && (
              <CartTotals.Item
                className="item"
                item={{ label: 'Varukostnad', value: totalPrice.subTotal }}
                order={props.order?.subTotal}
              />
            )}

            {props.shipping && (
              <CartTotals.Item
                className="item"
                item={{ label: 'Frakt', value: totalPrice.shipping }}
                order={props.order?.shipping}
              />
            )}

            {props.tax && (
              <CartTotals.Item
                className="item"
                item={{ label: 'Moms', value: totalPrice.taxSummary[0]?.taxTotal }}
                order={props.order?.tax}
              />
            )}

            {props.totalWithTax && (
              <CartTotals.Item
                className="item"
                item={{ label: 'Att betala', value: totalPrice.totalWithTax }}
                order={props.order?.totalWithTax}
              />
            )}
          </>
        )
      }}
    </CartTotals>
  )
}
