import { RequireAtLeastOne } from '@haus-tech/ecom-components'
import { useProductDetail } from '@haus-tech/ecom-components/hooks'
import { PriceComponent as EcomPriceComponent } from '@haus-tech/ecom-components/store-components'
import { productChannel, useEventBusOn } from '@haus-tech/ecom-components/eventbus'

type ProductInputVariable = RequireAtLeastOne<{
  productId: string
  productSlug: string
}>

type Props = ProductInputVariable & {
  showSkeletonLoader?: boolean
}

const PriceComponent = ({ productId, productSlug, showSkeletonLoader }: Props) => {
  const [selectedProductVariant] = useEventBusOn(productChannel, 'product:variant:selected')

  const { data: product, isLoading } = useProductDetail(
    productId ? { id: productId } : { slug: productSlug! },
    !selectedProductVariant,
  )

  if (!selectedProductVariant || !product) {
    return null
  }

  if (!showSkeletonLoader && isLoading && (!selectedProductVariant || !product)) return null

  return (
    <EcomPriceComponent
      price={selectedProductVariant?.price || product.price}
      priceWithTax={selectedProductVariant?.priceWithTax || product.priceWithTax}
      currencyCode={selectedProductVariant?.currencyCode || product.currencyCode}
      ordinaryPrice={
        selectedProductVariant?.ordinaryPrice !== undefined
          ? selectedProductVariant.ordinaryPrice
          : product.ordinaryPrice || 0
      }
    />
  )
}

export default PriceComponent
