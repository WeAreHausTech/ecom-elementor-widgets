import { HTMLAttributes } from 'react'

export interface CustomHTMLElement extends Omit<HTMLAttributes<HTMLOrSVGElement>, 'children'> {
  wrapperTag?: keyof JSX.IntrinsicElements
}

export interface Pagination {
  totalItems: number
  totalPages: number
  currentPage: number
  canGoBack: boolean
  canGoForward: boolean
  nextPage: () => void
  prevPage: () => void
}
