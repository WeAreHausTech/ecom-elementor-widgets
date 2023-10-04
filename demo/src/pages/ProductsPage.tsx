import { SortOrder } from '@haus-tech/ecom-components'
import { ProductList } from '../../../components/product-list/ProductList'

const availableSortOptions = [
  { label: 'Namn', value: { name: SortOrder.Asc } },
  { label: 'Pris fallande', value: { price: SortOrder.Desc } },
  { label: 'Pris stigande', value: { price: SortOrder.Asc } },
]

const searchInputProps = {
  take: 12,
}

export const ProductsPage = () => {
  return (
    <>
      <ProductList
        searchInputProps={{ ...searchInputProps }}
        availableSortOptions={availableSortOptions}
      />
    </>
  )
}
