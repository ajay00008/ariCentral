'use client'

import { convertPrice, formatPrice } from '@/constants/currencies'
import { formatNumber } from '@/components/Tables/AvailabilityTable'
import { TitleCapitalize } from '@/utils/capitalize'

interface Props {
  item: CustomUnit | null
  currency: Currency
  shouldHide: ShouldHide
  openModal: (unitId: number) => void
}

interface ShouldHide {
  powder: boolean
  cars: boolean
}

export function AvailabilityTableRow ({ item, shouldHide, currency, openModal }: Props): React.ReactNode {
  if (item === null) return null
  const status = item.attributes.status === 'AVAILABLE'
    ? 'bg-unitGreen'
    : item.attributes.status === 'SOLD'
      ? 'bg-unitRed'
      : item.attributes.status === 'RESERVED'
        ? 'bg-unitOrange'
        : ''

  return (
    <div className='group flex mt-[16px] bg-white cursor-pointer transition hover:shadow-[0_4px_12px_0_rgba(0,0,0,0.1)] duration-200' onClick={() => openModal(item.id)}>
      <div className='flex-1 flex items-center justify-center max-w-[100px] text-center px-[19px] py-[13px]'>
        <div className='px-5 py-3 bg-grey font-mundialLight laptop:text-[14px] bdesktop:text-[20px] leading-[1] transition duration-200'>{item.attributes.identifier}</div>
      </div>
      <div className='flex-1 flex items-center justify-center max-w-[120px] text-center px-[10px] py-3'>
        <div className={`px-5 min-w-[98px] py-3 text-white ${status} font-mundialRegular laptop:text-[14px] bdesktop:text-[16px] leading-[1] transition duration-200`}>{TitleCapitalize(item.attributes.status)}</div>
      </div>
      <div className='flex-1 flex items-center justify-center min-w-[110px] text-start px-[10px] py-3 font-mundialLight laptop:text-[16px] bdesktop:text-[20px] leading-[1] transition duration-200 text-center'>
        {formatPrice(currency, convertPrice(currency, formatNumber(item.attributes.price)), true)}
      </div>
      <div className='flex-1 flex items-center justify-center text-center px-[10px] py-3 font-mundialLight laptop:text-[16px] bdesktop:text-[20px] leading-[1] transition duration-200'>
        {item.attributes.internalSize + item.attributes.externalSize}m2
      </div>
      <div className='flex-1 flex items-center max-w-[120px] justify-center text-center px-[10px] py-3 font-mundialLight laptop:text-[16px] bdesktop:text-[20px] leading-[1] transition duration-200'>
        {item.attributes.beds}
      </div>
      <div className='flex-1 flex items-center smobile:max-w-[50px] bdesktop:max-w-[80px] justify-center text-center px-[10px] py-3 font-mundialLight laptop:text-[16px] bdesktop:text-[20px] leading-[1] transition duration-200'>
        {item.attributes.baths}
      </div>
      {!shouldHide.powder && (
        <div className='flex-1 flex items-center smobile:max-w-[50px] bdesktop:max-w-[80px] justify-center text-center px-[10px] py-3 font-mundialLight laptop:text-[16px] bdesktop:text-[20px] leading-[1] transition duration-200'>
          {item.attributes.powder}
        </div>
      )}
      <div className='flex-1 flex items-center smobile:max-w-[50px] bdesktop:max-w-[80px] text-center justify-center px-[10px] py-3 font-mundialLight laptop:text-[16px] bdesktop:text-[20px] leading-[1] transition duration-200'>
        {item.attributes.living}
      </div>
      {!shouldHide.cars && (
        <div className='flex-1 flex items-center smobile:max-w-[50px] bdesktop:max-w-[80px] text-center justify-center px-[10px] py-3 font-mundialLight laptop:text-[16px] bdesktop:text-[20px] leading-[1] transition duration-200'>
          {item.attributes.cars}
        </div>
      )}
      <div className='flex-1 flex items-center smobile:max-w-[50px] bdesktop:max-w-[80px] text-center justify-center px-[10px] py-3 font-mundialLight laptop:text-[16px] bdesktop:text-[20px] leading-[1] transition duration-200'>
        {item.attributes.floor.data.attributes.identifier}
      </div>
      <div className='flex-1 flex items-center text-center justify-center bdesktop:max-w-[100px] px-[10px] py-3 font-mundialLight laptop:text-[16px] bdesktop:text-[20px] leading-[1] transition duration-200'>
        {TitleCapitalize(item.attributes.aspect)}
      </div>
      <div className='flex-1 flex items-center text-center justify-center px-[10px] py-3 font-mundialLight laptop:text-[16px] bdesktop:text-[20px] leading-[1] transition duration-200'>
        {formatPrice(currency, convertPrice(currency, formatNumber(item.attributes.rentApp)), true)}/w
      </div>
      <div className='flex-1 flex items-center text-center justify-center px-[10px] py-3 font-mundialLight laptop:text-[16px] bdesktop:text-[20px] leading-[1] transition duration-200'>
        {formatPrice(currency, convertPrice(currency, item.attributes.bodyCorp), true)}/w
      </div>
      <div className='flex-1 flex items-center text-center justify-center px-[10px] py-3 font-mundialLight laptop:text-[16px] bdesktop:text-[20px] leading-[1] transition duration-200'>
        {formatPrice(currency, convertPrice(currency, formatNumber(item.attributes.rates)), true)}/year
      </div>
    </div>
  )
}
