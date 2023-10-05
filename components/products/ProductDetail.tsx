import {
  Brand,
  FacetValue,
  Price,
  ProductDetail as ProductDetailComponent,
} from '@haus-tech/ecom-components'
import { Icon } from '../icon/Icon'
import { Spinner } from '../spinner/Spinner'

interface ProductDetailProps {
  slug?: string
  id?: string
}

export const ProductDetail = ({ slug = '', id = '' }: ProductDetailProps) => {
  return (
    <ProductDetailComponent id={id} slug={slug} className="ProductDetail">
      <div className="product-image-slider">
        <ProductDetailComponent.ImageSlider
          className="image-slider"
          innerWrapperClassName="inner-wrapper"
          thumbWrapperClassName="thumb-wrapper"
          thumbClassName="thumb"
          hideThumbsIfSingle={true}
        />
      </div>
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
        <ProductDetailComponent.AddToCart className="add-to-cart">
          {({ loading }) => (
            <>
              {loading ? <Spinner></Spinner> : <Icon name="cart" />}
              <span>{loading ? 'Lägger till...' : 'Lägg i varukorg'}</span>
            </>
          )}
        </ProductDetailComponent.AddToCart>

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
        </ProductDetailComponent.Info>
      </div>
    </ProductDetailComponent>
  )
}
