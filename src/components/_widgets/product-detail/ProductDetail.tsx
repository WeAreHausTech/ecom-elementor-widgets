import { getFragmentData } from '@/gql'
import { DetailedProductFragment, DetailedProductVariantFragment } from '@/gql/graphql'
import {
  DETAILED_PRODUCT,
  PRODUCT,
  DETAILED_PRODUCT_VARIANT,
} from '@/providers/vendure/products/products'
import { CustomHTMLElement, ChildrenProps, RequireAtLeastOne, GenericApolloError } from '@/types'
import { Store, useStore } from '@tanstack/react-store'
import { HTMLAttributes, ReactNode, useCallback, useMemo, useState } from 'react'
import { VendureImage } from '@/components/_store-components/vendure-image/VendureImage'
import { useCustomQuery } from '@/hooks/useCustomQuery'
import { useElementSize } from '@/hooks/useElementSize'
import { useDebounce } from '@/hooks/useDebounce'
import { renderChildren } from '@/utils/utils'
import { useAddItemToOrder } from '@/hooks/useAddItemToOrder'
import * as Accordion from '@radix-ui/react-accordion'
import { Text } from '@/components/_util-components/Text'

type ProductInputVariable = RequireAtLeastOne<{ id: string; slug: string }>

export type ProductDetailProps = {
  children: ChildrenProps<{ product: DetailedProductFragment | null | undefined }>
} & ProductInputVariable &
  CustomHTMLElement

export const ProductDetail = ({
  wrapperTag: Wrapper = 'div',
  id,
  slug,
  children,
  ...rest
}: ProductDetailProps) => {
  const product = useStore(store, (state) => state.product)
  const { loading, error } = useCustomQuery(PRODUCT, {
    variables: { id, slug },
    onCompleted: (data) => {
      const product = getFragmentData(DETAILED_PRODUCT, data.product)
      const variants = getFragmentData(DETAILED_PRODUCT_VARIANT, product!.variants)

      store.setState((state) => ({
        ...state,
        selectedProductVariantId: variants[0].id,
        selectedProductVariant: variants[0],
        product: product!,
      }))
    },
  })

  if (error) return <p>Error: {error.message}</p>
  if (loading || !product) return <p>Loading...</p>

  return <Wrapper {...rest}>{renderChildren(children, { product })}</Wrapper>
}

// ProductImageSlider ========================================

interface ProductImageSliderProps extends HTMLAttributes<HTMLDivElement> {
  thumbWrapperClassName?: string
  thumbWrapperProps?: Omit<HTMLAttributes<HTMLDivElement>, 'className'>
  thumbClassName?: string
  thumbProps?: Omit<HTMLAttributes<HTMLButtonElement>, 'className'>
  imageSize?: [number, number]
  hideThumbsIfSingle?: boolean
  children?: ReactNode
}

const ProductImageSlider = ({
  thumbWrapperClassName,
  thumbWrapperProps,
  thumbClassName,
  thumbProps,
  imageSize,
  hideThumbsIfSingle = true,
  children,
  ...rest
}: ProductImageSliderProps) => {
  const [wrapperRef, { width, height }] = useElementSize()
  const debouncedWrapperSize = useDebounce<[number, number]>([width, height], 100)

  const { product } = useStore(store, (state) => state)
  const [activeSlide, setActiveSlide] = useState(0)

  const handleThumbClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>, index: number) => {
      thumbProps?.onClick?.(e)
      setActiveSlide(index)
    },
    [thumbProps],
  )

  return (
    <div {...rest} ref={wrapperRef}>
      {debouncedWrapperSize[0] > 0 && (
        <>
          <VendureImage
            src={product?.assets[activeSlide].preview}
            alt={product?.name}
            imageSize={imageSize || [800, 800]}
          />

          <div
            data-active-slide={activeSlide}
            className={thumbWrapperClassName}
            {...thumbWrapperProps}
          >
            {!hideThumbsIfSingle &&
              product?.assets.map((asset, index) => (
                <button
                  key={asset.id}
                  onClick={(e) => handleThumbClick(e, index)}
                  data-active={activeSlide === index}
                  className={thumbClassName}
                  {...thumbProps}
                >
                  <VendureImage src={asset.preview} alt={product?.name} imageSize={[100, 100]} />
                </button>
              ))}
          </div>
        </>
      )}
      {children}
    </div>
  )
}

// Product Add to Cart ========================================
interface ProductAddToCartProps extends CustomHTMLElement<HTMLButtonElement> {
  children?: ChildrenProps<{
    loading: boolean
    error: GenericApolloError | undefined
  }>
}
const ProductAddToCart = ({ children = 'Add to cart', ...rest }: ProductAddToCartProps) => {
  const { selectedProductVariantId } = useStore(store, (state) => state)
  const { addItemToOrder, error, loading } = useAddItemToOrder()

  const handleAddToCart = useCallback(() => {
    addItemToOrder(selectedProductVariantId, 1)
  }, [selectedProductVariantId, addItemToOrder])

  return (
    <button {...rest} data-loading={loading} data-error={error?.message} onClick={handleAddToCart}>
      {renderChildren(children, { loading, error })}
    </button>
  )
}

// Product Content ========================================
interface ProductContentProps extends CustomHTMLElement {
  children: ChildrenProps<{
    product: DetailedProductFragment
    selectedProductVariant: DetailedProductVariantFragment
  }>
}
const ProductContent = ({
  wrapperTag: Wrapper = 'div',
  children,
  ...rest
}: ProductContentProps) => {
  const { product, selectedProductVariant } = useStore(store, (state) => state)

  return (
    <Wrapper {...rest}>
      {renderChildren(children, {
        product: product!,
        selectedProductVariant: selectedProductVariant!,
      })}
    </Wrapper>
  )
}

// Product In Stock ========================================
interface ProductInStockProps extends CustomHTMLElement {
  children?: ChildrenProps<{ inStock: boolean }>
}

const ProductInStock = ({
  wrapperTag: Wrapper = 'div',
  children,
  ...rest
}: ProductInStockProps) => {
  const { selectedProductVariant } = useStore(store, (state) => state)
  const inStock = selectedProductVariant?.stockLevel === 'IN_STOCK'
  return (
    <Wrapper {...rest} data-in-stock={inStock}>
      {renderChildren(children, {
        inStock,
      })}
    </Wrapper>
  )
}

// Product Info ========================================

type ProductInfoProps = HTMLAttributes<HTMLDivElement>

const ProductInfo = ({ children, ...rest }: ProductInfoProps) => {
  const value = useStore(store, (state) => state.openInfoItems)

  const handleValueChange = (value: string[]) => {
    store.setState((state) => ({
      ...state,
      openInfoItems: value,
    }))
  }

  return (
    <Accordion.Root
      value={value}
      onValueChange={handleValueChange}
      defaultValue={['description']}
      type="multiple"
      asChild
    >
      <div {...rest}>{children}</div>
    </Accordion.Root>
  )
}

interface ProductInfoItemProps extends CustomHTMLElement<HTMLDivElement> {
  value: string
  className?: string
  children: ChildrenProps<{ isOpen: boolean; product: DetailedProductFragment; value: string }>
}
const ProductInfoItem = ({ className, value, children }: ProductInfoItemProps) => {
  const { openInfoItems, product } = useStore(store, (state) => state)
  const isOpen = openInfoItems.includes(value)

  return (
    <Accordion.Item value={value} className={className}>
      {renderChildren(children, { isOpen, product: product!, value })}
    </Accordion.Item>
  )
}

type ProductInfoItemTriggerProps = HTMLAttributes<HTMLButtonElement>
const ProductInfoItemTrigger = ({ className, children, ...rest }: ProductInfoItemTriggerProps) => {
  return (
    <Accordion.Trigger {...rest} className={className}>
      {children}
    </Accordion.Trigger>
  )
}

interface ProductInfoContentProps extends CustomHTMLElement<HTMLDivElement> {
  value: string
  children?: ChildrenProps<{ product: DetailedProductFragment }>
}
const ProductInfoContent = ({ children, value, ...rest }: ProductInfoContentProps) => {
  const { product } = useStore(store, (state) => state)
  const renderContent = useMemo(() => {
    if (children) {
      return renderChildren(children, { product: product! })
    }

    return <Text text={(product![value as keyof DetailedProductFragment] as string) || ''} />
  }, [children, product, value])

  return <Accordion.Content {...rest}>{renderContent}</Accordion.Content>
}

interface StoreState {
  product: DetailedProductFragment | null
  selectedProductVariantId: string
  selectedProductVariant: DetailedProductVariantFragment | null
  openInfoItems: string[]
}
const store = new Store<StoreState>({
  product: null,
  selectedProductVariantId: '',
  selectedProductVariant: null,
  openInfoItems: ['description'],
})

ProductDetail.ImageSlider = ProductImageSlider
ProductDetail.AddToCart = ProductAddToCart
ProductDetail.Content = ProductContent
ProductDetail.InStock = ProductInStock
ProductDetail.Info = ProductInfo
ProductDetail.InfoItem = ProductInfoItem
ProductDetail.InfoTrigger = ProductInfoItemTrigger
ProductDetail.InfoContent = ProductInfoContent
