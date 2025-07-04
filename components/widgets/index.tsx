// Ecom Widgets - do not modify
import { EnabledFilter, OrderListOptions } from '@haus-tech/ecom-components'
import { get, lowerCase, size } from 'lodash'
import React, { ComponentProps, Suspense } from 'react'
import { FiltersWrapper } from '@haus-tech/ecom-components'
import { ConditionalTemplateProps } from '../widgets-renderer'

export default {
  productList: (dataAttributes: NamedNodeMap) => {
    const productListIdentifier = dataAttributes.getNamedItem('data-product-list-identifier')?.value
    const facetsAttributes = dataAttributes.getNamedItem('data-facet')?.value
    const facetArray = facetsAttributes?.split(',').filter(Number).map(String)
    const collectionId = dataAttributes.getNamedItem('data-collection')?.value
    const enablePagination = +get(
      dataAttributes.getNamedItem('data-pagination-enabled'),
      'value',
      0,
    )
    const enableSort = +get(dataAttributes.getNamedItem('data-sort-enabled'), 'value', 0)
    const priceFilterEnabled = +get(
      dataAttributes.getNamedItem('data-price-filter-enabled'),
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

    if (priceFilterEnabled) {
      filtersArray.push({ type: 'price' })
    }

    const ProductList = React.lazy(() => import('./ProductList'))

    return (
      <Suspense>
        <ProductList
          productListIdentifier={productListIdentifier}
          searchInputProps={{
            facetValueIds: size(facetArray) > 0 ? facetArray : [],
            take: +get(dataAttributes.getNamedItem('data-take'), 'value', 12),
            collectionId: collectionId,
          }}
          enablePagination={Boolean(enablePagination)}
          enableSorting={Boolean(enableSort)}
          enabledFilters={size(filtersArray) > 0 ? filtersArray : undefined}
          enableSkeletonLoader={import.meta.env.VITE_ENABLE_SKELETON_PRODUCT_LIST === 'true'}
        />
      </Suspense>
    )
  },

  productListFilters: (dataAttributes: NamedNodeMap) => {
    const productListIdentifier = dataAttributes.getNamedItem('data-product-list-identifier')?.value
    const priceFilterEnabled = +get(
      dataAttributes.getNamedItem('data-price-filter-enabled'),
      'value',
      0,
    )
    const showFiltersAsValue = dataAttributes.getNamedItem('data-show-filters-as')?.value
    const maxSkeletonLoaders = dataAttributes.getNamedItem('data-max-skeleton-loaders')?.value
    const mobileAsModal = dataAttributes.getNamedItem('data-mobile-as-modal')?.value
    const mobileBreakpoint = dataAttributes.getNamedItem('data-mobile-breakpoint')?.value ?? '768'

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

    if (priceFilterEnabled) {
      filtersArray.push({ type: 'price' })
    }

    if (size(filtersArray) === 0) {
      return null
    }

    const ProductListFilters = React.lazy(() => import('./Filters.tsx'))

    let showFilters: FiltersWrapper

    switch (showFiltersAsValue) {
      case 'accordion':
        showFilters = {
          as: 'accordion',
          type: 'multiple',
          collapsible: true,
        }
        break
      case 'dropdown':
        showFilters = {
          as: 'dropdown',
        }
        break
      default:
        showFilters = {
          as: 'dropdown',
        }
        break
    }

    if (mobileAsModal === 'yes') {
      showFilters.mobile = {
        as: 'modal',
        mobileBreakpoint: parseInt(mobileBreakpoint),
      }
    }

    filtersArray.map((filter, index) => {
      const maxLoaders = maxSkeletonLoaders ? JSON.parse(maxSkeletonLoaders) : filtersArray.length
      filter.showSkeletonLoader = index < maxLoaders ? true : false
    })

    return (
      <Suspense>
        <ProductListFilters
          enabledFilters={filtersArray}
          productListIdentifier={productListIdentifier}
          showFiltersAs={showFilters}
        />
      </Suspense>
    )
  },

  productListSort: (dataAttributes: NamedNodeMap) => {
    const productListIdentifier = dataAttributes.getNamedItem('data-product-list-identifier')?.value
    const openInModal = dataAttributes.getNamedItem('data-open-in-modal')?.value === 'yes'
    const mobileBreakpoint = dataAttributes.getNamedItem('data-mobile-breakpoint')?.value
    const Sort = React.lazy(() => import('./Sort.tsx'))

    return (
      <Suspense>
        <Sort
          productListIdentifier={productListIdentifier}
          openInModal={openInModal}
          mobileBreakpoint={mobileBreakpoint ? parseInt(mobileBreakpoint) : undefined}
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

  productImageCarousel: (dataAttributes: NamedNodeMap) => {
    const slug = dataAttributes.getNamedItem('data-product-slug')?.value
    const id = dataAttributes.getNamedItem('data-product-id')?.value
    const variantImagesOnly =
      dataAttributes.getNamedItem('data-variant-images-only')?.value === 'yes' ? true : false

    const propToUse = id ? { id } : { slug: slug! }

    const ProductImageCarousel = React.lazy(() => import('./ProductImageCarousel'))

    return (
      propToUse && (
        <Suspense>
          <ProductImageCarousel {...propToUse} variantImagesOnly={variantImagesOnly} />
        </Suspense>
      )
    )
  },

  productVariantOptions: (dataAttributes: NamedNodeMap) => {
    const slug = dataAttributes.getNamedItem('data-product-slug')?.value
    const id = dataAttributes.getNamedItem('data-product-id')?.value

    const propToUse = id ? { id } : { slug: slug! }

    const useUrl = +get(dataAttributes.getNamedItem('data-use-url'), 'value', 0)
    const optionVariable = dataAttributes.getNamedItem('data-option-variable')?.value as
      | 'id'
      | 'code'
      | undefined

    const selectFirstVariant = +get(
      dataAttributes.getNamedItem('data-select-first-variant'),
      'value',
      0,
    )

    const optionType =
      (dataAttributes.getNamedItem('data-option-type')?.value as 'select' | 'radio') ?? 'select'

    const ProductVariantOptions = React.lazy(() => import('./ProductVariantOptions'))

    return (
      <Suspense>
        <ProductVariantOptions
          useUrl={Boolean(useUrl)}
          optionVariable={optionVariable}
          selectFirstVariant={Boolean(selectFirstVariant)}
          displayAs={{
            type: optionType,
            as: optionType === 'select' ? undefined : 'pill',
          }}
          {...propToUse}
        />
      </Suspense>
    )
  },

  addToCartButtonWidget: () => {
    const AddToCartButtonWidget = React.lazy(() => import('./AddToCartButton'))

    return (
      <Suspense>
        <AddToCartButtonWidget />
      </Suspense>
    )
  },

  orderlines: () => {
    const OrderLines = React.lazy(() => import('./Orderlines'))

    return (
      <Suspense>
        <OrderLines withPrice={true} adjusteableBy="buttons" />
      </Suspense>
    )
  },

  cartPrice: (dataAttributes: NamedNodeMap) => {
    const cartPriceProps = {
      subTotal: dataAttributes.getNamedItem('data-show-subtotal')?.value === 'yes' ? true : false,
      tax: dataAttributes.getNamedItem('data-show-tax')?.value === 'yes' ? true : false,
      shipping: dataAttributes.getNamedItem('data-show-shipping')?.value === 'yes' ? true : false,
      total: dataAttributes.getNamedItem('data-show-total')?.value === 'yes' ? true : false,
      customMessage:
        dataAttributes.getNamedItem('data-custom-message')?.value === 'yes' ? true : false,
    }

    const CartPrice = React.lazy(() => import('./CartPrice'))

    return (
      <Suspense>
        <CartPrice {...cartPriceProps} />
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
    const showRepeatOrderButton =
      dataAttributes.getNamedItem('data-show-repeat-order-button')?.value === 'yes' ? true : false
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
        <Orders showRepeatOrderButton={showRepeatOrderButton} />
      </Suspense>
    )
  },
  relatedProducts: (dataAttributes: NamedNodeMap) => {
    const id = dataAttributes.getNamedItem('data-product')?.value
    const facet = dataAttributes.getNamedItem('data-facet')?.value

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
      case 'view-item':
        return (
          <Suspense>
            <ViewItemEvent productId={productId ?? ''} />
          </Suspense>
        )
      default:
        return
    }
  },

  productPrice: (dataAttributes: NamedNodeMap) => {
    const PriceComponent = React.lazy(() => import('./PriceComponent'))
    const productSlug = dataAttributes.getNamedItem('data-product-slug')?.value
    const productId = dataAttributes.getNamedItem('data-product-id')?.value
    const propToUse = productId ? { productId } : { productSlug: productSlug! }
    const showSkeletonLoader =
      dataAttributes.getNamedItem('data-show-skeleton-loader')?.value === 'yes' ? true : false

    return (
      <Suspense>
        <PriceComponent {...propToUse} showSkeletonLoader={showSkeletonLoader} />
      </Suspense>
    )
  },

  productBadges: (dataAttributes: NamedNodeMap) => {
    const ProductBadges = React.lazy(() => import('./ProductBadges.tsx'))
    const badgesPositions = dataAttributes.getNamedItem('data-badge-positions')?.value
    const productSlug = dataAttributes.getNamedItem('data-product-slug')?.value
    const productId = dataAttributes.getNamedItem('data-product-id')?.value

    let badgePositionsArray: string[] = []
    if (badgesPositions) {
      badgePositionsArray = badgesPositions.split(',').map((position) => position.trim())
    }

    return (
      <Suspense>
        <ProductBadges
          {...(badgePositionsArray.length > 0 && { badgesPositions: badgePositionsArray })}
          id={productId}
          slug={productSlug ?? ''}
        />
      </Suspense>
    )
  },
  conditionalTemplate: (
    dataAttributes: NamedNodeMap,
    widgetProps: ConditionalTemplateProps | undefined,
  ) => {
    const ConditionalTemplate = React.lazy(() => import('./ConditionalTemplate.tsx'))
    const templateId = dataAttributes.getNamedItem('data-template-id')?.value
    const templateIdFalse = dataAttributes.getNamedItem('data-template-id-false')?.value
    const selectedCondition = dataAttributes.getNamedItem('data-condition')
      ?.value as ComponentProps<typeof ConditionalTemplate>['selectedCondition']
    const productId = dataAttributes.getNamedItem('data-product-id')?.value

    if ((!templateId && !templateIdFalse) || !selectedCondition) {
      return null
    }

    return (
      <Suspense>
        <ConditionalTemplate
          templateId={templateId}
          templateIdFalse={templateIdFalse}
          selectedCondition={selectedCondition}
          customConditions={widgetProps?.conditions}
          productId={productId}
        />
      </Suspense>
    )
  },
}
