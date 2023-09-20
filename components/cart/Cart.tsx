import { OrderLines } from '@haus-tech/ecom-components'

interface CartProps {
  className?: string
  edit?: boolean
  remove?: boolean
  price?: boolean
}

export const Cart = (props: CartProps) => {
  return (
    <OrderLines className={props.className}>
      {({ orderLines }) => {
        if (orderLines.length === 0)
          return (
            <div>
              <span>Varukorgen är tom</span>
            </div>
          )

        console.log(orderLines)
        return (
          <div className="orderLines">
            {orderLines.map((orderLine) => (
              <OrderLines.Item className="orderline" orderLine={orderLine}>
                {props.remove && (
                  <OrderLines.Remove className="orderline-remove" orderLine={orderLine} />
                )}
                <OrderLines.Image className="orderline-image" orderLine={orderLine} />
                <div className="orderline-content">
                  <div className="orderline-text">
                    <p className="orderline-brand">Brand</p>
                    <p className="orderline-product-name">{orderLine.productVariant.name}</p>
                    {props.edit ? (
                      <OrderLines.Quantity className="orderline-quantity" orderLine={orderLine} />
                    ) : (
                      <p className="orderline-quantity">{orderLine.quantity} st</p>
                    )}
                  </div>

                  {props.price && (
                    <OrderLines.Price className="orderline-price" orderLine={orderLine} />
                  )}
                </div>
              </OrderLines.Item>
            ))}
          </div>
        )
      }}
    </OrderLines>
  )
}
