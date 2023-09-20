import { SearchProducts as SearchProductsWrapper } from '@haus-tech/ecom-components'
import { useNavigate } from '@tanstack/react-router'

const SearchProducts = () => {
  const navigate = useNavigate()
  return (
    <SearchProductsWrapper className="searchProuducts">
      {({ term, setTerm, clear }) => {
        return (
          <div className="searchField">
            <input
              type="text"
              name="search"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="product-search-input"
              placeholder="Vad letar du efter?"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  navigate({ to: `/search?search=${term}` })
                  clear()
                }
              }}
            />
            <button onClick={() => clear()}>x</button>
          </div>
        )
      }}
    </SearchProductsWrapper>
  )
}

export default SearchProducts
