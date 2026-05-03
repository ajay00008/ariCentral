'use client'

import { formatNumber } from '@/components/Tables/AvailabilityTable'
import { convertPrice, formatPrice } from '@/constants/currencies'
import Link from 'next/link'
import { UnitDetailsSummaryAccordion } from '../Accordions/UnitDetailsSummaryAccordion'
import { UnitSelector } from './UnitSelector'
import { TitleCapitalize } from '@/utils/capitalize'
import { useFormProvider } from '@/providers/FormModalProvider'
import { trackEvent } from '@/app/actions'
import { EventType } from '@/constants/event-type'

interface Props {
  currency: Currency
  commission: number
  unitData: CustomUnit | undefined
  unitId: number | null
  currentTab: string
  currentFloorData: Floor | undefined
  onUnitIdChange: (unitId: number) => void
  makeAnOfferLink: string
  isCommissionEnabled: boolean
  slug: string
  isPreview?: boolean
}

export function UnitSummary ({
  unitData,
  unitId,
  currency,
  commission,
  currentFloorData,
  currentTab,
  makeAnOfferLink,
  isCommissionEnabled,
  onUnitIdChange,
  slug,
  isPreview
}: Props): React.ReactNode {
  const makeAnOfferStyles = makeAnOfferLink === ''
    ? 'opacity-20 cursor-not-allowed user-select-none'
    : ''
  const { openModal } = useFormProvider()
  return (
    <div id='unit-modal-summary' className='smobile:flex smobile:flex-col smobile:w-full smobile:pb-[50px] laptop:w-1/2 laptop:pb-0 laptop:justify-between'>
      <div className='h-auto w-auto laptop:overflow-y-auto laptop:overflow-x-hidden'>
        <div className='smobile:flex smobile:flex-col smobile:w-full smobile:pb-5 smobile:border-b smobile:border-b-[#D1D1D1] laptop:border-none laptop:gap-[10px] laptop:px-[8px] laptop:pb-[12px] desktop:pb-[22px]'>
          <div className='smobile:flex smobile:w-full'>
            <p className='smobile:font-mundialRegular smobile:text-lg laptop:text-[20px] laptop:leading-[1] desktop:text-[20px] smobile:text-black smobile:w-[50%]'>Price</p>
            <p className='smobile:font-mundialRegular smobile:text-lg laptop:text-[20px] laptop:leading-[1] desktop:text-[20px] smobile:text-black smobile:text-nowrap smobile:w-[50%]'>{formatPrice(currency, convertPrice(currency, formatNumber(unitData?.attributes.price)), false)}</p>
          </div>
          {isCommissionEnabled && unitData?.attributes.price !== null && unitData?.attributes.price !== undefined && (
            <div className='smobile:flex smobile:w-full'>
              <p className='smobile:font-mundialRegular smobile:font-semibold smobile:text-lg laptop:text-[20px] laptop:leading-[1] desktop:font-mundialDemiBold desktop:text-[20px] smobile:text-black smobile:w-[50%]'>Commission</p>
              <p className='smobile:font-mundialRegular smobile:font-semibold smobile:text-lg laptop:text-[20px] laptop:leading-[1] desktop:font-mundialDemiBold desktop:text-[20px] smobile:text-black smobile:text-nowrap smobile:w-[50%]'>{formatPrice(currency, convertPrice(currency, unitData?.attributes.price * (commission / 100)))}</p>
            </div>
          )}
        </div>
        <UnitDetailsSummaryAccordion
          unitData={unitData}
          currency={currency}
          onUnitIdChange={onUnitIdChange}
          unitId={unitId}
          currentFloorData={currentFloorData}
          currentTab={currentTab}
        />
        <div className='smobile:flex smobile:flex-col smobile:w-full smobile:pt-5 smobile:pb-5 desktop:pt-[40px] desktop:pb-[35px] laptop:hidden laptop:h-0'>
          <div className='smobile:flex smobile:w-full'>
            <p className='smobile:font-mundialRegular smobile:text-black desktop:text-lg smobile:w-1/2'>Size</p>
            <p className='smobile:font-mundialThin smobile:text-nowrap desktop:text-lg smobile:w-1/2'>
              {unitData?.attributes.internalSize !== undefined && unitData?.attributes.externalSize !== undefined
                ? `${unitData.attributes.internalSize + unitData.attributes.externalSize}m2`
                : 'N/A'}
            </p>
          </div>
          <div className='smobile:flex smobile:w-full'>
            <p className='smobile:font-mundialRegular smobile:text-black desktop:text-lg smobile:w-1/2'>Orientation</p>
            <p className='smobile:font-mundialThin smobile:text-nowrap desktop:text-lg smobile:w-1/2'>{TitleCapitalize(unitData?.attributes.aspect)}</p>
          </div>
          <div className='smobile:flex smobile:w-full'>
            <p className='smobile:font-mundialRegular smobile:text-black desktop:text-lg smobile:w-1/2'>Bed</p>
            <p className='smobile:font-mundialThin smobile:text-nowrap desktop:text-lg smobile:w-1/2'>{unitData?.attributes.beds}</p>
          </div>
          <div className='smobile:flex smobile:w-full'>
            <p className='smobile:font-mundialRegular smobile:text-black desktop:text-lg smobile:w-1/2'>Bath</p>
            <p className='smobile:font-mundialThin smobile:text-nowrap desktop:text-lg smobile:w-1/2'>{unitData?.attributes.baths}</p>
          </div>
          <div className='smobile:flex smobile:w-full'>
            <p className='smobile:font-mundialRegular smobile:text-black desktop:text-lg smobile:w-1/2'>Car</p>
            <p className='font-mundialThin smobile:text-nowrap desktop:text-lg smobile:w-1/2'>{unitData?.attributes.cars}</p>
          </div>
          <div className='smobile:flex smobile:w-full'>
            <p className='smobile:font-mundialRegular smobile:text-black desktop:text-lg smobile:w-1/2'>Living</p>
            <p className='smobile:font-mundialThin smobile:text-nowrap desktop:text-lg smobile:w-1/2'>{unitData?.attributes.living}</p>
          </div>
        </div>
        <div className='smobile:flex smobile:flex-col smobile:w-full smobile:pt-5 smobile:pb-5 smobile:border-t smobile:border-t-[#D1D1D1] desktop:pb-[35px] desktop:pt-[40px] laptop:hidden laptop:h-0'>
          <div className='flex smobile:w-full'>
            <p className='font-mundialRegular text-black desktop:text-lg w-1/2'>Body Corp Fees</p>
            <p className='font-mundialThin text-nowrap desktop:text-lg w-1/2'>{formatPrice(currency, convertPrice(currency, formatNumber(unitData?.attributes.bodyCorp)), true)}/w</p>
          </div>
          <div className='flex smobile:w-full'>
            <p className='font-mundialRegular text-black desktop:text-lg w-1/2'>Rental Appraisal</p>
            <p className='font-mundialThin text-nowrap desktop:text-lg w-1/2'>{formatPrice(currency, convertPrice(currency, formatNumber(unitData?.attributes.rentApp)), true)}/w</p>
          </div>
          <div className='flex smobile:w-full'>
            <p className='font-mundialRegular text-black desktop:text-lg w-1/2'>Rates</p>
            <p className='font-mundialThin text-nowrap desktop:text-lg w-1/2'>{formatPrice(currency, convertPrice(currency, formatNumber(unitData?.attributes.rates)), true)}/year</p>
          </div>
        </div>
        {unitId !== null && (
          <div className='smobile:flex smobile:flex-col smobile:w-full smobile:border-t smobile:border-[#D1D1D1] smobile:pb-4 desktop:pb-[40px] laptop:hidden laptop:h-0'>
            <UnitSelector
              onUnitIdChange={onUnitIdChange}
              unitId={unitId}
              currentFloorData={currentFloorData}
              currentTab={currentTab}
            />
          </div>
        )}
        {isPreview !== true && (
          <div className='smobile:flex smobile:flex-col smobile:w-full laptop:hidden laptop:h-0'>
            <Link
              href='#'
              onClick={(e): void => {
                e.preventDefault()
                trackEvent(slug, EventType.MAKE_OFFER_CLICK)
                openModal(makeAnOfferLink, true)
              }}
              title={makeAnOfferLink === '' ? 'Currently unavailable' : 'Make an offer'}
              className={`shrink-0 p-[15px] text-white font-mundialLight items-center bg-orange hover:bg-opacity-75 transition duration-200 ${makeAnOfferStyles}`}
            >
              MAKE AN OFFER
            </Link>
          </div>
        )}
      </div>
      {isPreview !== true && (
        <div className='smobile:hidden smobile:h-0 laptop:h-auto laptop:flex laptop:flex-col laptop:w-full laptop:max-w-[246px] laptop:text-center laptop:mt-[26px] laptop:pt-0'>
          <Link
            href='#'
            onClick={(e): void => {
              e.preventDefault()
              trackEvent(slug, EventType.MAKE_OFFER_CLICK)
              openModal(makeAnOfferLink, true)
            }}
            title={makeAnOfferLink === '' ? 'Currently unavailable' : 'Make an offer'}
            className={`shrink-0 p-[15px] text-white font-mundialLight items-center bg-orange hover:bg-opacity-75 transition duration-200 ${makeAnOfferStyles}`}
          >
            MAKE AN OFFER
          </Link>
        </div>
      )}

    </div>
  )
}
