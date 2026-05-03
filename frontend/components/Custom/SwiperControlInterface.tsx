'use client'

import { SwiperControlButton } from '@/components/Buttons/SwiperControlButton'

interface Props {
  slidesChanges: number
  firstDisable: boolean
  lastDisable: boolean
  onSlideChange: () => void
}

export function SwiperControlInterface ({ lastDisable, firstDisable, slidesChanges, onSlideChange }: Props): React.ReactNode {
  return (
    <div className='smobile:hidden smobile:h-0 laptop:flex laptop:h-auto laptop:gap-[12px]'>
      <SwiperControlButton
        prev
        next={false}
        firstDisable={firstDisable}
        lastDisable={lastDisable}
        slidesChanges={slidesChanges}
        onSlideChange={onSlideChange}
      />
      <SwiperControlButton
        next
        prev={false}
        firstDisable={firstDisable}
        lastDisable={lastDisable}
        slidesChanges={slidesChanges}
        onSlideChange={onSlideChange}
      />
    </div>
  )
}
