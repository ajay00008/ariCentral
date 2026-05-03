'use client'

import * as React from 'react'
import { useSwiperProvider } from '@/providers/SwiperProvider'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  prev: boolean
  next: boolean
  slidesChanges: number
  firstDisable: boolean
  lastDisable: boolean
  onSlideChange: () => void
}

export function SwiperControlButton ({ next, prev, firstDisable, lastDisable, slidesChanges, onSlideChange }: Props): React.ReactNode {
  const [disabled, setDisabled] = React.useState<boolean>(false)
  const { swiper } = useSwiperProvider()

  React.useEffect(() => {
    if (swiper !== undefined) {
      const isBeginning = swiper?.isBeginning
      const isEnd = swiper?.isEnd
      const disabled = (prev && (isBeginning ?? false)) || (next && (isEnd ?? false))
      setDisabled(disabled)
    }
  }, [slidesChanges, swiper])

  function handleClick (): void {
    if (next) {
      if (swiper !== null && swiper !== undefined) {
        swiper.slideNext()
        onSlideChange()
      }
    } else {
      if (swiper !== null && swiper !== undefined) {
        swiper.slidePrev()
        onSlideChange()
      }
    }
  }

  return (
    <button
      type='button'
      className='smobile:flex smobile:flex-shrink-0 smobile:items-center smobile:bg-transparent smobile:justify-between smobile:rounded-[50%] smobile:border smobile:border-black smobile:py-[11px] smobile:px-[11px] smobile:disabled:opacity-20 transition duration-200'
      aria-label='Control button for slider'
      onClick={handleClick}
      disabled={prev ? disabled : lastDisable}
    >
      {prev ? <ChevronLeft className='w-[16px] h-[16px] flex flex-shrink-0' /> : <ChevronRight className='w-[16px] h-[16px] flex-shrink-0' />}
    </button>
  )
}
