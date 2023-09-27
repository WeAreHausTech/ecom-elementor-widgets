import {
  ListedProductFragment,
  Price,
  ProductList as ProductListWrapper,
  Pagination as IPagination,
  AddToCart,
} from '@haus-tech/ecom-components'
import { Button } from '../button/Button'

const ProductCard = ({ product }: { product: ListedProductFragment }) => {
  // TODO: AddToCart should not be here, remove when single product page is implemented
  return (
    <AddToCart wrapperTag="section">
      {({ addProductToCart }) => {
        return (
          <div
            className="product-list-product-card"
            onClick={() => addProductToCart(product.productId, 1)}
          >
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
              <button className="product-add-to-cart-button">Lägg till i varukorg</button>
            </div>
          </div>
        )
      }}
    </AddToCart>
  )
}

const Pagination = ({ pagination }: { pagination?: IPagination }) => {
  if (!pagination) return null
  const { itemsPerPage, currentPage, totalPages, totalItems, canGoForward, nextPage } = pagination

  const showing = itemsPerPage * currentPage > totalItems ? totalItems : itemsPerPage * currentPage

  return (
    <div className="product-list-pagination">
      <div>
        Visar {showing} av {totalItems}
      </div>
      <div className="pagination-progress">
        <div
          className="pagination-progress-bar"
          style={{ width: `${(currentPage / totalPages) * 100}%` }}
        />
      </div>

      <div className="pagination-buttons">
        <Button
          className="load-more-button"
          color="blue"
          disabled={!canGoForward}
          onClick={nextPage}
        >
          Visa mer
        </Button>
      </div>
    </div>
  )
}

interface ProductListProps {
  searchInputProps?: object
}

export const ProductList = (props: ProductListProps) => {
  return (
    <ProductListWrapper
      className="ProductList"
      infinitePagination
      searchInputProps={props.searchInputProps}
    >
      {({ loading, products, pagination, error }) => {
        if (loading['productList:search'] && products.length === 0) return <div>Loading...</div>
        if (error) return <div>Error</div>
        if (!products.length) return <div>Inga produkter hittades</div>
        return (
          <>
            <div className="grid grid-cols-4 gap-8">
              {products.map((product) => (
                <ProductCard key={product.productId} product={product} />
              ))}
            </div>
            <Pagination pagination={pagination} />
          </>
        )
      }}
    </ProductListWrapper>
  )
}
