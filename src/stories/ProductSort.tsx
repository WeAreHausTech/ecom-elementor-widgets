import { ProductSort as ProductSortComponent } from '@/components/products-sort/ProductSort'
import { SortOrder } from '@/gql/graphql'

export const ProductSort = () => {
  const availableSortOptions = [
    { label: 'Name (A-Z)', value: { name: SortOrder.Asc } },
    { label: 'Name (Z-A)', value: { name: SortOrder.Desc } },
    { label: 'Price (low to high)', value: { price: SortOrder.Asc } },
    { label: 'Price (high to low)', value: { price: SortOrder.Desc } },
  ]

  return (
    <ProductSortComponent>
      {({ handleSortOptionChange }) => (
        <select
          onChange={(e) => handleSortOptionChange(JSON.parse(e.target.value))}
          defaultValue={JSON.stringify(availableSortOptions[0].value)}
          className="w-full px-4 py-2 text-base border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          {availableSortOptions.map((option, idx) => (
            <option key={idx} value={JSON.stringify(option.value)} className="">
              {option.label}
            </option>
          ))}
        </select>
      )}
    </ProductSortComponent>
  )
}
