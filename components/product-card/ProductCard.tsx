import { Product as ProductWrapper, ProductProps, Price } from '@haus-tech/ecom-components'

interface ProductCardProps extends Pick<ProductProps, 'product' | 'thumbnailSize'> {
  discount?: number
  isNew?: boolean
}

export const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <ProductWrapper product={product} className="ProductCard" thumbnailSize={[235, 300]}>
      {({ product }) => (
        <>
          <div className="product-image-wrapper">
            <img
              src={product.productAsset?.preview}
              alt={product.productName}
              className="product-image"
            />
          </div>
          <div className="product-info">
            <div className="product-label">Brand</div>
            <div className="product-name">{product.productName}</div>
            <Price
              className="product-price"
              price={product.price}
              priceWithTax={product.priceWithTax}
              currencyCode={product.currencyCode}
            >
              {({ formattedPrice }) => <>{formattedPrice}</>}
            </Price>
          </div>
        </>
      )}
    </ProductWrapper>
  )
}
