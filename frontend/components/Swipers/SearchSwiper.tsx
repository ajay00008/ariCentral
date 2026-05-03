'use client'

import { useMediaQuery } from 'react-responsive'
import { Swiper, SwiperSlide } from 'swiper/react'
import { useSwiperProvider } from '@/providers/SwiperProvider'
import { SearchPropertiesCard } from '@/components/Cards/SearchPropertiesCard'
import 'swiper/scss'

interface Props {
  data: PropertyMain[]
  currency: Currency
  slidesChanges: number
  swiperNumber: number
  isCommissionEnabled: boolean
  onSlideChange: () => void
}

export function SearchSwiper ({ data, currency, slidesChanges, swiperNumber, isCommissionEnabled, onSlideChange }: Props): React.ReactNode {
  const { setSwiper } = useSwiperProvider()
  const swiperClassName = `swiper-slide${swiperNumber}`

  const isLaptopScreen = useMediaQuery({ query: '(min-width: 1280px) and (max-width: 1727px)' })
  const isBDesktopScreen = useMediaQuery({ query: '(min-width: 1728px)' })

  return (
    <Swiper
      spaceBetween={16}
      initialSlide={0}
      onSlideChange={() => onSlideChange()}
      onSwiper={(swiper) => setSwiper(swiper)}
      allowTouchMove={!isLaptopScreen && !isBDesktopScreen}
      breakpoints={{
        375: {
          slidesPerView: 1
        },
        768: {
          slidesPerView: 1.9,
          spaceBetween: 24
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
      {data.map((property) => (
        <SwiperSlide key={property.id} className={swiperClassName}>
          <SearchPropertiesCard
            key={property.id}
            data={property}
            currency={currency}
            slideChanged={slidesChanges}
            swiperNumber={swiperNumber}
            isCommissionEnabled={isCommissionEnabled}
          />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
