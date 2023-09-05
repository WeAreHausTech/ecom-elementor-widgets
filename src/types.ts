import { HTMLAttributes } from 'react'

export interface CustomHTMLElement extends Omit<HTMLAttributes<HTMLOrSVGElement>, 'children'> {
  wrapperTag?: keyof JSX.IntrinsicElements
}
