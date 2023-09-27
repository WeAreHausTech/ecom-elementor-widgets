import { FacetValue } from '@/gql/graphql'
import { CustomHTMLElement } from '@/types'

export interface BrandProps extends CustomHTMLElement {
  facetValues: FacetValue[]
}

export const Brand = ({
  wrapperTag: Wrapper = 'span',
  facetValues,
  className,
  ...rest
}: BrandProps) => {
  const foundBrand = facetValues.find((facetValue) => facetValue.facet.code === 'brand')
  return (
    <Wrapper className={className} {...rest}>
      {foundBrand?.name || ' '}
    </Wrapper>
  )
}
