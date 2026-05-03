'use client'

import * as React from 'react'
import { convertPriceWithSuffix, formatPrice } from '@/constants/currencies'
import { heroImages } from '@/lib/hero-images'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { FaLock } from 'react-icons/fa'
import { AccessRequestModal } from '../Modals/AccessRequestModal'

interface Props {
  data: FullProperty
  currency: Currency
  isMapView: boolean
  isCommissionEnabled: boolean
}

export function camelToFlat (camel: string): string {
  const camelCase = camel.replace(/([a-z])([A-Z])/g, '$1 $2')

  return camelCase
}

export function SearchPropertyCard ({
  data,
  currency,
  isMapView,
  isCommissionEnabled
}: Props): React.ReactNode {
  const [isImageLoaded, setIsImageLoaded] = React.useState<boolean>(false)
  const [showModal, setShowModal] = React.useState<boolean>(false)
  const lowerPricedUnit = data.attributes.LowerPricedUnit

  const liElementStyles = isMapView
    ? 'smobile:relative smobile:flex smobile:flex-col smobile:max-w-[310px] h-auto tablet:w-[390px] tablet:max-w-[395px] laptop:w-[281px] desktop:w-[277px] bdesktop:w-[341.8px] smobile:bg-white hover:shadow-lg smobile:transition-shadow duration-200 hover:cursor-pointer'
    : 'smobile:relative smobile:flex smobile:flex-col smobile:w-full smobile:max-w-none h-auto tablet:w-full tablet:max-w-[335px] laptop:max-w-[384px] desktop:w-[305px] bdesktop:w-[371px] smobile:bg-white hover:shadow-lg smobile:transition-shadow duration-200 hover:cursor-pointer'

  const imageElementStyles = isMapView
    ? 'smobile:w-full smobile:min-h-[186px] smobile:object-cover smobile:h-auto smobile:max-h-[186px]'
    : 'smobile:w-full smobile:object-cover smobile:min-h-[247px] smobile:h-auto smobile:max-h-[247px]'

  const heroImage = heroImages(data.attributes)[0]

  const handleCardClick = (e: React.MouseEvent): void => {
    const { Approved, RequestStatus } = data?.attributes

    if (RequestStatus === 'rejected') {
      e.preventDefault()
      return
    }

    if (!Approved) {
      e.preventDefault()
      setShowModal(true)
    }
  }

  return (
    <>
      <li className={liElementStyles}>
        <Link
          href={data.attributes.Approved ? `/${data.attributes.Slug}` : '#'}
          className='w-full h-full smobile:flex smobile:flex-col justify-between'
          onClick={handleCardClick}
        >
          <div className='smobile:absolute smobile:top-[16px] smobile:left-[16px]  tablet:top-[24px] tablet:left-[24px] smobile:flex smobile:items-center smobile:justify-center smobile:py-[8px] smobile:px-[12px] smobile:h-[24px] smobile:bg-white'>
            <p className='smobile:font-mundialRegular smobile:w-fit smobile:text-[8px] smobile:leading-[1px] smobile:text-nowrap smobile:text-black'>
              {data.attributes?.StageOfBuild !== undefined ||
              data.attributes?.StageOfBuild !== null
                ? camelToFlat(data.attributes?.StageOfBuild)?.toUpperCase()
                : 'N/A'}
            </p>
          </div>
          {heroImage !== undefined && (
            <Image
              src={
                isImageLoaded
                  ? heroImage.Image.data.attributes.url
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
              className={imageElementStyles}
            />
          )}
          {heroImage === undefined && (
            <Image
              src='/empty-skeleton.jpg'
              alt='Property Hero image'
              width={200}
              height={200}
              className={imageElementStyles}
            />
          )}
          <div className='smobile:flex smobile:flex-col smobile:w-full smobile:px-[16px]  tablet:px-[24px]'>
            <div className='smobile:w-full smobile:flex smobile:gap-[10px] capitalize smobile:justify-between smobile:items-center smobile:mt-[32px] smobile:pb-[10px] smobile:mb-[16px] smobile:border-b smobile:border-[#D1D1D1]'>
              <h3 className='smobile:font-mundialRegular smobile:text-[20px] smobile:text-black smobile:leading-[1]'>
                {data.attributes?.Name !== undefined ||
                data.attributes?.Name !== null
                  ? data.attributes?.Name
                  : 'N/A'}
              </h3>
              <p className='smobile:font-mundialRegular smobile:text-[12px] smobile:leading-[1] smobile:text-black smobile:text-end'>
                {data.attributes?.Address !== undefined ||
                data.attributes.Address !== null
                  ? data.attributes.Address
                  : 'N/A'}
              </p>
            </div>
            <div className='smobile:flex smobile:flex-col smobile:gap-[8px] smobile:w-full'>
              <div className='smobile:flex smobile:w-full smobile:items-center smobile:justify-between'>
                <p className='smobile:font-mundialRegular smobile:text-[16px] smobile:leading-[1] smobile:text-customGrey'>
                  Priced from
                </p>
                <p className='smobile:font-mundialRegular smobile:text-[16px] smobile:leading-[1] smobile:text-customGrey'>
                  {lowerPricedUnit?.attributes.price !== undefined &&
                  lowerPricedUnit?.attributes.price !== null
                    ? formatPrice(
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
                    )
                    : 'N/A'}
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
            <div className='w-full py-4 '>
              <Button
                disabled={!data.attributes.Approved}
                className='smobile:w-full smobile:h-auto  smobile:min-h-[48px] smobile:mx-auto smobile:bg-orange smobile:font-mundialRegular disabled:opacity-100 smobile:text-customWhite smobile:font-normal smobile:text-[14px] disabled:bg-grey disabled:text-nativeBlack smobile:leading-[1] rounded-none p-1 '
              >
                {data.attributes.RequestStatus === 'not_requested'
                  ? (
                    <p className='flex gap-2 items-center'>
                      <FaLock />
                      REQUEST ACCESS
                    </p>
                    )
                  : data.attributes.RequestStatus === 'pending'
                    ? (
                      <p>ACCESS PENDING</p>
                      )
                    : data.attributes.RequestStatus === 'approved'
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
