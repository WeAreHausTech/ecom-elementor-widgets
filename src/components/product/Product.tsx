import { ListedProductFragment } from '@/gql/graphql'
import { CustomHTMLElement } from '@/types'

export interface ProductProps extends CustomHTMLElement {
  product: ListedProductFragment
  thumbnailSize?: [number, number]
  children: (props: { product: ListedProductFragment; thumbnail: string }) => React.ReactNode
}

export const Product = ({
  product,
  thumbnailSize = [300, 400],
  wrapperTag: Wrapper = 'div',
  children,
  ...rest
}: ProductProps) => {
  const thumbnail = product.productAsset?.preview + `?w=${thumbnailSize[0]}&h=${thumbnailSize[1]}`

  return <Wrapper {...rest}>{children({ product, thumbnail })}</Wrapper>
}
