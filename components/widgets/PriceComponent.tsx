import { Product, RequireAtLeastOne, SearchResult } from '@haus-tech/ecom-components'
import { useProductDetail } from '@haus-tech/ecom-components/hooks'
import { PriceComponent as EcomPriceComponent } from '@haus-tech/ecom-components/store-components'
import { ComponentProps } from 'react'

type ProductInputVariable = RequireAtLeastOne<{
  productId: string
  productSlug: string
  product?: Pick<Product | SearchResult, 'currencyCode' | 'price' | 'priceWithTax'>
}>

type Props = ComponentProps<typeof EcomPriceComponent> & ProductInputVariable

const PriceComponent = ({
  productId,
  productSlug,
  showSkeletonLoader,
  product: incomingProduct,
  ...rest
}: Props) => {
  const { data: product, isLoading } = useProductDetail(
    productId ? { id: productId } : { slug: productSlug! },
  )

  if (!showSkeletonLoader && isLoading && !product) return null
  return <EcomPriceComponent product={product || incomingProduct} {...rest} />
}

export default PriceComponent
