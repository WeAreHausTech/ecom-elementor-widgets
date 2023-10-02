import React from 'react'
import ReactDOM from 'react-dom/client'
import { ProductList } from './product-list/ProductList'
import { Checkout } from './checkout/Checkout'
import { VendureApolloProvider } from '@haus-tech/ecom-components'
import { ProductDetail } from './products/ProductDetail'
import './index.scss'

document.addEventListener(
  'DOMContentLoaded',
  function () {
    const productList = document.getElementById('productList')
    if (productList) {
      const facetsAttributes = productList.attributes.getNamedItem('data-facet')?.value
      let facetValues = undefined

      if (facetsAttributes) {
        const facetArray = facetsAttributes.split(',').map(Number)

        if (facetArray?.length > 0) {
          facetValues = facetArray.map((facet) => {
            return { and: facet }
          })
        }
      }

      ReactDOM.createRoot(productList!).render(
        <React.StrictMode>
          <VendureApolloProvider apiUrl="https://livv-ecom-test.azurewebsites.net/shop-api">
            <ProductList searchInputProps={{ facetValueFilters: facetValues }} />
          </VendureApolloProvider>
        </React.StrictMode>,
      )
    }

    const checkout = document.getElementById('checkout')
    if (checkout) {
      ReactDOM.createRoot(checkout!).render(
        <React.StrictMode>
          <VendureApolloProvider apiUrl="https://livv-ecom-test.azurewebsites.net/shop-api">
            <Checkout />
          </VendureApolloProvider>
        </React.StrictMode>,
      )
    }

    const ProductSingle = document.getElementById('product-single')
    if (ProductSingle) {
      const id = ProductSingle.attributes.getNamedItem('data-product')?.value
      ReactDOM.createRoot(ProductSingle!).render(
        <React.StrictMode>
          <VendureApolloProvider apiUrl="https://livv-ecom-test.azurewebsites.net/shop-api">
            {id && <ProductDetail id={id}></ProductDetail>}
          </VendureApolloProvider>
        </React.StrictMode>,
      )
    }
  },
  false,
)
