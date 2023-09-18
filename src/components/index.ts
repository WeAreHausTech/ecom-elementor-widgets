import { VendureApolloProvider } from '@/providers/vendure/VendureApolloProvider'

// Products
import { ProductList, ProductListProps } from '@/components/product-list/ProductList'
import { ProductSort, ProductSortProps } from './products-sort/ProductSort'
import { SearchProducts, SearchProductsProps } from './search-products/SearchProducts'
import { SearchResults, SearchResultProps } from './search-results/SearchResults'

// Cart
import { AddToCart, AddToCartProps } from './add-to-cart/AddToCart'
import { CartContent, CartContentsProps } from './cart-content/CartContent'
import { CartRemoveItem, CartRemoveItemProps } from './cart-remove-item/CartRemoveItem'
import { CartTotals, CartTotalsProps } from './cart-totals/CartTotals'
import { AdjustOrderLine, AdjustOrderLineProps } from './adjust-order-line/AdjustOrderLine'

// Order
import {
  OrderBillingAddress,
  OrderBillingAddressProps,
} from './order-billing-address/OrderBillingAddress'
import {
  OrderShippingAddress,
  OrderShippingAddressProps,
} from './order-shipping-address/OrderShippingAddress'
import { OrderMessage, OrderMessageProps } from './order-message/OrderMessage'
import { OrderCustomer, OrderCustomerProps } from './order-customer/OrderCustomer'
import { ShippingMethod, ShippingMethodsProps } from './shipping-method/ShippingMethod'
import { OrderState, OrderStateProps } from './order-state/OrderState'
import { PaymentMethods, PaymentMethodsProps } from './payment-methods/PaymentMethods'

// Price
import { Price, PriceProps } from './price/Price'

// hooks
import { usePaymentMethods } from '@/hooks/usePaymentMethods'
import { useShippingMethods } from '@/hooks/useShippingMethod'
import { useOrderState } from '@/hooks/useOrderState'
import { useBillingAddress } from '@/hooks/useBillingAddress'
import { useActiveOrder } from '@/hooks/useActiveOrder'

// Authentication
import { Login, LoginProps } from './account/Login'

// error
import { isErrorResult, isError, isApolloError, getError } from '@/utils/utils'
export { isErrorResult, isError, isApolloError, getError }

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
}

export type { Pagination, Loading, GenericApolloError } from '@/types'
export type { ApolloError } from '@apollo/client'
export * from '@/gql/graphql'
