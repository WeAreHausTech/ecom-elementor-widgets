import { SortOrder } from '@haus-tech/ecom-components'
import { ProductSort } from '../../../components/product-sort/ProductSort'
import { ProductList } from '../../../components/product-list/ProductList'

const availableSortOptions = [
  { label: 'Namn', value: { name: SortOrder.Asc } },
  { label: 'Pris fallande', value: { price: SortOrder.Desc } },
  { label: 'Pris stigande', value: { price: SortOrder.Asc } },
]

export const ProductsPage = () => {
  return (
    <>
      <ProductSort
        availableSortOptions={availableSortOptions}
        defaultSortOption={availableSortOptions[0]}
      />

      <ProductList />
    </>
  )
}
