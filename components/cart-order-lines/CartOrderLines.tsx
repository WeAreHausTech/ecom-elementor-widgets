import { OrderLines } from '@haus-tech/ecom-components'
import { Icon } from '../icon/Icon'

interface CartProps {
  className?: string
  edit?: boolean
  remove?: boolean
  price?: boolean
}

export const CartOrderLines = ({className, edit, remove, price}: CartProps) => {
  return (
    <OrderLines className={className}>
      {({ orderLines }) => {
        if (orderLines.length === 0)
          return (
            <div>
              <span>Varukorgen är tom</span>
            </div>
          )
        return (
          <div className="orderLines">
            {orderLines.map((orderLine) => (
              <OrderLines.Item className="orderline" orderLine={orderLine}>
                <OrderLines.Image className="orderline-image" orderLine={orderLine} />
                <div className="orderline-content">
                  <div className="orderline-text">
                    <p className="orderline-brand">Brand</p>
                    <p className="orderline-product-name">{orderLine.productVariant.name}</p>
                    <div className="orderline-quantity-wrapper">
                      {edit ? (
                        <OrderLines.Quantity className="orderline-quantity" orderLine={orderLine} />
                      ) : (
                        <p className="orderline-quantity">{orderLine.quantity} st</p>
                      )}
                      {remove && (
                        <OrderLines.Remove className="orderline-remove" orderLine={orderLine}>
                          <Icon className="icon-remove" name="trashcan"/>
                        </OrderLines.Remove>
                      )}{' '}
                    </div>
                  </div>
                  {price && (
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
