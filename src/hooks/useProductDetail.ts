import { PRODUCT } from '@/providers/vendure/products/products'
import { useCustomQuery } from './useCustomQuery'
import { RequireAtLeastOne } from '@/types'

type UseProductDetailProps = RequireAtLeastOne<{ id: string; slug: string }>

export const useProductDetail = ({ id, slug }: UseProductDetailProps) => {
  const query = useCustomQuery(PRODUCT, {
    variables: {
      id,
      slug,
    },
  })

  return { query }
}
