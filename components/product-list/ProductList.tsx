import {
  ListedProductFragment,
  Price,
  ProductList as ProductListWrapper,
  Pagination as IPagination,
  GroupedFacetValues,
  SearchResultSortParameter,
  SortOrder,
} from '@haus-tech/ecom-components'
import { Button } from '../button/Button'
import { Select } from '../select/Select'

interface ProductCardProps {
  product: ListedProductFragment
  facetValues: GroupedFacetValues
}
const ProductCard = ({ product, facetValues }: ProductCardProps) => {
  const getBrand = (facetValues: GroupedFacetValues) => {
    const { facetValueIds } = product
    const brandFacets = facetValues['brand']
    if (!brandFacets) return null
    const brandFacet = brandFacets.find((facetValue) => facetValueIds.includes(facetValue.id))
    if (!brandFacet) return null
    return brandFacet.name
  }

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
        <div className="product-brand">{getBrand(facetValues || '')}</div>
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
          color="white"
          disabled={!canGoForward}
          onClick={nextPage}
        >
          Visa mer
        </Button>
      </div>
    </div>
  )
}

type SortOption = { label: string; value: SearchResultSortParameter }

interface ProductListProps {
  searchInputProps?: object
  availableSortOptions?: SortOption[]
}

export const ProductList = ({
  searchInputProps,
  availableSortOptions = defaultSortOptions,
}: ProductListProps) => {
  return (
    <ProductListWrapper
      className="ProductList"
      infinitePagination
      searchInputProps={searchInputProps}
    >
      {({ loading, products, facetValues, pagination, filters, error }) => {
        if (loading && products.length === 0) return <div>Loading...</div>
        if (error) return <div>Error</div>
        if (!products.length) return <div>Inga produkter hittades</div>
        return (
          <>
            <div className="product-list-sort">
              <Select
                options={availableSortOptions}
                defaultValue={JSON.stringify(filters?.sort)}
                onValueChange={(value) => filters?.setSort(JSON.parse(value))}
                triggerProps={{ color: 'blue', rounded: 'full' }}
              />
            </div>
            {products.map((product) => (
              <ProductCard key={product.productId} product={product} facetValues={facetValues!} />
            ))}
            <Pagination pagination={pagination} />
          </>
        )
      }}
    </ProductListWrapper>
  )
}

const defaultSortOptions = [
  { label: 'Namn', value: { name: SortOrder.Asc } },
  { label: 'Pris fallande', value: { price: SortOrder.Desc } },
  { label: 'Pris stigande', value: { price: SortOrder.Asc } },
]

export default ProductList
