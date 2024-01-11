/* eslint-disable no-case-declarations */
import React, { ReactNode, Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import { DataProvider, LocalizationProvider } from '@haus-tech/ecom-components'

import { camelCase } from 'lodash'
import styles from '@haus-tech/ecom-components/dist/ecom-style.css?url'
import ecomWidgets from './widgets'
import customWidgets from './customWidgets'

async function fetchCSSContent() {
  const response = await fetch(styles)
  return await response.text()
}

const allWidgets = {
  ...ecomWidgets,
  ...customWidgets,
}

export const renderElement = async (element: Element, children: ReactNode) => {
  const css = await fetchCSSContent()
  const shadowRoot = element.attachShadow({ mode: 'open' })

  const styleEl = document.createElement('style')
  styleEl.textContent = css
  shadowRoot.appendChild(styleEl)

  const resourceBundles = getLangData()
  const queryUpdates = getQueryUpdates()
  const config = getConfig()

  return ReactDOM.createRoot(shadowRoot).render(
    <React.StrictMode>
      <DataProvider
        provider="vendure"
        updates={queryUpdates}
        options={{
          ...config.options,
        }}
      >
        <LocalizationProvider resourceBundles={resourceBundles}>{children}</LocalizationProvider>
      </DataProvider>
    </React.StrictMode>,
  )
}

const init = async () => {
  const elements: Element[] = Array.from(document.getElementsByClassName('ecom-components-root'))
  elements.forEach((element: Element) => {
    const dataAttributes = element.attributes
    const widgetType = dataAttributes.getNamedItem('data-widget-type')?.value
    console.log(element)
    if (widgetType) {
      const widget = allWidgets[camelCase(widgetType) as keyof typeof allWidgets]
      if (widget) {
        const widgetElement = widget(dataAttributes)
        renderElement(element, <Suspense>{widgetElement}</Suspense>)
      }
    }

    // switch (widgetType) {
    //   case 'product-list':
    //     const facetsAttributes = dataAttributes.getNamedItem('data-facet')?.value
    //     const facetArray = facetsAttributes?.split(',').filter(Number).map(String)
    //     const collectionId = dataAttributes.getNamedItem('data-collection')?.value
    //     const enablePagination = +get(
    //       dataAttributes.getNamedItem('data-pagination-enabled'),
    //       'value',
    //       0,
    //     )
    //     const enableSort = +get(dataAttributes.getNamedItem('data-sort-enabled'), 'value', 0)
    //     const enableAddToCart = +get(
    //       dataAttributes.getNamedItem('data-add-to-cart-enabled'),
    //       'value',
    //       0,
    //     )

    //     const enabledFilters = dataAttributes.getNamedItem('data-filter-values')?.value ? JSON.parse(dataAttributes.getNamedItem('data-filter-values')!.value) : null
    //     const filtersArray: EnabledFilter[] = enabledFilters?.map((filter: { filter_value: string, filter_condition: 'AND' | 'OR', filter_label?: string }) => {
    //       return {
    //         facetId: filter.filter_value,
    //         logicalOperator: lowerCase(filter.filter_condition),
    //         label: filter.filter_label,
    //       } as EnabledFilter
    //     })

    //     const ProductList = React.lazy(() => import('./widgets/ProductList'))
    //     renderElement(
    //       element,
    //       <Suspense>
    //         <ProductList
    //           searchInputProps={{
    //             facetValueIds: size(facetArray) > 0 ? facetArray : [],
    //             take: +get(dataAttributes.getNamedItem('data-take'), 'value', 12),
    //             collectionId: collectionId,
    //           }}
    //           enablePagination={Boolean(enablePagination)}
    //           enableSorting={Boolean(enableSort)}
    //           enableAddToCartBtn={Boolean(enableAddToCart)}
    //           enabledFilters={size(filtersArray) > 0 ? filtersArray : undefined}
    //         />
    //         </Suspense>,
    //     )
    //     break

    //   case 'checkout':
    //     const Checkout = React.lazy(() => import('./widgets/Checkout'))
    //     const cartPricePropsCheckout = {
    //       subTotal:
    //         dataAttributes.getNamedItem('data-show-subtotal')?.value === 'yes' ? true : false,
    //       tax: dataAttributes.getNamedItem('data-show-tax')?.value === 'yes' ? true : false,
    //       shipping:
    //         dataAttributes.getNamedItem('data-show-shipping')?.value === 'yes' ? true : false,
    //       total: dataAttributes.getNamedItem('data-show-total')?.value === 'yes' ? true : false,
    //       customMessage:
    //         dataAttributes.getNamedItem('data-custom-message')?.value === 'yes' ? true : false,
    //     }

    //     renderElement(element,
    //       <Suspense>
    //         <Checkout cartPriceProps={cartPricePropsCheckout} />
    //       </Suspense>)
    //     break

    //   case 'product-detail':
    //     const id = dataAttributes.getNamedItem('data-product')?.value

    //     const ProductDetail = React.lazy(() => import('./widgets/ProductDetail'))
    //     renderElement(element, <ProductDetail id={id!} />)
    //     break

    //   case 'cart':
    //     const cartPricePropsCart = {
    //       subTotal:
    //         dataAttributes.getNamedItem('data-show-subtotal')?.value === 'yes' ? true : false,
    //       tax: dataAttributes.getNamedItem('data-show-tax')?.value === 'yes' ? true : false,
    //       shipping:
    //         dataAttributes.getNamedItem('data-show-shipping')?.value === 'yes' ? true : false,
    //       total: dataAttributes.getNamedItem('data-show-total')?.value === 'yes' ? true : false,
    //       customMessage:
    //         dataAttributes.getNamedItem('data-custom-message')?.value === 'yes' ? true : false,
    //     }
    //     const Cart = React.lazy(() => import('./widgets/Cart'))
    //     renderElement(element, <Suspense><Cart cartPriceProps={cartPricePropsCart} /></Suspense>)
    //     break

    //   case 'search-field':
    //     const SearchField = React.lazy(() => import('./widgets/SearchField'))
    //     renderElement(
    //       element,
    //       <Suspense><SearchField openOnButton={true} autofocus={true} /></Suspense>,
    //     )
    //     break

    //   case 'currency-chooser':
    //     const CurrencyChooser = React.lazy(() => import('./widgets/CurrencyChooser'))
    //     renderElement(element, <Suspense><CurrencyChooser /></Suspense>)
    //     break

    //   case 'order-confirmation':
    //     const OrderConfirmation = React.lazy(() => import('./widgets/OrderConfirmation'))
    //     renderElement(element, <Suspense><OrderConfirmation /></Suspense>)
    //     break

    //   case 'order-view':
    //     const OrderView = React.lazy(() => import('./widgets/OrderView'))
    //     renderElement(element, <Suspense><OrderView /></Suspense>)
    //     break

    //   case 'dropdown-cart':
    //     const DropdownCart = React.lazy(() => import('./widgets/DropdownCart'))
    //     renderElement(element, <Suspense><DropdownCart dropdownEnabled={false} /></Suspense>)
    //     break

    //   case 'login':
    //     //TODO move url to translation file
    //     const handleTriggerClick = () => {
    //       window.location.href = '/'
    //     }
    //     const Login = React.lazy(() => import('./widgets/Login'))
    //     renderElement(
    //       element,
    //       <Suspense><Login onContinueAsGuest={handleTriggerClick} onLoggedIn={handleTriggerClick} /></Suspense>
    //     )
    //     break
    //   case 'account-dropdown':
    //     const items = dataAttributes.getNamedItem('data-dropdown-items')?.value
    //     let accountDropdownItems = []

    //     if (items) {
    //       accountDropdownItems = JSON.parse(items)
    //     }

    //     const AccountDropdown = React.lazy(() => import('./widgets/AccountDropdown'))

    //     renderElement(
    //       element,
    //       <Suspense><AccountDropdown useLoginModal={false} dropdownItems={accountDropdownItems} /></Suspense>,
    //     )
    //     break

    //   case 'account-details':
    //     const CustomerDetails = React.lazy(() => import('./widgets/CustomerDetails'))
    //     renderElement(element, <Suspense><CustomerDetails /></Suspense>)
    //     break

    //   case 'orders':
    //     const take = dataAttributes.getNamedItem('data-orders-take')?.value
    //     const sort = dataAttributes.getNamedItem('data-orders-sort')?.value
    //     const stateFilter = dataAttributes.getNamedItem('data-orders-state-filter')?.value

    //     let filters: string[] = []

    //     if (stateFilter) {
    //       filters = stateFilter.split(', ')
    //     }

    //     const orderListOptions: OrderListOptions = {
    //       take: take ? +take : 10,
    //       sort: { [sort ? sort : 'createdAt']: 'DESC' },
    //     }

    //     if (filters.length > 0) {
    //       orderListOptions.filter = {
    //         state: {
    //           in: filters,
    //         },
    //       }
    //     }

    //     const Orders = React.lazy(() => import('./widgets/Orders'))

    //     renderElement(element, <Suspense><Orders orderListOptions={orderListOptions} /></Suspense>)
    //     break
    // }
  })
}

if (document.readyState !== 'loading') {
  init()
} else {
  document.addEventListener('DOMContentLoaded', function () {
    init()
  })
}

const getLangData = () => {
  const langData = localStorage.getItem('ecomLangData')

  if (langData) {
    const jsonLangData = JSON.parse(langData)

    const resourceBundles = []

    for (const lang in jsonLangData) {
      // eslint-disable-next-line no-prototype-builtins
      if (jsonLangData.hasOwnProperty(lang)) {
        const bundle = {
          lng: lang,
          ns: 'translation',
          resources: jsonLangData[lang],
        }
        resourceBundles.push(bundle)
      }
    }
    return resourceBundles
  }
  return undefined
}

const getQueryUpdates = () => {
  const queryUpdates = localStorage.getItem('ecomQueryUpdates')
  if (queryUpdates) {
    return JSON.parse(queryUpdates)
  }
  return undefined
}

const getConfig = () => {
  const config = localStorage.getItem('ecomConfig')
  if (config) {
    return JSON.parse(config)
  }
  return undefined
}
