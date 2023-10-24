/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-refresh/only-export-components */
/* eslint-disable no-case-declarations */
import React, { ReactNode, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import {
  Cart,
  Checkout,
  CurrencyChooser,
  OrderConfirmation,
  ProductDetail,
  ProductList,
  DropdownCart,
  VendureApolloProvider,
  SearchField,
} from '@haus-tech/ecom-components'

import './index.scss'
import { get } from 'lodash'
import styles from '@haus-tech/ecom-components/dist/ecom-style.css'
import { FacetValueFilterInput } from '@haus-tech/ecom-components/vendure'

async function fetchCSSContent() {
  const response = await fetch(styles)
  return await response.text()
}

const renderElement = async (element: Element, children: ReactNode) => {
  const css = await fetchCSSContent()
  const shadowRoot = element.attachShadow({ mode: 'open' })

  const styleEl = document.createElement('style')
  styleEl.textContent = css
  shadowRoot.appendChild(styleEl)

  const vendureToken = element.attributes.getNamedItem('data-vendure-token')?.value
  const vendureUrl = element.attributes.getNamedItem('data-vendure-api-url')?.value

  return ReactDOM.createRoot(shadowRoot).render(
    <React.StrictMode>
      <VendureApolloProvider
        apiUrl={vendureUrl || 'https://livv-ecom-test.azurewebsites.net/shop-api'}
        vendureToken={vendureToken}
      >
        <Suspense>{children}</Suspense>
      </VendureApolloProvider>
    </React.StrictMode>,
  )
}

document.addEventListener(
  'DOMContentLoaded',
  async function () {
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
                collectionId: collectionId,
              }}
              enablePagination={Boolean(enablePagination)}
              enableSorting={Boolean(enableSort)}
            />,
          )
          break

        case 'checkout':
          renderElement(element, <Checkout />)
          break

        case 'product-detail':
          const id = dataAttributes.getNamedItem('data-product')?.value
          renderElement(element, id && <ProductDetail id={id} />)
          break

        case 'cart':
          renderElement(element, <Cart />)
          break

        case 'search-field':
          const redirect = dataAttributes.getNamedItem('data-redirect-to')?.value
          const placeholder = dataAttributes.getNamedItem('data-placeholder')?.value

          renderElement(
            element,
            <SearchField
              openOnButton={true}
              autofocus={true}
              searchUrl={redirect}
              placeholder={placeholder}
            />,
          )
          break

        case 'currency-chooser':
          renderElement(element, <CurrencyChooser />)
          break

        case 'order-confirmation':
          renderElement(element, <OrderConfirmation />)
          break

        case 'dropdown-cart':
          const cartUrl = dataAttributes.getNamedItem('data-redirect-to')?.value

          renderElement(element, <DropdownCart dropdownEnabled={false} cartUrl={cartUrl} />)
          break
      }
    })
  },
  false,
)
