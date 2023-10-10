/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-case-declarations */
import React, { ReactNode, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { FacetValueFilterInput, VendureApolloProvider } from '@haus-tech/ecom-components'

import './index.scss'
import { get } from 'lodash'

// Lazy load widgets
const ProductList = React.lazy(() => import('./product-list/ProductList'))
const Checkout = React.lazy(() => import('./checkout/Checkout'))
const ProductDetail = React.lazy(() => import('./products/ProductDetail'))
const Cart = React.lazy(() => import('./cart/Cart'))

const renderElement = (element: Element, children: ReactNode) => {
  return ReactDOM.createRoot(element).render(
    <React.StrictMode>
      <VendureApolloProvider apiUrl="https://livv-ecom-test.azurewebsites.net/shop-api">
        <Suspense>{children}</Suspense>
      </VendureApolloProvider>
    </React.StrictMode>,
  )
}

document.addEventListener(
  'DOMContentLoaded',
  function () {
    const elements: Element[] = Array.from(document.getElementsByClassName('ecom-components-root'))
    elements.forEach((element: Element) => {
      const dataAttributes = element.attributes
      const widgetType = dataAttributes.getNamedItem('data-widget-type')?.value

      switch (widgetType) {
        case 'product-list':
          const facetsAttributes = dataAttributes.getNamedItem('data-facet')?.value
          let facetValues: FacetValueFilterInput[] = [{ or: [] }]
          if (facetsAttributes) {
            const facetArray = facetsAttributes.split(',').map(Number)

            if (facetArray?.length > 0) {
              facetValues = facetArray.map((facet) => {
                return { and: String(facet) } as FacetValueFilterInput
              })
            }
          }

    

          const collectionId = dataAttributes.getNamedItem('data-collection')?.value


          const enablePagination = +get(
            dataAttributes.getNamedItem('data-pagination-enabled'),
            'value',
            0,
          )
          const enableSort = +get(dataAttributes.getNamedItem('data-sort-enabled'), 'value', 0)

          renderElement(
            element,
            <ProductList
              searchInputProps={{
                facetValueFilters: facetValues,
                take: +get(dataAttributes.getNamedItem('data-take'), 'value', 12),
                collectionId: collectionId
              }}
              enablepagination={Boolean(enablePagination)}
              enableSort={Boolean(enableSort)}
            />,
          )
          break

        case 'checkout':
          renderElement(element, <Checkout />)
          break

        case 'product-detail':
          const id = dataAttributes.getNamedItem('data-product')?.value
          renderElement(element, id && <ProductDetail id={id}></ProductDetail>)
          break

        case 'cart':
          renderElement(element, <Cart />)
          break
      }
    })
  },
  false,
)
