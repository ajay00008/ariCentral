'use client'

import { useMediaQuery } from 'react-responsive'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useSwiperProvider } from '@/providers/SwiperProvider'
import { UnitPlanCard } from '@/components/Cards/UnitPlanCard'
import 'swiper/scss'

interface Props {
  data: Unit[] | CustomUnit[]
  currency: Currency
  comission: number
  slidesChanges: number
  isCommissionEnabled: boolean
  onSlideChange: () => void
  onActiveIndexChange: (index: number) => void
}

export function FloorPlanSwiper ({ data, currency, comission, slidesChanges, isCommissionEnabled, onSlideChange, onActiveIndexChange }: Props): React.ReactNode {
  const { setSwiper } = useSwiperProvider()
  const isLaptopScreen = useMediaQuery({ query: '(min-width: 1280px) and (max-width: 1727px)' })
  const isBDesktopScreen = useMediaQuery({ query: '(min-width: 1728px)' })

  return (
    <Swiper
      spaceBetween={16}
      initialSlide={0}
      onSlideChange={() => onSlideChange()}
      onActiveIndexChange={(e) => onActiveIndexChange(e.activeIndex)}
      onSwiper={(swiper) => setSwiper(swiper)}
      allowTouchMove={!isLaptopScreen && !isBDesktopScreen}
      breakpoints={{
        375: {
          slidesPerView: 1
        },
        768: {
          slidesPerView: 1.9
        },
        1280: {
          spaceBetween: 32,
          slidesPerView: 1
        },
        1728: {
          spaceBetween: 24,
          slidesPerView: 1
        }
      }}
    >
      {data.map((unit) => (
        <SwiperSlide key={unit.id} className='swiper-slide'>
          <UnitPlanCard
            key={unit.id}
            data={unit}
            currency={currency}
            commission={comission}
            slideChanged={slidesChanges}
            isCommissionEnabled={isCommissionEnabled}
            onSlideChange={onSlideChange}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
