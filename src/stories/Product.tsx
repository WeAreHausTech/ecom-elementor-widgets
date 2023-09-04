import { Product as ProductComponent } from '@/components/product/Product'
import { ListedProductFragment } from '@/gql/graphql'
import { getPrice } from '@/utils/utils'

interface ProductProps extends CustomHTMLElement {
  product: ListedProductFragment
  thumbnailSize?: [number, number]
}

export const Product = ({ product, thumbnailSize }: ProductProps) => {
  return (
    <ProductComponent product={product} thumbnailSize={thumbnailSize} wrapperTag="div">
      {({ product, thumbnail }) => (
        <div className="mx-auto mt-11 w-80 transform overflow-hidden rounded-lg bg-white dark:bg-slate-800 shadow-md duration-300 hover:scale-105 hover:shadow-lg">
          <img
            className="h-48 w-full object-cover object-center"
            src={thumbnail}
            alt="Product Image"
          />
          <div className="p-4">
            <h2 className="mb-2 text-lg font-medium dark:text-white text-gray-900">
              {product.productName}
            </h2>
            <p className="mb-2 text-base dark:text-gray-300 text-gray-700">
              Product description goes here.
            </p>
            <div className="flex items-center">
              <p className="mr-2 text-lg font-semibold text-gray-900 dark:text-white">
                {getPrice(product.priceWithTax)} {product.currencyCode}
              </p>
            </div>
          </div>
        </div>
      )}
    </ProductComponent>
  )
}
