import { HTMLAttributes } from 'react'

export interface VendureImageProps extends HTMLAttributes<HTMLImageElement> {
  src?: string
  alt?: string
  imageSize?: [number, number]
}

export const VendureImage = ({ src: initialSrc, alt, imageSize, ...rest }: VendureImageProps) => {
  const src = imageSize ? `${initialSrc}?w=${imageSize[0]}&h=${imageSize[1]}` : initialSrc

  return <img src={src} alt={alt} {...rest} />
}
