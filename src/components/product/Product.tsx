import { getFragmentData } from '@/gql'
import { DetailedProductFragment } from '@/gql/graphql'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { DETAILED_PRODUCT, PRODUCT } from '@/providers/vendure/products/products'
import { CustomHTMLElement, GenericApolloError, Loading, RequireAtLeastOne } from '@/types'
import { ReactNode, useLayoutEffect, useState } from 'react'

type ProductInputVariable = RequireAtLeastOne<{ id: string; slug: string }>

export type ProductProps = {
  children: (props: {
    product: DetailedProductFragment | null | undefined
    loading: Loading<'product:loading'>
    error: GenericApolloError
    selectedProductVariantId?: string
    setSelectedProductVariantId: (id: string) => void
  }) => ReactNode
} & ProductInputVariable &
  CustomHTMLElement

export const Product = ({
  wrapperTag: Wrapper = 'div',
  id,
  slug,
  children,
  ...rest
}: ProductProps) => {
  const [selectedProductVariantId, setSelectedProductVariantId] = useState<string | undefined>(
    undefined,
  )

  const {
    data: productData,
    loading,
    error,
  } = useCustomQuery(PRODUCT, {
    variables: {
      id,
      slug,
    },
  })

  const product = getFragmentData(DETAILED_PRODUCT, productData?.product)

  useLayoutEffect(() => {
    if (product) {
      setSelectedProductVariantId(product.variants[0].id)
    }
  }, [product])

  return (
    <Wrapper {...rest}>
      {children({
        product,
        loading: { 'product:loading': loading },
        error,
        selectedProductVariantId,
        setSelectedProductVariantId,
      })}
    </Wrapper>
  )
}
