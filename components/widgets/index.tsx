// Ecom Widgets - do not modify
import { EnabledFilter, OrderListOptions } from '@haus-tech/ecom-components'
import { get, lowerCase, size } from 'lodash'
import React, { Suspense } from 'react'

export default {
  productList: (dataAttributes: NamedNodeMap) => {
    const facetsAttributes = dataAttributes.getNamedItem('data-facet')?.value
    const facetArray = facetsAttributes?.split(',').filter(Number).map(String)
    const collectionId = dataAttributes.getNamedItem('data-collection')?.value
    const enablePagination = +get(
      dataAttributes.getNamedItem('data-pagination-enabled'),
      'value',
      0,
    )
    const enableSort = +get(dataAttributes.getNamedItem('data-sort-enabled'), 'value', 0)
    const enableAddToCart = +get(
      dataAttributes.getNamedItem('data-add-to-cart-enabled'),
      'value',
      0,
    )

    const enabledFilters = dataAttributes.getNamedItem('data-filter-values')?.value
      ? JSON.parse(dataAttributes.getNamedItem('data-filter-values')!.value)
      : null
    const filtersArray: EnabledFilter[] = enabledFilters?.map(
      (filter: { filter_value: string; filter_condition: 'AND' | 'OR'; filter_label?: string }) => {
        return {
          facetCode: filter.filter_value,
          logicalOperator: lowerCase(filter.filter_condition),
          label: filter.filter_label,
        } as EnabledFilter
      },
    )

    const ProductList = React.lazy(() => import('./ProductList'))

    return (
      <Suspense>
        <ProductList
          searchInputProps={{
            facetValueIds: size(facetArray) > 0 ? facetArray : [],
            take: +get(dataAttributes.getNamedItem('data-take'), 'value', 12),
            collectionId: collectionId,
          }}
          enablePagination={Boolean(enablePagination)}
          enableSorting={Boolean(enableSort)}
          enableAddToCartBtn={Boolean(enableAddToCart)}
          enabledFilters={size(filtersArray) > 0 ? filtersArray : undefined}
        />
      </Suspense>
    )
  },

  checkout: (dataAttributes: NamedNodeMap) => {
    const Checkout = React.lazy(() => import('./Checkout'))
    const cartPricePropsCheckout = {
      subTotal: dataAttributes.getNamedItem('data-show-subtotal')?.value === 'yes' ? true : false,
      tax: dataAttributes.getNamedItem('data-show-tax')?.value === 'yes' ? true : false,
      shipping: dataAttributes.getNamedItem('data-show-shipping')?.value === 'yes' ? true : false,
      total: dataAttributes.getNamedItem('data-show-total')?.value === 'yes' ? true : false,
      customMessage:
        dataAttributes.getNamedItem('data-custom-message')?.value === 'yes' ? true : false,
    }

    return (
      <Suspense>
        <Checkout cartPriceProps={cartPricePropsCheckout} />
      </Suspense>
    )
  },

  productDetail: (dataAttributes: NamedNodeMap) => {
    const id = dataAttributes.getNamedItem('data-product')?.value
    const ProductDetail = React.lazy(() => import('./ProductDetail'))

    return (
      <Suspense>
        <ProductDetail id={id!} />
      </Suspense>
    )
  },

  cart: (dataAttributes: NamedNodeMap) => {
    const cartPricePropsCart = {
      subTotal: dataAttributes.getNamedItem('data-show-subtotal')?.value === 'yes' ? true : false,
      tax: dataAttributes.getNamedItem('data-show-tax')?.value === 'yes' ? true : false,
      shipping: dataAttributes.getNamedItem('data-show-shipping')?.value === 'yes' ? true : false,
      total: dataAttributes.getNamedItem('data-show-total')?.value === 'yes' ? true : false,
      customMessage:
        dataAttributes.getNamedItem('data-custom-message')?.value === 'yes' ? true : false,
    }

    const Cart = React.lazy(() => import('./Cart'))

    return (
      <Suspense>
        <Cart cartPriceProps={cartPricePropsCart} />
      </Suspense>
    )
  },

  searchField: (dataAttributes: NamedNodeMap) => {
    const SearchField = React.lazy(() => import('./SearchField'))
    const openOnButton = dataAttributes.getNamedItem('data-open-on-button')?.value === 'true'
    const triggerComponentString = dataAttributes.getNamedItem('data-trigger-component')?.value

    return (
      <Suspense>
        <SearchField
          openOnButton={openOnButton}
          autofocus={true}
          triggerComponent={
            triggerComponentString ? (
              <div dangerouslySetInnerHTML={{ __html: triggerComponentString }} />
            ) : undefined
          }
        />
      </Suspense>
    )
  },

  currencyChooser: () => {
    const CurrencyChooser = React.lazy(() => import('./CurrencyChooser'))

    return (
      <Suspense>
        <CurrencyChooser />
      </Suspense>
    )
  },

  orderConfirmation: () => {
    const OrderConfirmation = React.lazy(() => import('./OrderConfirmation'))

    return (
      <Suspense>
        <OrderConfirmation />
      </Suspense>
    )
  },

  orderView: () => {
    const OrderView = React.lazy(() => import('./OrderView'))

    return (
      <Suspense>
        <OrderView />
      </Suspense>
    )
  },

  dropdownCart: (dataAttributes: NamedNodeMap) => {
    const DropdownCart = React.lazy(() => import('./DropdownCart'))
    const dropdownEnabled = +get(dataAttributes.getNamedItem('data-dropdown-enabled'), 'value', 0)

    return (
      <Suspense>
        <DropdownCart dropdownEnabled={Boolean(dropdownEnabled)} />
      </Suspense>
    )
  },

  login: () => {
    //TODO move url to translation file
    const handleTriggerClick = () => {
      window.location.href = '/'
    }
    const Login = React.lazy(() => import('./Login'))

    return (
      <Suspense>
        <Login
          onContinueAsGuest={handleTriggerClick}
          onLoggedIn={handleTriggerClick}
          showContinueAsGuest={false}
        />
      </Suspense>
    )
  },

  accountDropdown: (dataAttributes: NamedNodeMap) => {
    const items = dataAttributes.getNamedItem('data-dropdown-items')?.value
    let accountDropdownItems = []

    if (items) {
      accountDropdownItems = JSON.parse(items)
    }

    const useLoginModal = +get(dataAttributes.getNamedItem('data-use-login-modal'), 'value', 0)

    const AccountDropdown = React.lazy(() => import('./AccountDropdown'))

    return (
      <Suspense>
        <AccountDropdown
          useLoginModal={Boolean(useLoginModal)}
          dropdownItems={accountDropdownItems}
        />
      </Suspense>
    )
  },

  accountDetails: () => {
    const CustomerDetails = React.lazy(() => import('./CustomerDetails'))

    return (
      <Suspense>
        <CustomerDetails />
      </Suspense>
    )
  },

  orders: (dataAttributes: NamedNodeMap) => {
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

    const Orders = React.lazy(() => import('./Orders'))

    return (
      <Suspense>
        <Orders />
      </Suspense>
    )
  },
  relatedProducts: (dataAttributes: NamedNodeMap) => {
    const id = dataAttributes.getNamedItem('data-product')?.value
    const facet = dataAttributes.getNamedItem('data-facet')?.value
    const enableAddToCart = +get(
      dataAttributes.getNamedItem('data-add-to-cart-enabled'),
      'value',
      0,
    )

    if (!id || !facet) {
      return
    }

    const RelatedProducts = React.lazy(() => import('./RelatedProducts'))

    return (
      <Suspense>
        <RelatedProducts
          productId={id}
          facetId={facet}
          maxTake={+get(dataAttributes.getNamedItem('data-take'), 'value', 12)}
          enableAddToCartBtn={Boolean(enableAddToCart)}
        />
      </Suspense>
    )
  },
  resetPassword: () => {
    const ResetPassword = React.lazy(() => import('./ResetPassword'))

    return (
      <Suspense>
        <ResetPassword />
      </Suspense>
    )
  },
  authChecker: () => {
    const AuthChecker = React.lazy(() => import('./AuthChecker'))

    return (
      <Suspense>
        <AuthChecker />
      </Suspense>
    )
  },
  googleAnalytics: (dataAttributes: NamedNodeMap) => {
    const PurchaseEvent = React.lazy(() => import('./PurchaseEvent'))
    const BeginCheckoutEvent = React.lazy(() => import('./BeginCheckoutEvent'))
    const ViewItemEvent = React.lazy(() => import('./ViewItemEvent'))
    const event = dataAttributes.getNamedItem('data-analytics-event')?.value
    const productId = dataAttributes.getNamedItem('data-product')?.value

    switch (event) {
      case 'purchase':
        return (
          <Suspense>
            <PurchaseEvent />
          </Suspense>
        )
      case 'begin-checkout':
        return (
          <Suspense>
            <BeginCheckoutEvent />
          </Suspense>
        )
      case 'view-item' && productId && productId !== undefined:
        return (
          <Suspense>
            <ViewItemEvent productId={productId ?? ''} />
          </Suspense>
        )
      default:
        return
    }
  },
}
