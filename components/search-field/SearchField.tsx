import { Price, Search } from '@haus-tech/ecom-components'
import { Icon } from '../icon/Icon'
import { last } from 'lodash'
import { Spinner } from '../spinner/Spinner'

export const SearchField = () => {
  return (
    <Search className="search">
      <div className="search-input-wrapper">
        <Icon name="search" className="search-icon" />
        <Search.Input className="search-input" />
        <Search.Clear>
          <Icon name="close" className="search-clear-icon" />
        </Search.Clear>
      </div>
      <Search.Content>
        {({ items, collections, loading }) => {
          const collectionWithLowestLevel = last(collections)
          return (
            (items.length > 0 || collections.length > 0 || loading) && (
              <div className="search-results">
                {loading ? (
                  <div className="search-loading">
                    <Spinner />
                  </div>
                ) : (
                  <div className="product-list">
                    {collectionWithLowestLevel && (
                      <Search.ContentCollectionItem
                        item={collectionWithLowestLevel}
                        className="collection"
                      >
                        <Search.CollectionImage
                          item={collectionWithLowestLevel}
                          imageSize={[54, 54]}
                        />
                        <div className="collection-name">{collectionWithLowestLevel.name}</div>
                      </Search.ContentCollectionItem>
                    )}
                    {items?.map((product) => {
                      return (
                        <Search.ContentProductItem
                          key={product.productId}
                          item={product}
                          className="product"
                        >
                          <Search.ProductImage item={product} imageSize={[54, 54]} />
                          <div className="product-data">
                            <div className="product-info">
                              <div className="brand">Brand</div>
                              <div className="title">{product.productName}</div>
                            </div>
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
                        </Search.ContentProductItem>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          )
        }}
      </Search.Content>
    </Search>
  )
}
