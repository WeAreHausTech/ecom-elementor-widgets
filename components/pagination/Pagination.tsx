import { Pagination as IPagination } from '@haus-tech/ecom-components'
import { Button } from '../button/Button'

interface PaginationProps {
  pagination?: IPagination
}

export const Pagination = ({ pagination }: PaginationProps) => {
  if (!pagination) return null
  const { itemsPerPage, currentPage, totalPages, totalItems, canGoForward, nextPage } = pagination

  const showing = itemsPerPage * currentPage > totalItems ? totalItems : itemsPerPage * currentPage

  return (
    <div className="Pagination">
      <div>
        Visar {showing} av {totalItems}
      </div>
      <div className="pagination-progress">
        <div
          className="pagination-progress-bar"
          style={{ width: `${(currentPage / totalPages) * 100}%` }}
        />
      </div>

      <div className="pagination-buttons">
        <Button
          className="load-more-button"
          color="blue"
          disabled={!canGoForward}
          onClick={nextPage}
        >
          Visa mer
        </Button>
      </div>
    </div>
  )
}
