'use client'

import * as React from 'react'
import { convertPrice, formatPrice } from '@/constants/currencies'
import { TitleCapitalize } from '@/utils/capitalize'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { formatNumber } from '../Tables/AvailabilityTable'

interface Props {
  data: CustomUnit
  currency: Currency
}

export function AvailabilityCard ({ data, currency }: Props): React.ReactNode {
  const [isOpen, setIsOpen] = React.useState(false)

  const statusColor = data?.attributes?.status === 'AVAILABLE'
    ? 'bg-unitGreen'
    : data.attributes?.status === 'SOLD'
      ? 'bg-unitRed'
      : data.attributes?.status === 'RESERVED'
        ? 'bg-unitOrange'
        : ''

  function toggleDropdown (): void {
    setIsOpen(!isOpen)
  }
  return (
    <li className='smobile:w-full smobile:h-auto smobile:max-h-[400px] smobile:py-[20px] smobile:px-[18px] bg-white'>
      <div className='smobile:flex smobile:w-full smobile:justify-between smobile:items-center' onClick={toggleDropdown}>
        <h3 className='smobile:text-[20px] smobile:leading-[1] smobile:font-mundialRegular laptop:mb-0 laptop:pb-0'>
          Unit {data.attributes.identifier}
        </h3>
        <div className='smobile:flex smobile:gap-[16px] smobile:w-fit smobile:h-auto smobile:items-center'>
          <p className={`smobile:flex smobile:items-center smobile:justify-center smobile:font-mundialRegular smobile:w-[130px] smobile:h-[32px] smobile:text-[12px] bdesktop:w-[144px] bdesktop:h-[40px] smobile:leading-[1px] smobile:text-nowrap smobile:text-white bdesktop:text-[16px] ${statusColor}`}>
            {TitleCapitalize(data?.attributes.status)}
          </p>
          {isOpen
            ? <ChevronUp className='smobile:w-[12px] smobile:h-[12px] laptop:hidden laptop:h-0' />
            : <ChevronDown className='smobile:w-[12px] smobile:h-[12px] laptop:hidden laptop:h-0' />}
        </div>
      </div>
      <div
        className={`smobile:transition-max-height smobile:duration-200 smobile:ease-in-out smobile:overflow-hidden ${isOpen ? 'smobile:max-h-screen' : 'smobile:max-h-0'}`}
      >
        <div className='smobile:grid smobile:grid-cols-2 smobile:gap-x-[80px] smobile:gap-y-[16px] smobile:w-full smobile:mt-[30px]'>
          <div className='smobile:flex smobile:flex-col smobile:border-l smobile:border-l-summaryBreakLineBg smobile:pl-[10px] smobile:gap-[10px]'>
            <p className='smobile:font-mundialLight smobile:text-customHalfGrey smobile:text-[10px] bdesktop:text-[12px] smobile:leading-[1]'>PRICE</p>
            <p className='smobile:font-mundialRegular smobile:text-[16px] bdesktop:text-[20px] smobile:leading-[1]'>
              {data.attributes.price !== undefined && data.attributes.price !== null
                ? formatPrice(currency, convertPrice(currency, data.attributes.price.toLocaleString('en-US')), true)
                : 'N/A'}
            </p>
          </div>
          <div className='smobile:flex smobile:flex-col smobile:border-l smobile:border-l-summaryBreakLineBg smobile:pl-[10px] smobile:gap-[10px]'>
            <p className='smobile:font-mundialLight smobile:text-customHalfGrey smobile:text-[10px] bdesktop:text-[12px] smobile:leading-[1]'>SIZE</p>
            <p className='smobile:font-mundialRegular smobile:text-[16px] bdesktop:text-[20px] smobile:leading-[1]'>
              {data.attributes.externalSize !== undefined && data.attributes.externalSize !== null && data.attributes.internalSize !== undefined && data.attributes.internalSize !== null
                ? `${data.attributes.externalSize + data.attributes.internalSize}m2`
                : 'N/A'}
            </p>
          </div>
          <div className='smobile:flex smobile:flex-col smobile:border-l smobile:border-l-summaryBreakLineBg smobile:pl-[10px] smobile:gap-[10px]'>
            <p className='smobile:font-mundialLight smobile:text-customHalfGrey smobile:text-[10px] bdesktop:text-[12px] smobile:leading-[1]'>BED</p>
            <p className='smobile:font-mundialRegular smobile:text-[16px] bdesktop:text-[20px] smobile:leading-[1]'>
              {data.attributes.beds}
            </p>
          </div>
          <div className='smobile:flex smobile:flex-col smobile:border-l smobile:border-l-summaryBreakLineBg smobile:pl-[10px] smobile:gap-[10px]'>
            <p className='smobile:font-mundialLight smobile:text-customHalfGrey smobile:text-[10px] bdesktop:text-[12px] smobile:leading-[1]'>BATH</p>
            <p className='smobile:font-mundialRegular smobile:text-[16px] bdesktop:text-[20px] smobile:leading-[1]'>
              {data.attributes.baths}
            </p>
          </div>
          <div className='smobile:flex smobile:flex-col smobile:border-l smobile:border-l-summaryBreakLineBg smobile:pl-[10px] smobile:gap-[10px]'>
            <p className='smobile:font-mundialLight smobile:text-customHalfGrey smobile:text-[10px] bdesktop:text-[12px] smobile:leading-[1]'>LIVING</p>
            <p className='smobile:font-mundialRegular smobile:text-[16px] bdesktop:text-[20px] smobile:leading-[1]'>
              {data.attributes.living}
            </p>
          </div>
          <div className='smobile:flex smobile:flex-col smobile:border-l smobile:border-l-summaryBreakLineBg smobile:pl-[10px] smobile:gap-[10px]'>
            <p className='smobile:font-mundialLight smobile:text-customHalfGrey smobile:text-[10px] bdesktop:text-[12px] smobile:leading-[1]'>CAR</p>
            <p className='smobile:font-mundialRegular smobile:text-[16px] bdesktop:text-[20px] smobile:leading-[1]'>
              {data.attributes.cars}
            </p>
          </div>
          <div className='smobile:flex smobile:flex-col smobile:border-l smobile:border-l-summaryBreakLineBg smobile:pl-[10px] smobile:gap-[10px]'>
            <p className='smobile:font-mundialLight smobile:text-customHalfGrey smobile:text-[10px] bdesktop:text-[12px] smobile:leading-[1]'>LEVEL</p>
            <p className='smobile:font-mundialRegular smobile:text-[16px] bdesktop:text-[20px] smobile:leading-[1]'>
              {data.attributes.floor.data.attributes.identifier}
            </p>
          </div>
          <div className='smobile:flex smobile:flex-col smobile:border-l smobile:border-l-summaryBreakLineBg smobile:pl-[10px] smobile:gap-[10px]'>
            <p className='smobile:font-mundialLight smobile:text-customHalfGrey smobile:text-[10px] bdesktop:text-[12px] smobile:leading-[1]'>ORIENTATION</p>
            <p className='smobile:font-mundialRegular smobile:text-[16px] bdesktop:text-[20px] smobile:leading-[1]'>
              {data.attributes.aspect}
            </p>
          </div>
          <div className='smobile:flex smobile:flex-col smobile:border-l smobile:border-l-summaryBreakLineBg smobile:pl-[10px] smobile:gap-[10px]'>
            <p className='smobile:font-mundialLight smobile:text-customHalfGrey smobile:text-[10px] bdesktop:text-[12px] smobile:leading-[1]'>RENTAPP</p>
            <p className='smobile:font-mundialRegular smobile:text-[16px] bdesktop:text-[20px] smobile:leading-[1]'>
              {data.attributes.rentApp !== undefined && data.attributes.rentApp !== null
                ? formatPrice(currency, convertPrice(currency, formatNumber(data.attributes.rentApp)), true)
                : 'N/A'}/w
            </p>
          </div>
          <div className='smobile:flex smobile:flex-col smobile:border-l smobile:border-l-summaryBreakLineBg smobile:pl-[10px] smobile:gap-[10px]'>
            <p className='smobile:font-mundialLight smobile:text-customHalfGrey smobile:text-[10px] bdesktop:text-[12px] smobile:leading-[1]'>BODY CORP</p>
            <p className='smobile:font-mundialRegular smobile:text-[16px] bdesktop:text-[20px] smobile:leading-[1]'>
              {data.attributes.bodyCorp !== undefined && data.attributes.bodyCorp !== null
                ? formatPrice(currency, convertPrice(currency, formatNumber(data.attributes.bodyCorp)), true)
                : 'N/A'}/w
            </p>
          </div>
          <div className='smobile:flex smobile:flex-col smobile:border-l smobile:border-l-summaryBreakLineBg smobile:pl-[10px] smobile:gap-[10px]'>
            <p className='smobile:font-mundialLight smobile:text-customHalfGrey smobile:text-[10px] bdesktop:text-[12px] smobile:leading-[1]'>RATES</p>
            <p className='smobile:font-mundialRegular smobile:text-[16px] bdesktop:text-[20px] smobile:leading-[1]'>
              {data.attributes.rates !== undefined && data.attributes.rates !== null
                ? formatPrice(currency, convertPrice(currency, data.attributes.rates.toLocaleString('en-US')), true)
                : 'N/A'}/year
            </p>
          </div>
        </div>
      </div>
    </li>
  )
}
