import { Badges } from '@haus-tech/ecom-components/store-components'
import { RequireAtLeastOne } from '@haus-storefront/shared-types'
import { useProductDetail } from '@haus-storefront/hooks'
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

  const filteredBadges =
    badgesPositions.length === 0
      ? product?.badges
      : product?.badges?.filter((badge) => badgesPositions.includes(badge.position))

  return <Badges badges={filteredBadges} />
}

export default ProductBadges
