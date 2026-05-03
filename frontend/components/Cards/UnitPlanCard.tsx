'use client'

import * as React from 'react'
import Image from 'next/image'
import { useMediaQuery } from 'react-responsive'
import { TitleCapitalize } from '@/utils/capitalize'
import { UnitModalTab, useUnitModalProvider } from '@/providers/UnitModalProvider'
import { convertPrice, formatPrice } from '@/constants/currencies'

interface Props {
  data: Unit | CustomUnit
  currency: Currency
  commission: number
  slideChanged: number
  isCommissionEnabled: boolean
  onSlideChange: () => void
}

export function UnitPlanCard ({ data, currency, commission, slideChanged, isCommissionEnabled, onSlideChange }: Props): React.ReactNode {
  if (data.attributes === undefined) return
  const { openModal } = useUnitModalProvider()
  const statusColor = data.attributes?.status === 'AVAILABLE'
    ? 'bg-unitGreen'
    : data.attributes?.status === 'SOLD'
      ? 'bg-unitRed'
      : data.attributes?.status === 'RESERVED'
        ? 'bg-unitOrange'
        : ''

  const isBDesktopScreen = useMediaQuery({ query: '(min-width: 1728px)' })
  const isLaptopScreen = useMediaQuery({ query: '(min-width: 1280px) and (max-width: 1727px)' })
  const isTabletScreen = useMediaQuery({ query: '(min-width:  768px) and (max-width: 1279px)' })
  const isMobileScreen = useMediaQuery({ query: '(min-width: 428px) and (max-width: 767px)' })
  const isSMobileScreen = useMediaQuery({ query: '(min-width: 375px) and (max-width: 427px)' })

  React.useEffect(() => {
    function updateSwiperSlideStyles (): void {
      const swiperSlides = document.querySelectorAll<HTMLElement>('.swiper-slide')
      const swiper = document.querySelector<HTMLElement>('.swiper')
      if (isBDesktopScreen && swiper !== null) {
        swiper.style.overflow = 'visible'
        swiper.style.width = '496px'
        swiper.style.marginLeft = '0'
        swiperSlides.forEach((slide) => {
          slide.style.width = '496px'
        })
      } else if (isLaptopScreen && swiper !== null) {
        swiper.style.overflow = 'visible'
        swiper.style.width = '395px'
        swiper.style.marginLeft = '0'
        swiperSlides.forEach((slide) => {
          slide.style.width = '395px'
        })
      } else if (isTabletScreen && swiper !== null) {
        swiper.style.overflow = 'visible'
        swiper.style.marginLeft = '0'
        swiper.style.width = '700px'
        swiperSlides.forEach((slide) => {
          slide.style.width = '362px'
        })
      } else if (isMobileScreen && swiper !== null) {
        swiper.style.overflow = 'visible'
        swiper.style.width = '362px'
        swiper.style.marginLeft = '0'
      } else if (isSMobileScreen && swiper !== null) {
        swiper.style.overflow = 'visible'
        swiper.style.width = '311px'
        swiper.style.marginLeft = '0'
      }
    }

    updateSwiperSlideStyles()
    window.addEventListener('resize', updateSwiperSlideStyles)

    return () => {
      window.removeEventListener('resize', updateSwiperSlideStyles)
    }
  }, [slideChanged])

  return (
    <div
      className='smobile:relative smobile:flex smobile:flex-col smobile:gap-1 smobile:max-w-[311px] smobile:max-h-[600px] mobile:max-w-[362px] laptop:max-w-[395px] bdesktop:max-w-[496px] smobile:bg-white hover:shadow-lg smobile:transition-shadow duration-200 hover:cursor-pointer'
      onClick={() => data.id !== undefined && openModal(data.id, UnitModalTab.FloorPlans)}
    >
      <p className={`smobile:absolute smobile:top-0 smobile:right-0 smobile:flex smobile:items-center smobile:justify-center smobile:font-mundialRegular smobile:w-[130px] smobile:h-[32px] smobile:text-[12px] bdesktop:w-[144px] bdesktop:h-[40px] smobile:leading-[1px] smobile:text-nowrap smobile:text-white bdesktop:text-[16px] ${statusColor}`}>
        {TitleCapitalize(data?.attributes.status)}
      </p>
      <div className='mb-auto'>
        {data.attributes.unitPlan?.data !== null && data.attributes.unitPlan?.data !== undefined
          ? (
            <Image
              src={String(data?.attributes?.unitPlan?.data?.attributes.url)}
              alt='Unit Plan image'
              width={data?.attributes?.unitPlan?.data?.attributes.width ?? undefined}
              height={data?.attributes?.unitPlan?.data?.attributes.height ?? undefined}
              className='smobile:w-full object-contain smobile:h-[250px]'
            />
            )
          : (
            <Image
              src='/empty-skeleton.jpg'
              alt='Unit Plan image'
              width={300}
              height={300}
              className='smobile:w-full object-cover smobile:h-[250px]'
            />
            )}
      </div>
      <div className='smobile:flex smobile:flex-col smobile:gap-1 smobile:px-[16px] smobile:pb-[16px]'>
        <div className='smobile:flex smobile:justify-between smobile:pb-[10px] bdesktop:pb-[12px] border-b border-[#D1D1D1]'>
          <p className='smobile:font-mundialDemiBold smobile:text-[20px] bdesktop:text-[24px] smobile:leading-[1]'>
            Unit {data.attributes?.identifier}
          </p>
          <p className='smobile:font-mundialLight smobile:text-[16px] bdesktop:text-[24px] smobile:leading-[1]'>
            Size: {data.attributes?.externalSize !== undefined && data.attributes?.externalSize !== null && data.attributes?.internalSize !== undefined && data.attributes?.internalSize !== null
            ? `${data.attributes.externalSize + data.attributes.internalSize}m2`
            : 'N/A'}
          </p>
        </div>
        <div className='smobile:flex smobile:justify-between smobile:mt-[30px] smobile:mb-[10px]'>
          <p className='smobile:font-mundialRegular smobile:text-[16px] bdesktop:text-[20px] smobile:leading-[1]'>Price</p>
          <p className='smobile:font-mundialRegular smobile:text-[16px] smobile:leading-[1]'>
            {data.attributes.price !== undefined && data.attributes.price !== null
              ? formatPrice(currency, convertPrice(currency, data.attributes.price.toLocaleString('en-US')))
              : 'N/A'}
          </p>
        </div>
        <div className='smobile:flex smobile:justify-between smobile:mb-[30px] bdesktop:mb-[40px]'>
          {isCommissionEnabled && (
            <>
              <p className='smobile:font-mundialRegular smobile:text-[16px] bdesktop:text-[24px] smobile:leading-[1]'>Commission</p>
              <p className='smobile:font-mundialRegular smobile:text-[16px] bdesktop:text-[24px] smobile:leading-[1]'>
                {commission !== undefined && commission !== null && data.attributes.price !== undefined && data.attributes.price !== null
                  ? formatPrice(currency, convertPrice(currency, data.attributes.price * (commission / 100)))
                  : 'N/A'}
              </p>
            </>
          )}
        </div>
        <ul className='smobile:flex smobile:gap-2 smobile:justify-between'>
          <li className='smobile:flex smobile:flex-col smobile:border-l smobile:border-[#D1D1D1] pl-[20px] smobile:gap-[10px]'>
            <p className='smobile:font-mundialLight smobile:text-[10px] bdesktop:text-[12px] smobile:leading-[1]'>BED</p>
            <p className='smobile:font-mundialRegular smobile:text-[16px] bdesktop:text-[20px] smobile:leading-[1]'>{data.attributes.beds}</p>
          </li>
          <li className='smobile:flex smobile:flex-col smobile:border-l smobile:border-[#D1D1D1] pl-[20px] smobile:gap-[10px]'>
            <p className='smobile:font-mundialLight smobile:text-[10px] bdesktop:text-[12px] smobile:leading-[1]'>BATH</p>
            <p className='smobile:font-mundialRegular smobile:text-[16px] bdesktop:text-[20px] smobile:leading-[1]'>{data.attributes.baths}</p>
          </li>
          <li className='smobile:flex smobile:flex-col smobile:border-l smobile:border-[#D1D1D1] pl-[20px] smobile:gap-[10px]'>
            <p className='smobile:font-mundialLight smobile:text-[10px] bdesktop:text-[12px] smobile:leading-[1]'>CAR</p>
            <p className='smobile:font-mundialRegular smobile:text-[16px] bdesktop:text-[20px] smobile:leading-[1]'>{data.attributes.cars}</p>
          </li>
          <li className='smobile:flex smobile:flex-col smobile:border-l smobile:border-[#D1D1D1] pl-[20px] smobile:gap-[10px]'>
            <p className='smobile:font-mundialLight smobile:text-[10px] bdesktop:text-[12px] smobile:leading-[1]'>LIVING</p>
            <p className='smobile:font-mundialRegular smobile:text-[16px] bdesktop:text-[20px] smobile:leading-[1]'>{data.attributes.living}</p>
          </li>
        </ul>
      </div>
    </div>
  )
}
