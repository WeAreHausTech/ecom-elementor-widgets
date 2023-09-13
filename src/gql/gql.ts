/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation login($email: String!, $password: String!, $rememberMe: Boolean) {\n    login(username: $email, password: $password, rememberMe: $rememberMe) {\n      __typename\n      ... on CurrentUser {\n        id\n        identifier\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.LoginDocument,
    "\n  mutation logout {\n    logout {\n      success\n    }\n  }\n": types.LogoutDocument,
    "\n  mutation addItemToOrder($productVariantId: ID!, $quantity: Int!) {\n    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {\n      ... on Order {\n        lines {\n          ...ListedOrderLines\n        }\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.AddItemToOrderDocument,
    "\n  fragment ListedOrderLines on OrderLine {\n    id\n    quantity\n    featuredAsset {\n      preview\n    }\n    productVariant {\n      name\n      price\n      priceWithTax\n      currencyCode\n      product {\n        slug\n      }\n    }\n  }\n": types.ListedOrderLinesFragmentDoc,
    "\n  query ActiveOrderLines {\n    activeOrder {\n      lines {\n        ...ListedOrderLines\n      }\n    }\n  }\n": types.ActiveOrderLinesDocument,
    "\n  fragment ListedTotalPrice on Order {\n    subTotal\n    totalWithTax\n    taxSummary {\n      taxRate\n      taxTotal\n      taxBase\n    }\n    shipping\n    currencyCode\n  }\n": types.ListedTotalPriceFragmentDoc,
    "\n  query ActiveOrderTotalPrice {\n    activeOrder {\n      ...ListedTotalPrice\n    }\n  }\n": types.ActiveOrderTotalPriceDocument,
    "\n  mutation removeOrderLine($orderLineId: ID!) {\n    removeOrderLine(orderLineId: $orderLineId) {\n      ... on Order {\n        lines {\n          ...ListedOrderLines\n        }\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.RemoveOrderLineDocument,
    "\n  fragment ListedOrderAdressOrder on OrderAddress {\n    fullName\n    company\n    streetLine1\n    streetLine2\n    city\n    province\n    postalCode\n    country\n    countryCode\n    phoneNumber\n  }\n": types.ListedOrderAdressOrderFragmentDoc,
    "\n  mutation setOrderShippingAddress($input: CreateAddressInput!) {\n    setOrderShippingAddress(input: $input) {\n      ... on Order {\n        shippingAddress {\n          ...ListedOrderAdressOrder\n        }\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.SetOrderShippingAddressDocument,
    "\n  mutation setOrderBillingAddress($input: CreateAddressInput!) {\n    setOrderBillingAddress(input: $input) {\n      ... on Order {\n        billingAddress {\n          ...ListedOrderAdressOrder\n        }\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.SetOrderBillingAddressDocument,
    "\n  query ActiveOrderShippingAddress {\n    activeOrder {\n      shippingAddress {\n        ...ListedOrderAdressOrder\n      }\n    }\n  }\n": types.ActiveOrderShippingAddressDocument,
    "\n  query ActiveOrderBillingAddress {\n    activeOrder {\n      billingAddress {\n        ...ListedOrderAdressOrder\n      }\n    }\n  }\n": types.ActiveOrderBillingAddressDocument,
    "\n  mutation setCustomerForOrder($input: CreateCustomerInput!) {\n    setCustomerForOrder(input: $input) {\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.SetCustomerForOrderDocument,
    "\n  mutation setOrderCustomFields($input: UpdateOrderInput!) {\n    setOrderCustomFields(input: $input) {\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.SetOrderCustomFieldsDocument,
    "\n  fragment EligibleShippingMethods on ShippingMethodQuote {\n    id\n    name\n  }\n": types.EligibleShippingMethodsFragmentDoc,
    "\n  query EligibleShippingMethod {\n    eligibleShippingMethods {\n      ...EligibleShippingMethods\n    }\n  }\n": types.EligibleShippingMethodDocument,
    "\n  mutation setOrderShippingMethod($shippingMethodId: [ID!]!) {\n    setOrderShippingMethod(shippingMethodId: $shippingMethodId) {\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.SetOrderShippingMethodDocument,
    "\n  mutation transitionOrderToState($input: String!) {\n    transitionOrderToState(state: $input) {\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n": types.TransitionOrderToStateDocument,
    "\n  query nextOrderStates {\n    nextOrderStates\n  }\n": types.NextOrderStatesDocument,
    "\n  fragment EligiblePaymentMethods on PaymentMethodQuote {\n    id\n    name\n    description\n    code\n  }\n": types.EligiblePaymentMethodsFragmentDoc,
    "\n  query EligiblePaymentMethods {\n    eligiblePaymentMethods {\n      ...EligiblePaymentMethods\n    }\n  }\n": types.EligiblePaymentMethodsDocument,
    "\n  mutation addPaymentToOrder($input: PaymentInput!) {\n    addPaymentToOrder (input: $input) {\n        ... on ErrorResult {\n            errorCode\n            message\n          }\n    }\n  }\n": types.AddPaymentToOrderDocument,
    "\n  fragment ListedProduct on SearchResult {\n    productId\n    productVariantId\n    productName\n    slug\n    description\n    score\n    inStock\n    productAsset {\n      id\n      preview\n    }\n    currencyCode\n    price {\n      ... on PriceRange {\n        min\n        max\n      }\n      ... on SinglePrice {\n        value\n      }\n    }\n    priceWithTax {\n      ... on PriceRange {\n        min\n        max\n      }\n      ... on SinglePrice {\n        value\n      }\n    }\n    facetIds\n    facetValueIds\n    collectionIds\n  }\n": types.ListedProductFragmentDoc,
    "\n  fragment ListedCollection on Collection {\n    id\n    name\n    slug\n    parentId\n    parent {\n      id\n      name\n      slug\n    }\n    productVariants {\n      totalItems\n    }\n    featuredAsset {\n      id\n      preview\n    }\n  }\n": types.ListedCollectionFragmentDoc,
    "\n  query search($input: SearchInput!) {\n    search(input: $input) {\n      totalItems\n      items {\n        ...ListedProduct\n      }\n      facetValues {\n        facetValue {\n          id\n          name\n          facet {\n            id\n            name\n          }\n        }\n        count\n      }\n    }\n  }\n": types.SearchDocument,
    "\n  query topSearch($input: SearchInput!) {\n    search(input: $input) {\n      totalItems\n      items {\n        ...ListedProduct\n      }\n      collections {\n        collection {\n          ...ListedCollection\n        }\n        count\n      }\n    }\n  }\n": types.TopSearchDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation login($email: String!, $password: String!, $rememberMe: Boolean) {\n    login(username: $email, password: $password, rememberMe: $rememberMe) {\n      __typename\n      ... on CurrentUser {\n        id\n        identifier\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation login($email: String!, $password: String!, $rememberMe: Boolean) {\n    login(username: $email, password: $password, rememberMe: $rememberMe) {\n      __typename\n      ... on CurrentUser {\n        id\n        identifier\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation logout {\n    logout {\n      success\n    }\n  }\n"): (typeof documents)["\n  mutation logout {\n    logout {\n      success\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation addItemToOrder($productVariantId: ID!, $quantity: Int!) {\n    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {\n      ... on Order {\n        lines {\n          ...ListedOrderLines\n        }\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation addItemToOrder($productVariantId: ID!, $quantity: Int!) {\n    addItemToOrder(productVariantId: $productVariantId, quantity: $quantity) {\n      ... on Order {\n        lines {\n          ...ListedOrderLines\n        }\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ListedOrderLines on OrderLine {\n    id\n    quantity\n    featuredAsset {\n      preview\n    }\n    productVariant {\n      name\n      price\n      priceWithTax\n      currencyCode\n      product {\n        slug\n      }\n    }\n  }\n"): (typeof documents)["\n  fragment ListedOrderLines on OrderLine {\n    id\n    quantity\n    featuredAsset {\n      preview\n    }\n    productVariant {\n      name\n      price\n      priceWithTax\n      currencyCode\n      product {\n        slug\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ActiveOrderLines {\n    activeOrder {\n      lines {\n        ...ListedOrderLines\n      }\n    }\n  }\n"): (typeof documents)["\n  query ActiveOrderLines {\n    activeOrder {\n      lines {\n        ...ListedOrderLines\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ListedTotalPrice on Order {\n    subTotal\n    totalWithTax\n    taxSummary {\n      taxRate\n      taxTotal\n      taxBase\n    }\n    shipping\n    currencyCode\n  }\n"): (typeof documents)["\n  fragment ListedTotalPrice on Order {\n    subTotal\n    totalWithTax\n    taxSummary {\n      taxRate\n      taxTotal\n      taxBase\n    }\n    shipping\n    currencyCode\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ActiveOrderTotalPrice {\n    activeOrder {\n      ...ListedTotalPrice\n    }\n  }\n"): (typeof documents)["\n  query ActiveOrderTotalPrice {\n    activeOrder {\n      ...ListedTotalPrice\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation removeOrderLine($orderLineId: ID!) {\n    removeOrderLine(orderLineId: $orderLineId) {\n      ... on Order {\n        lines {\n          ...ListedOrderLines\n        }\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation removeOrderLine($orderLineId: ID!) {\n    removeOrderLine(orderLineId: $orderLineId) {\n      ... on Order {\n        lines {\n          ...ListedOrderLines\n        }\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ListedOrderAdressOrder on OrderAddress {\n    fullName\n    company\n    streetLine1\n    streetLine2\n    city\n    province\n    postalCode\n    country\n    countryCode\n    phoneNumber\n  }\n"): (typeof documents)["\n  fragment ListedOrderAdressOrder on OrderAddress {\n    fullName\n    company\n    streetLine1\n    streetLine2\n    city\n    province\n    postalCode\n    country\n    countryCode\n    phoneNumber\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation setOrderShippingAddress($input: CreateAddressInput!) {\n    setOrderShippingAddress(input: $input) {\n      ... on Order {\n        shippingAddress {\n          ...ListedOrderAdressOrder\n        }\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation setOrderShippingAddress($input: CreateAddressInput!) {\n    setOrderShippingAddress(input: $input) {\n      ... on Order {\n        shippingAddress {\n          ...ListedOrderAdressOrder\n        }\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation setOrderBillingAddress($input: CreateAddressInput!) {\n    setOrderBillingAddress(input: $input) {\n      ... on Order {\n        billingAddress {\n          ...ListedOrderAdressOrder\n        }\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation setOrderBillingAddress($input: CreateAddressInput!) {\n    setOrderBillingAddress(input: $input) {\n      ... on Order {\n        billingAddress {\n          ...ListedOrderAdressOrder\n        }\n      }\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ActiveOrderShippingAddress {\n    activeOrder {\n      shippingAddress {\n        ...ListedOrderAdressOrder\n      }\n    }\n  }\n"): (typeof documents)["\n  query ActiveOrderShippingAddress {\n    activeOrder {\n      shippingAddress {\n        ...ListedOrderAdressOrder\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query ActiveOrderBillingAddress {\n    activeOrder {\n      billingAddress {\n        ...ListedOrderAdressOrder\n      }\n    }\n  }\n"): (typeof documents)["\n  query ActiveOrderBillingAddress {\n    activeOrder {\n      billingAddress {\n        ...ListedOrderAdressOrder\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation setCustomerForOrder($input: CreateCustomerInput!) {\n    setCustomerForOrder(input: $input) {\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation setCustomerForOrder($input: CreateCustomerInput!) {\n    setCustomerForOrder(input: $input) {\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation setOrderCustomFields($input: UpdateOrderInput!) {\n    setOrderCustomFields(input: $input) {\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation setOrderCustomFields($input: UpdateOrderInput!) {\n    setOrderCustomFields(input: $input) {\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EligibleShippingMethods on ShippingMethodQuote {\n    id\n    name\n  }\n"): (typeof documents)["\n  fragment EligibleShippingMethods on ShippingMethodQuote {\n    id\n    name\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EligibleShippingMethod {\n    eligibleShippingMethods {\n      ...EligibleShippingMethods\n    }\n  }\n"): (typeof documents)["\n  query EligibleShippingMethod {\n    eligibleShippingMethods {\n      ...EligibleShippingMethods\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation setOrderShippingMethod($shippingMethodId: [ID!]!) {\n    setOrderShippingMethod(shippingMethodId: $shippingMethodId) {\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation setOrderShippingMethod($shippingMethodId: [ID!]!) {\n    setOrderShippingMethod(shippingMethodId: $shippingMethodId) {\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation transitionOrderToState($input: String!) {\n    transitionOrderToState(state: $input) {\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation transitionOrderToState($input: String!) {\n    transitionOrderToState(state: $input) {\n      ... on ErrorResult {\n        errorCode\n        message\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query nextOrderStates {\n    nextOrderStates\n  }\n"): (typeof documents)["\n  query nextOrderStates {\n    nextOrderStates\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment EligiblePaymentMethods on PaymentMethodQuote {\n    id\n    name\n    description\n    code\n  }\n"): (typeof documents)["\n  fragment EligiblePaymentMethods on PaymentMethodQuote {\n    id\n    name\n    description\n    code\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query EligiblePaymentMethods {\n    eligiblePaymentMethods {\n      ...EligiblePaymentMethods\n    }\n  }\n"): (typeof documents)["\n  query EligiblePaymentMethods {\n    eligiblePaymentMethods {\n      ...EligiblePaymentMethods\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation addPaymentToOrder($input: PaymentInput!) {\n    addPaymentToOrder (input: $input) {\n        ... on ErrorResult {\n            errorCode\n            message\n          }\n    }\n  }\n"): (typeof documents)["\n  mutation addPaymentToOrder($input: PaymentInput!) {\n    addPaymentToOrder (input: $input) {\n        ... on ErrorResult {\n            errorCode\n            message\n          }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ListedProduct on SearchResult {\n    productId\n    productVariantId\n    productName\n    slug\n    description\n    score\n    inStock\n    productAsset {\n      id\n      preview\n    }\n    currencyCode\n    price {\n      ... on PriceRange {\n        min\n        max\n      }\n      ... on SinglePrice {\n        value\n      }\n    }\n    priceWithTax {\n      ... on PriceRange {\n        min\n        max\n      }\n      ... on SinglePrice {\n        value\n      }\n    }\n    facetIds\n    facetValueIds\n    collectionIds\n  }\n"): (typeof documents)["\n  fragment ListedProduct on SearchResult {\n    productId\n    productVariantId\n    productName\n    slug\n    description\n    score\n    inStock\n    productAsset {\n      id\n      preview\n    }\n    currencyCode\n    price {\n      ... on PriceRange {\n        min\n        max\n      }\n      ... on SinglePrice {\n        value\n      }\n    }\n    priceWithTax {\n      ... on PriceRange {\n        min\n        max\n      }\n      ... on SinglePrice {\n        value\n      }\n    }\n    facetIds\n    facetValueIds\n    collectionIds\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  fragment ListedCollection on Collection {\n    id\n    name\n    slug\n    parentId\n    parent {\n      id\n      name\n      slug\n    }\n    productVariants {\n      totalItems\n    }\n    featuredAsset {\n      id\n      preview\n    }\n  }\n"): (typeof documents)["\n  fragment ListedCollection on Collection {\n    id\n    name\n    slug\n    parentId\n    parent {\n      id\n      name\n      slug\n    }\n    productVariants {\n      totalItems\n    }\n    featuredAsset {\n      id\n      preview\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query search($input: SearchInput!) {\n    search(input: $input) {\n      totalItems\n      items {\n        ...ListedProduct\n      }\n      facetValues {\n        facetValue {\n          id\n          name\n          facet {\n            id\n            name\n          }\n        }\n        count\n      }\n    }\n  }\n"): (typeof documents)["\n  query search($input: SearchInput!) {\n    search(input: $input) {\n      totalItems\n      items {\n        ...ListedProduct\n      }\n      facetValues {\n        facetValue {\n          id\n          name\n          facet {\n            id\n            name\n          }\n        }\n        count\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query topSearch($input: SearchInput!) {\n    search(input: $input) {\n      totalItems\n      items {\n        ...ListedProduct\n      }\n      collections {\n        collection {\n          ...ListedCollection\n        }\n        count\n      }\n    }\n  }\n"): (typeof documents)["\n  query topSearch($input: SearchInput!) {\n    search(input: $input) {\n      totalItems\n      items {\n        ...ListedProduct\n      }\n      collections {\n        collection {\n          ...ListedCollection\n        }\n        count\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;