import classNames from 'classnames'
import { createElement } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  color?: 'default' | 'blue'
  variant?: 'default' | 'outline'
  rounded?: 'default' | 'full'
}

export const Button = ({ children, color, variant, rounded, className, ...props }: ButtonProps) => {
  return createElement(
    'button',
    Object.assign({ className: classNames('Button', className, color, variant, rounded) }, props),
    children,
  )
}
