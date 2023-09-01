declare global {
  interface CustomHTMLElement extends Omit<HTMLAttributes<HTMLOrSVGElement>, 'children'> {
    wrapperTag?: keyof JSX.IntrinsicElements
  }
}

export {}
