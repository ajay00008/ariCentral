'use client'

import Image from 'next/image'

interface Props {
  alt: string
  src: string
  quality?: number | `${number}`
  sizes?: string
  width: number | `${number}`
  height: number | `${number}`
  priority?: boolean
  className: string
}

export function BackgroundImage ({
  alt,
  src,
  quality = '100',
  sizes = '100vh',
  width,
  height,
  priority,
  className
}: Props): React.ReactNode {
  return (
    <Image
      alt={alt}
      src={src}
      quality={quality}
      priority={priority}
      width={width}
      height={height}
      sizes={sizes}
      className={className}
    />
  )
}
