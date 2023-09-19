import {
  AdjustOrderLine as AdjustOrderLineWrapper,
  ListedOrderLinesFragment,
} from '@haus-tech/ecom-components'
import { Spinner } from '../spinner/Spinner'

interface AdjustOrderLineProps {
  product: ListedOrderLinesFragment
}

export const AdjustOrderLine = ({ product }: AdjustOrderLineProps) => {
  return (
    <AdjustOrderLineWrapper className="cart-product-quantity">
      {({ orderLines, adjustOrderLine, loading }) => (
        <>
          {loading['cart:adjustOrderLine'] ? (
            <Spinner />
          ) : (
            <select
              className="cart-product-quantity-select"
              value={
                orderLines.find((ol) => ol.productVariant.id === product.productVariant.id)
                  ?.quantity
              }
              onChange={(e) => adjustOrderLine(product.id, parseInt(e.target.value))}
            >
              {[...Array(50)].map((_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1} st
                </option>
              ))}
            </select>
          )}
        </>
      )}
    </AdjustOrderLineWrapper>
  )
}
