import {
  ListedProductFragment,
  Price,
  ProductList as ProductListWrapper,
  Pagination as IPagination,
} from '@haus-tech/ecom-components'
import { Button } from '../button/Button'

interface ProductCardProps {
  product: ListedProductFragment
}
const ProductCard = ({ product }: ProductCardProps) => {
  return (
    <a className="product-list-product-card" href={`/products/${product.slug}`}>
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
    </a>
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
