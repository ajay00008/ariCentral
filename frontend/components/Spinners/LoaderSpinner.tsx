'use client'

import { LoaderCircle } from 'lucide-react'

interface Props {
  width?: number
  height?: number
  isUnitGallery?: boolean
  isPropertyGallery?: boolean
}

export function LoaderSpinner ({ width, height, isUnitGallery, isPropertyGallery }: Props): React.ReactNode {
  const containerStyles = width !== undefined && height !== undefined && (isUnitGallery ?? false)
    ? 'smobile:h-[230px] mobile:h-[264px] tablet:h-[470px] laptop:h-[630px] desktop:h-[710px] bdesktop:h-[800px] flex items-center justify-center'
    : (isPropertyGallery ?? false)
        ? 'smobile:h-[290px] mobile:h-[328px] tablet:h-[585px] laptop:h-[655px] desktop:h-[710px] bdesktop:h-[900px] flex items-center justify-center'
        : 'flex items-center justify-center h-full'
  return (
    <div
      className={containerStyles}
    >
      <LoaderCircle className='w-32 h-32 animate-spin' />
    </div>
  )
};
