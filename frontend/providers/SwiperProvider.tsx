'use client'

import * as React from 'react'
import { SwiperRef } from 'swiper/react'

interface SwiperProps {
  children: React.ReactNode
}

interface Context {
  swiper: SwiperRef['swiper'] | null | undefined
  setSwiper: React.Dispatch<React.SetStateAction<any>>
}

const SwiperContext = React.createContext<Context | null>(null)

export function SwiperProvider ({ children }: SwiperProps): React.ReactNode {
  const [swiper, setSwiper] = React.useState<SwiperRef['swiper'] | null>(null)

  const initialValue = {
    setSwiper,
    swiper
  }

  return (
    <SwiperContext.Provider value={initialValue}>
      {children}
    </SwiperContext.Provider>
  )
}

export function useSwiperProvider (): Context {
  const context = React.useContext(SwiperContext)
  if (context === null) {
    throw new Error('useSwiperProvider must be used within an SwiperProvider')
  }
  return context
}
