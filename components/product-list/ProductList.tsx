import { ProductList as ProductListWrapper } from '@haus-tech/ecom-components'
import { ProductCard } from '../product-card/ProductCard'
import { Pagination } from '../pagination/Pagination'

export const ProductList = () => {
  return (
    <ProductListWrapper className="ProductList" infinitePagination searchInputProps={{ take: 4 }}>
      {({ loading, products, pagination, error }) => {
        if (loading['productList:search'] && products.length === 0) return <div>Loading...</div>
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
