'use client'

import * as React from 'react'
import { useMediaQuery } from 'react-responsive'
import Image from 'next/image'
import { convertPriceWithSuffix, formatPrice } from '@/constants/currencies'
import { camelToFlat } from './SearchPropertyCard'
import Link from 'next/link'
import { heroImages } from '@/lib/hero-images'
import { Button } from '@/components/ui/button'
import { FaLock } from 'react-icons/fa'
import { AccessRequestModal } from '../Modals/AccessRequestModal'

interface Props {
  data: PropertyMain | FullProperty
  currency: Currency
  slideChanged: number
  swiperNumber: number
  isCommissionEnabled: boolean
}

export function SearchPropertiesCard ({
  data,
  currency,
  swiperNumber,
  slideChanged,
  isCommissionEnabled
}: Props): React.ReactNode {
  const [isImageLoaded, setIsImageLoaded] = React.useState<boolean>(false)
  const [showModal, setShowModal] = React.useState<boolean>(false)
  const isTabletScreen = useMediaQuery({
    query: '(min-width:  768px) and (max-width: 1279px)'
  })
  const isMobileScreen = useMediaQuery({
    query: '(min-width: 428px) and (max-width: 767px)'
  })
  const isSMobileScreen = useMediaQuery({
    query: '(min-width: 375px) and (max-width: 427px)'
  })

  const lowerPricedUnit = data.attributes?.LowerPricedUnit
  React.useEffect(() => {
    function updateSwiperSlideStyles (): void {
      const swiperSlides = document.querySelectorAll<HTMLElement>(
        `.swiper-slide${swiperNumber}`
      )
      const swiper = document.querySelectorAll<HTMLElement>('.swiper')
      const swiperSlide = swiper[swiperNumber === 1 ? 1 : 0] ?? null
      if (isTabletScreen && swiperSlide !== null) {
        swiperSlide.style.overflow = 'visible'
        swiperSlide.style.marginLeft = '0'
        swiperSlide.style.width = '736px'
        swiperSlides.forEach((slide) => {
          slide.style.width = '389px'
        })
      } else if (isMobileScreen && swiperSlide !== null) {
        swiperSlide.style.overflow = 'visible'
        swiperSlide.style.width = '310px'
        swiperSlide.style.marginLeft = '0'
      } else if (isSMobileScreen && swiperSlide !== null) {
        swiperSlide.style.overflow = 'visible'
        swiperSlide.style.width = '310px'
        swiperSlide.style.marginLeft = '0'
      }
    }

    updateSwiperSlideStyles()
    window.addEventListener('resize', updateSwiperSlideStyles)

    return () => {
      window.removeEventListener('resize', updateSwiperSlideStyles)
    }
  }, [slideChanged])

  const heroImage = heroImages(data.attributes)[0]

  const handleCardClick = (e: React.MouseEvent): void => {
    const { Approved, RequestStatus } = data?.attributes ?? {}

    if (RequestStatus === 'rejected') {
      e.preventDefault()
      return
    }

    if (Approved === false) {
      e.preventDefault()
      setShowModal(true)
    }
  }

  return (
    <>
      <li className='smobile:relative smobile:flex smobile:flex-col smobile:max-w-[310px] h-auto tablet:w-[390px] tablet:max-w-[395px] desktop:w-[310px] bdesktop:w-[375px] smobile:bg-white hover:shadow-lg smobile:transition-shadow duration-200 hover:cursor-pointer'>
        <Link
          href={data?.attributes?.Approved === true ? `/${data.attributes?.Slug ?? ''}` : '#'}
          onClick={handleCardClick}
          className='w-full h-full smobile:flex smobile:flex-col justify-between'
        >
          <div className='smobile:absolute smobile:top-[16px] smobile:left-[16px] tablet:top-[24px] tablet:left-[24px] smobile:flex smobile:items-center smobile:justify-center smobile:py-[8px] smobile:px-[12px] smobile:h-[24px] smobile:bg-white'>
            <p className='smobile:font-mundialRegular smobile:w-fit smobile:text-[8px] smobile:leading-[1px] smobile:text-nowrap smobile:text-black'>
              {data.attributes?.StageOfBuild !== undefined ||
              data.attributes?.StageOfBuild !== null
                ? camelToFlat(data.attributes?.StageOfBuild ?? '').toUpperCase()
                : 'No current stage installed.'}
            </p>
          </div>
          {heroImage !== undefined && (
            <Image
              src={
                isImageLoaded
                  ? String(heroImage.Image.data.attributes.url)
                  : '/empty-skeleton.jpg'
              }
              alt='Property Hero image'
              onLoad={() => setIsImageLoaded(true)}
              width={
                isImageLoaded
                  ? heroImage.Image.data.attributes.width ?? 200
                  : 200
              }
              height={
                isImageLoaded
                  ? heroImage.Image.data.attributes.height ?? 200
                  : 200
              }
              className='smobile:w-full smobile:min-h-[247px] smobile:object-cover smobile:h-auto smobile:max-h-[247px] tablet:object-cover'
            />
          )}
          {heroImage === undefined && (
            <Image
              src='/empty-skeleton.jpg'
              alt='Property Hero image'
              width={200}
              height={200}
              className='smobile:w-full smobile:min-h-[247px] smobile:object-cover smobile:h-auto smobile:max-h-[247px] tablet:object-cover'
            />
          )}
          <div className='smobile:flex smobile:flex-col smobile:w-full smobile:px-[16px]  tablet:px-[24px]'>
            <div className='smobile:w-full smobile:flex capitalize smobile:gap-[10px] smobile:justify-between smobile:items-center smobile:mt-[32px] smobile:pb-[10px] smobile:mb-[16px] smobile:border-b smobile:border-[#D1D1D1]'>
              <h3 className='smobile:font-mundialRegular smobile:text-[20px] smobile:leading-[1] smobile:text-black'>
                {data.attributes?.Name !== undefined ||
                data.attributes?.Name !== null
                  ? data.attributes?.Name
                  : 'N/A'}
              </h3>
              <p className='smobile:font-mundialRegular smobile:text-[12px] smobile:leading-[1]  smobile:text-black smobile:text-end'>
                {data.attributes?.Address !== undefined ||
                data.attributes?.Address !== null
                  ? data.attributes?.Address
                  : 'N/A'}
              </p>
            </div>
            <div className='smobile:flex smobile:flex-col smobile:gap-[8px] smobile:w-full'>
              <div className='smobile:flex smobile:w-full smobile:items-center smobile:justify-between'>
                <p className='smobile:font-mundialRegular smobile:text-[16px] smobile:leading-[1] smobile:text-customGrey'>
                  Priced from
                </p>
                <p className='smobile:font-mundialRegular smobile:text-[16px] smobile:leading-[1] smobile:text-customGrey'>
                  {lowerPricedUnit?.attributes.price === undefined ||
                  lowerPricedUnit.attributes.price === null
                    ? 'N/A'
                    : formatPrice(
                      currency,
                      convertPriceWithSuffix(
                        currency,
                        lowerPricedUnit.attributes.price.toLocaleString(
                          'en-US'
                        )
                      ),
                      false,
                      false,
                      true
                    )}
                </p>
              </div>
              {isCommissionEnabled && (
                <div className='smobile:flex smobile:gap-[8px] smobile:w-full smobile:items-center smobile:justify-between'>
                  <p className='smobile:font-mundialDemiBold smobile:text-[16px] smobile:leading-[1] smobile:text-customGrey'>
                    Commission
                  </p>
                  <p className='smobile:font-mundialRegular smobile:text-[16px] smobile:leading-[1] smobile:text-customGrey'>
                    {data.attributes?.Commission === undefined ||
                    data.attributes.Commission === null
                      ? 'N/A'
                      : data.attributes?.Commission}
                    %
                  </p>
                </div>
              )}
            </div>
            <div className='grid w-full py-4'>
              <Button
                disabled={data?.attributes?.Approved === false || data?.attributes?.Approved === null || data?.attributes?.Approved === undefined}
                className='smobile:w-full smobile:h-auto smobile:min-h-[48px] smobile:mx-auto smobile:bg-orange smobile:font-mundialRegular disabled:opacity-100 smobile:text-customWhite smobile:font-normal smobile:text-[14px] disabled:bg-grey disabled:text-nativeBlack smobile:leading-[1] rounded-none p-1'
              >
                {data?.attributes?.RequestStatus === 'not_requested'
                  ? (
                    <p className='flex gap-2 items-center'>
                      <FaLock />
                      REQUEST ACCESS
                    </p>
                    )
                  : data.attributes?.RequestStatus === 'pending'
                    ? (
                      <p>ACCESS PENDING</p>
                      )
                    : data.attributes?.RequestStatus === 'approved'
                      ? (
                        <p>VIEW DETAILS</p>
                        )
                      : (
                        <p>REJECTED</p>
                        )}
              </Button>
            </div>
          </div>
        </Link>
      </li>
      <AccessRequestModal
        isOpen={showModal}
        setShowModal={setShowModal}
        data={data}
      />
    </>
  )
}
