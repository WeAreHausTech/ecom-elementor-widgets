/* eslint-disable no-case-declarations */
import React, { ReactNode } from 'react'
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
  LocalizationProvider,
  AccountDropdown,
  Login,
  CustomerDetails,
  Orders,
} from '@haus-tech/ecom-components'

import { get } from 'lodash'
import styles from '@haus-tech/ecom-components/dist/ecom-style.css'
import { FacetValueFilterInput, OrderListOptions } from '@haus-tech/ecom-components/vendure'

async function fetchCSSContent() {
  const response = await fetch(styles)
  return await response.text()
}

declare global {
  interface Window {
    ecomLangData: {
      [language: string]: {
        [key: string]: string // or a more specific type
      }
    }
  }
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
      <VendureApolloProvider apiUrl={vendureUrl ? vendureUrl : ''} vendureToken={vendureToken}>
        <LocalizationProvider resourceBundles={resourceBundles}>{children}</LocalizationProvider>
      </VendureApolloProvider>
    </React.StrictMode>,
  )
}

const init = async () => {
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
        const cartPricePropsCheckout = {
          subTotal:
            dataAttributes.getNamedItem('data-show-subtotal')?.value === 'yes' ? true : false,
          tax: dataAttributes.getNamedItem('data-show-tax')?.value === 'yes' ? true : false,
          shipping:
            dataAttributes.getNamedItem('data-show-shipping')?.value === 'yes' ? true : false,
          total: dataAttributes.getNamedItem('data-show-total')?.value === 'yes' ? true : false,
          customMessage:
            dataAttributes.getNamedItem('data-custom-message')?.value === 'yes' ? true : false,
        }

        renderElement(element, <Checkout showLoginModal cartPriceProps={cartPricePropsCheckout} />)
        break

      case 'product-detail':
        const id = dataAttributes.getNamedItem('data-product')?.value
        renderElement(element, id && <ProductDetail id={id} />)
        break

      case 'cart':
        const cartPricePropsCart = {
          subTotal:
            dataAttributes.getNamedItem('data-show-subtotal')?.value === 'yes' ? true : false,
          tax: dataAttributes.getNamedItem('data-show-tax')?.value === 'yes' ? true : false,
          shipping:
            dataAttributes.getNamedItem('data-show-shipping')?.value === 'yes' ? true : false,
          total: dataAttributes.getNamedItem('data-show-total')?.value === 'yes' ? true : false,
          customMessage:
            dataAttributes.getNamedItem('data-custom-message')?.value === 'yes' ? true : false,
        }

        renderElement(element, <Cart cartPriceProps={cartPricePropsCart} />)
        break

      case 'search-field':
        const placeholder = dataAttributes.getNamedItem('data-placeholder')?.value

        renderElement(
          element,
          <SearchField openOnButton={true} autofocus={true} placeholder={placeholder} />,
        )
        break

      case 'currency-chooser':
        renderElement(element, <CurrencyChooser />)
        break

      case 'order-confirmation':
        renderElement(element, <OrderConfirmation />)
        break

      case 'dropdown-cart':
        renderElement(element, <DropdownCart dropdownEnabled={false} />)
        break

      case 'login':
        //TODO move url to translation file
        const handleTriggerClick = () => {
          window.location.href = '/'
        }
        renderElement(
          element,
          <Login onContinueAsGuest={handleTriggerClick} onLoggedIn={handleTriggerClick} />,
        )
        break
      case 'account-dropdown':
        const items = dataAttributes.getNamedItem('data-dropdown-items')?.value
        let accountDropdownItems = []

        if (items) {
          accountDropdownItems = JSON.parse(items)
        }

        renderElement(
          element,
          <AccountDropdown useLoginModal={false} dropdownItems={accountDropdownItems} />,
        )
        break

      case 'account-details':
        renderElement(element, <CustomerDetails />)
        break

      case 'orders':
        const take = dataAttributes.getNamedItem('data-orders-take')?.value
        const sort = dataAttributes.getNamedItem('data-orders-sort')?.value
        const stateFilter = dataAttributes.getNamedItem('data-orders-state-filter')?.value

        let filters: string[] = []

        if (stateFilter) {
          filters = stateFilter.split(', ')
        }

        const orderListOptions: OrderListOptions = {
          take: take ? +take : 10,
          sort: { [sort ? sort : 'createdAt']: 'DESC' },
        }

        if (filters.length > 0) {
          orderListOptions.filter = {
            state: {
              in: filters,
            },
          }
        }

        renderElement(element, <Orders orderListOptions={orderListOptions} />)
        break
    }
  })
}

if (document.readyState !== 'loading') {
  init()
} else {
  document.addEventListener('DOMContentLoaded', function () {
    init()
  })
}

const resourceBundles = [
  {
    lng: 'sv',
    ns: 'translation',
    resources: {
      ...window.ecomLangData.sv,
    },
  },
  {
    lng: 'en',
    ns: 'translation',
    resources: {
      ...window.ecomLangData.en,
    },
  },
]
