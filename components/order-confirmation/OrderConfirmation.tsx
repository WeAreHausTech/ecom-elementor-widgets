import { OrderLines, Brand, FacetValue } from '@haus-tech/ecom-components'

export const OrderConfirmation = () => {
  const searchParams = new URLSearchParams(window.location.search)
  const orderCode = searchParams.get('orderCode')

  return orderCode ? (
    <OrderLines wrapperTag="div" orderCode={orderCode} className="cart-page order-confirmation">
      {({ orderLines, totalPrice, orderState }) => {
        if (orderLines.length === 0)
          return (
            <div>
              <span>Hittade ingen order</span>
            </div>
          )
        return (
          <div className="orderLines">
            <div className="orderlines-header">
              <div className="orderlines-header-item">
                <div className="orderlines-header-title">Ordernummer</div>
                <div className="orderlines-header-value">{orderCode}</div>
              </div>
              <div className="orderlines-header-item">
                <div className="orderlines-header-title">Förfallodatum</div>
                <div className="orderlines-header-value">N/A</div>
              </div>
              <div className="orderlines-header-item">
                <div className="orderlines-header-title">Belopp</div>
                <div className="orderlines-header-value">{totalPrice}</div>
              </div>
              <div className="orderlines-header-item">
                <div className="orderlines-header-title">Orderstatus</div>
                <div className="orderlines-header-value">{orderState}</div>
              </div>
            </div>
            {orderLines.map((orderLine) => (
              <OrderLines.Item
                key={orderLine.id}
                wrapperTag="div"
                className="orderline"
                orderLine={orderLine}
              >
                <div className="orderline-image-wrapper">
                  <OrderLines.Image className="orderline-image" orderLine={orderLine} />
                </div>
                <div className="orderline-content">
                  <div className="orderline-product">
                    <Brand
                      className="orderline-brand"
                      facetValues={orderLine.productVariant.product.facetValues as FacetValue[]}
                    />
                    <p className="orderline-product-name">{orderLine.productVariant.name}</p>
                    <OrderLines.Quantity
                      className="orderline-quantity"
                      orderLine={orderLine}
                      adjustable={false}
                    />
                  </div>
                  <OrderLines.Price className="orderline-price" orderLine={orderLine} />
                </div>
              </OrderLines.Item>
            ))}
          </div>
        )
      }}
    </OrderLines>
  ) : null
}
