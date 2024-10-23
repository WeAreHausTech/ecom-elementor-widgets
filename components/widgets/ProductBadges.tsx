import { Badges } from '@haus-tech/ecom-components/store-components'
import { RequireAtLeastOne } from '@haus-tech/ecom-components'
import { useProductDetail } from '@haus-tech/ecom-components/hooks'
import { useMemo } from 'react'

type ProductInputVariable = RequireAtLeastOne<{ id: string; slug: string }>

type ProductVariantDetailsWidgetProps = ProductInputVariable & {
  badgesPositions?: string[]
}

const ProductBadges = ({ badgesPositions = [], id, slug }: ProductVariantDetailsWidgetProps) => {
  if (id && id.endsWith('/')) id = id.slice(0, -1)
  if (slug && slug.endsWith('/')) slug = slug.slice(0, -1)
  const variableToUse = useMemo(() => {
    return id ? { id } : { slug: slug! }
  }, [id, slug])

  const { data: product } = useProductDetail(variableToUse)

  if (!product) return null

  return (
    <Badges
      ui="list"
      {...(badgesPositions?.length > 0 && { badgesPositions: badgesPositions })}
      badges={product?.badges}
    />
  )
}

export default ProductBadges
