import classnames from 'classnames'
import shapes from './shapes.svg'

interface IconProps {
  flip?: boolean
  name: string
  rotate?: number
  className?: string
  size?: number
}

export function Icon({ name, flip, rotate, className, size }: IconProps): JSX.Element {
  let transform
  if (rotate) {
    transform = `rotate(${rotate}deg)`
  } else if (flip) {
    transform = 'rotateY(180deg)'
  }

  return (
    <svg
      preserveAspectRatio="xMidYMid meet"
      style={{ width: size, height: size, transform }}
      className={classnames('icon', `icon-${name}`, className)}
    >
      <use xlinkHref={`${shapes}#${name}`} />
    </svg>
  )
}
