import { Price } from '@haus-tech/ecom-components/store-components'
import { useEventBusOn } from '@haus-tech/ecom-components/eventbus'
import { productChannel } from '@haus-tech/ecom-components/eventbus'

const ProductPrice = () => {
  const [selectedProductVariant] = useEventBusOn(productChannel, 'product:variant:selected')

  console.log('selected Product Variant:', selectedProductVariant)
  return (
    <Price
      price={selectedProductVariant?.price!}
      priceWithTax={selectedProductVariant?.priceWithTax!}
      currencyCode={selectedProductVariant?.currencyCode!}
    >
      {({ priceValue }) => <>{priceValue}</>}
    </Price>
  )
}

export default ProductPrice
