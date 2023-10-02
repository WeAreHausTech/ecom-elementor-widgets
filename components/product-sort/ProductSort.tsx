import {
  ProductSort as ProductSortWrapper,
  SearchResultSortParameter,
} from '@haus-tech/ecom-components'
import { ProductFilterSelect } from '../product-filter-select/ProductFilterSelect'

type SortOption = { label: string; value: SearchResultSortParameter }

interface ProductSortProps {
  availableSortOptions: SortOption[]
  defaultSortOption?: SortOption
}

export const ProductSort = ({ availableSortOptions, defaultSortOption }: ProductSortProps) => {
  return (
    <ProductSortWrapper className="ProductSort mb-6 mt-6">
      {({ handleSortOptionChange }) => (
        <ProductFilterSelect
          options={availableSortOptions}
          onValueChange={(value) => handleSortOptionChange(JSON.parse(value))}
          defaultValue={defaultSortOption ? JSON.stringify(defaultSortOption.value) : undefined}
        />
      )}
    </ProductSortWrapper>
  )
}
