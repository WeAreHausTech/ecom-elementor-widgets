import {
  Brand,
  FacetValue,
  Price,
  ProductDetail as ProductDetailComponent,
} from '@haus-tech/ecom-components'
import { Icon } from '../icon/Icon'

interface ProductDetailProps {
  slug: string
}

export const ProductDetail = ({ slug }: ProductDetailProps) => {
  return (
    <ProductDetailComponent slug={slug} className="ProductDetail">
      <div className="product-detail">
        {/* <BreadCrumbs className="breadcrumbs" /> */}
        <ProductDetailComponent.Content className="product-content">
          {({ product, selectedProductVariant }) => {
            return (
              <>
                <Brand className="brand" facetValues={product.facetValues as FacetValue[]} />
                <h1 className="title">{product.name}</h1>
                <Price
                  className="price"
                  price={selectedProductVariant.price}
                  priceWithTax={selectedProductVariant.priceWithTax}
                  currencyCode={selectedProductVariant.currencyCode}
                >
                  {({ formattedPrice }) => formattedPrice}
                </Price>
              </>
            )
          }}
        </ProductDetailComponent.Content>
        {/* <ProductDetailComponent.AddToCart className="add-to-cart">
          {({ loading }) => (
            <>
              <Icon name="cart" />
              <span>{loading ? <Spinner></Spinner> : 'Add to cart'}</span>
            </>
          )}
        </ProductDetailComponent.AddToCart> */}
        <ProductDetailComponent.InStock className="stock-level">
          {({ inStock }) => (
            <>
              <Icon name={inStock ? 'check' : 'close'} />
              {inStock ? 'In stock' : 'Out of stock'}
            </>
          )}
        </ProductDetailComponent.InStock>

        <ProductDetailComponent.Info className="product-info">
          <ProductDetailComponent.InfoItem className="product-info-item" value={'description'}>
            {({ isOpen }) => {
              return (
                <>
                  <ProductDetailComponent.InfoTrigger className="product-info-trigger trigger">
                    <span>Description</span>
                    <Icon name={isOpen ? 'minus' : 'plus'} />
                  </ProductDetailComponent.InfoTrigger>
                  <ProductDetailComponent.InfoContent
                    value="description"
                    className="product-info-content"
                  />
                </>
              )
            }}
          </ProductDetailComponent.InfoItem>

          <ProductDetailComponent.InfoItem className="product-info-item" value={'specifications'}>
            {({ isOpen }) => {
              return (
                <>
                  <ProductDetailComponent.InfoTrigger className="product-info-trigger trigger">
                    <span>Specifications</span>
                    <Icon name={isOpen ? 'minus' : 'plus'} />
                  </ProductDetailComponent.InfoTrigger>
                  <ProductDetailComponent.InfoContent
                    value="description"
                    className="product-info-content"
                  />
                </>
              )
            }}
          </ProductDetailComponent.InfoItem>
        </ProductDetailComponent.Info>
      </div>
    </ProductDetailComponent>
  )
}