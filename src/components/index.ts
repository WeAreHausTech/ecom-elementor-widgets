import { VendureApolloProvider } from '@/providers/vendure/VendureApolloProvider'

// Products
import { ProductList, ProductListProps } from '@/components/_widgets/product-list/ProductList'
import { ProductSort, ProductSortProps } from './_store-components/products-sort/ProductSort'
import {
  SearchProducts,
  SearchProductsProps,
} from './_store-components/search-products/SearchProducts'
import { SearchResults, SearchResultProps } from './_store-components/search-results/SearchResults'
import { ProductDetail, ProductDetailProps } from './_widgets/product-detail/ProductDetail'
import { Search, SearchProps } from './_widgets/search/Search'

// Cart
import { AddToCart, AddToCartProps } from './_store-components/add-to-cart/AddToCart'
import { CartContent, CartContentsProps } from './_store-components/cart-content/CartContent'
import {
  CartRemoveItem,
  CartRemoveItemProps,
} from './_store-components/cart-remove-item/CartRemoveItem'
import { CartTotals, CartTotalsProps } from './_store-components/cart-totals/CartTotals'
import {
  AdjustOrderLine,
  AdjustOrderLineProps,
} from './_store-components/adjust-order-line/AdjustOrderLine'

// Order
import {
  OrderBillingAddress,
  OrderBillingAddressProps,
} from './_store-components/order-billing-address/OrderBillingAddress'
import {
  OrderShippingAddress,
  OrderShippingAddressProps,
} from './_store-components/order-shipping-address/OrderShippingAddress'
import { OrderMessage, OrderMessageProps } from './_store-components/order-message/OrderMessage'
import { OrderCustomer, OrderCustomerProps } from './_store-components/order-customer/OrderCustomer'
import {
  ShippingMethod,
  ShippingMethodsProps,
} from './_store-components/shipping-method/ShippingMethod'
import { OrderState, OrderStateProps } from './_store-components/order-state/OrderState'
import {
  PaymentMethods,
  PaymentMethodsProps,
} from './_store-components/payment-methods/PaymentMethods'

// Price
import { Price, PriceProps } from './_store-components/price/Price'

// Images
import {
  VendureImage,
  VendureImageProps,
} from '@/components/_store-components/vendure-image/VendureImage'

// hooks
import { usePaymentMethods } from '@/hooks/usePaymentMethods'
import { useShippingMethods } from '@/hooks/useShippingMethod'
import { useOrderState } from '@/hooks/useOrderState'
import { useBillingAddress } from '@/hooks/useBillingAddress'
import { useActiveOrder } from '@/hooks/useActiveOrder'

// Authentication
import { Login, LoginProps } from './_widgets/account/Login'

// Misc
import { Brand, BrandProps } from './_store-components/brand/Brand'

// error
import { isErrorResult, isError, isApolloError, getError } from '@/utils/utils'
export { isErrorResult, isError, isApolloError, getError }

import { OrderLines } from '@/components/_widgets/order-lines/OrderLines'

export {
  VendureApolloProvider,
  ProductList,
  ProductSort,
  AddToCart,
  CartContent,
  CartRemoveItem,
  CartTotals,
  OrderBillingAddress,
  OrderShippingAddress,
  OrderMessage,
  OrderCustomer,
  OrderState,
  PaymentMethods,
  ShippingMethod,
  Price,
  SearchProducts,
  SearchResults,
  usePaymentMethods,
  useShippingMethods,
  useOrderState,
  useBillingAddress,
  useActiveOrder,
  Login,
  AdjustOrderLine,
  ProductDetail,
  OrderLines,
  VendureImage,
  Search,
  Brand,
}

export type {
  ProductListProps,
  ProductSortProps,
  AddToCartProps,
  CartContentsProps,
  CartRemoveItemProps,
  CartTotalsProps,
  OrderBillingAddressProps,
  OrderShippingAddressProps,
  OrderMessageProps,
  OrderCustomerProps,
  OrderStateProps,
  PaymentMethodsProps,
  ShippingMethodsProps,
  PriceProps,
  SearchProductsProps,
  SearchResultProps,
  LoginProps,
  AdjustOrderLineProps,
  ProductDetailProps,
  VendureImageProps,
  SearchProps,
  BrandProps,
}

export type { Pagination, Loading, GenericApolloError } from '@/types'
export type { ApolloError } from '@apollo/client'
export * from '@/gql/graphql'
