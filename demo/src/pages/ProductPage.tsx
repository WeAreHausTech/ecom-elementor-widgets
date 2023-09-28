import { ProductDetail } from '../../../components/products/ProductDetail'

export const ProductPage = () => {
  const productSlug = window.location.pathname.split('/').pop()

  return productSlug ? <ProductDetail slug={productSlug}></ProductDetail> : null
}
