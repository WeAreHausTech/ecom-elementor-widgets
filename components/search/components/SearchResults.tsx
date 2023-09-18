import { SearchResults as SearchResultsWrapper, Price } from '@haus-tech/ecom-components'

const SearchResults = () => {
  return (
    <SearchResultsWrapper searchInputProps={{ take: 3 }}>
      {({ loading, products, collections, active }) => {
        if (loading) return <div>Laddar...</div>
        if (active && products.length === 0 && collections.length === 0)
          return <div className="searchResults">Inga resultat hittades</div>

        const collectionWithLowestLevel = collections[collections.length - 1]

        return (
          active && (
            <div className="searchResults">
              <div className="searchList">
                {collectionWithLowestLevel && (
                  <a href={collectionWithLowestLevel.slug}>
                    <div className="collection">
                      <img
                        src={collectionWithLowestLevel.featuredAsset?.preview}
                        alt="Product Image"
                      />
                      <p> {collectionWithLowestLevel.name} </p>
                    </div>
                  </a>
                )}
                <div className="productList">
                  {products.map((product) => (
                    <a href={`/products/${product.slug}`} key={product.productId}>
                      <div className="product">
                        <div className="productData">
                          <img src={product.productAsset?.preview} alt="Product Image" />
                          <p> {product.productName} </p>
                        </div>
                        <div>
                          <Price
                            price={product.price}
                            priceWithTax={product.priceWithTax}
                            currencyCode={product.currencyCode}
                          >
                            {({ formattedPrice }) => {
                              return <p className="price">{formattedPrice}</p>
                            }}
                          </Price>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )
        )
      }}
    </SearchResultsWrapper>
  )
}

export default SearchResults
