import { useEventBusOn } from '@haus-tech/ecom-components/eventbus'
import { productChannel } from '@haus-tech/ecom-components/eventbus'
import { AddToCartButton } from '@haus-tech/ecom-components/store-components'

const AddToCartButtonWidget = () => {
  const [selectedProductVariant] = useEventBusOn(productChannel, 'product:variant:selected')

  if (!selectedProductVariant) {
    return
  }
  return <AddToCartButton productVariant={selectedProductVariant} />
}

export default AddToCartButtonWidget
