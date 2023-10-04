import classNames from 'classnames'
import { createElement, forwardRef } from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children?: React.ReactNode
  color?: 'default' | 'blue' | 'white'
  variant?: 'default' | 'outline'
  rounded?: 'default' | 'full'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, color, variant, rounded, className, ...props }, ref) => {
    return createElement(
      'button',
      {
        ...Object.assign(
          { className: classNames('Button', className, color, variant, rounded) },
          props,
        ),
        ref,
      },
      children,
    )
  },
)
