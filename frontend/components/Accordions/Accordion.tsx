'use client'

import * as React from 'react'
import { convertPrice, formatPrice } from '@/constants/currencies'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { formatNumber } from '../Tables/AvailabilityTable'
import { UnitSelector } from '../Custom/UnitSelector'
import { TitleCapitalize } from '@/utils/capitalize'

interface Props {
  activeDialogue: boolean
  unitData: CustomUnit | undefined
  variant: number
  currency: Currency
  unitId: number | null
  currentTab: string
  currentFloorData: Floor | undefined
  onUnitIdChange: (unitId: number) => void
  handleDialogue: (index: number) => void
}

export function Accordion ({
  activeDialogue,
  handleDialogue,
  unitData,
  variant,
  currency,
  unitId,
  currentFloorData,
  currentTab,
  onUnitIdChange
}: Props): React.ReactNode {
  const [height, setHeight] = React.useState('0px')
  const contentRef = React.useRef<HTMLUListElement>(null)
  const dropdownClassList = 'smobile:flex smobile:justify-between smobile:items-center smobile:w-full smobile:pb-[10px] laptop:border-b laptop:border-b-[#D1D1D1] laptop:px-[8px] laptop:py-[12px] laptop:cursor-pointer laptop:gap-0'

  React.useEffect(() => {
    if (contentRef.current !== null && activeDialogue !== undefined) {
      setHeight(activeDialogue ? `${contentRef.current.scrollHeight}px` : '0px')
    }
  }, [activeDialogue])

  switch (variant) {
    case 1:
      return (
        <div className='smobile:flex-col smobile:gap-4 smobile:hidden smobile:h-0 laptop:flex laptop:gap-0 laptop:h-auto smobile:w-full'>
          <div
            className={dropdownClassList}
            onClick={() => handleDialogue(0)}
          >
            <h3 className='smobile:mb-[10px] smobile:text-[20px] smobile:leading-[1] smobile:font-mundialRegular laptop:text-[16px] laptop:mb-0 laptop:pb-0'>Summary</h3>
            {activeDialogue
              ? <ChevronUp className='smobile:w-[16px] smobile:h-[16px]' />
              : <ChevronDown className='smobile:w-[16px] smobile:h-[16px]' />}
          </div>
          <ul
            ref={contentRef}
            style={{
              maxHeight: activeDialogue && (contentRef.current !== null) ? `${contentRef.current.scrollHeight}px` : '0px',
              transition: 'max-height 0.2s ease-in-out',
              overflow: 'hidden'
            }}
            className='smobile:flex smobile:flex-col smobile:gap-[12px]'
          >
            <li className='smobile:flex smobile:pt-[25px] laptop:py-[12px]'>
              <div className='smobile:flex smobile:flex-col smobile:w-full smobile:pt-5 smobile:pb-5 laptop:p-0'>
                <div className='smobile:flex smobile:w-full laptop:bg-summaryOddTextBackground laptop:pt-[5px] laptop:pr-[8px] laptop:pl-[8px] laptop:pb-[5px]'>
                  <p className='smobile:font-mundialRegular smobile:text-black bdesktop:text-[16px] laptop:leading-[1] laptop:text-[14px] smobile:w-1/2'>Size</p>
                  <p className='smobile:font-mundialThin smobile:text-nowrap bdesktop:text-[16px] laptop:leading-[1] laptop:text-[14px] smobile:w-1/2'>
                    {unitData?.attributes.internalSize !== undefined && unitData?.attributes.externalSize !== undefined
                      ? `${unitData.attributes.internalSize + unitData.attributes.externalSize}m2`
                      : 'N/A'}
                  </p>
                </div>
                <div className='smobile:flex smobile:w-full laptop:pt-[5px] laptop:pr-[8px] laptop:pl-[8px] laptop:pb-[5px]'>
                  <p className='smobile:font-mundialRegular smobile:text-black bdesktop:text-[16px] laptop:leading-[1] laptop:text-[14px] smobile:w-1/2'>Orientation</p>
                  <p className='smobile:font-mundialThin smobile:text-nowrap bdesktop:text-[16px] laptop:leading-[1] laptop:text-[14px] smobile:w-1/2'>{TitleCapitalize(unitData?.attributes.aspect)}</p>
                </div>
                <div className='smobile:flex smobile:w-full laptop:pt-[5px] laptop:pr-[8px] laptop:pl-[8px] laptop:pb-[5px]'>
                  <p className='smobile:font-mundialRegular smobile:text-black bdesktop:text-[16px] laptop:leading-[1] laptop:text-[14px] smobile:w-1/2'>Bed</p>
                  <p className='smobile:font-mundialThin smobile:text-nowrap bdesktop:text-[16px] laptop:leading-[1] laptop:text-[14px] smobile:w-1/2'>{unitData?.attributes.beds}</p>
                </div>
                <div className='smobile:flex smobile:w-full laptop:bg-summaryOddTextBackground laptop:pt-[5px] laptop:pr-[8px] laptop:pl-[8px] laptop:pb-[5px]'>
                  <p className='smobile:font-mundialRegular smobile:text-black bdesktop:text-[16px] laptop:leading-[1] laptop:text-[14px] smobile:w-1/2'>Bath</p>
                  <p className='smobile:font-mundialThin smobile:text-nowrap bdesktop:text-[16px] laptop:leading-[1] laptop:text-[14px] smobile:w-1/2'>{unitData?.attributes.baths}</p>
                </div>
                <div className='smobile:flex smobile:w-full laptop:pt-[5px] laptop:pr-[8px] laptop:pl-[8px] laptop:pb-[5px]'>
                  <p className='smobile:font-mundialRegular smobile:text-black bdesktop:text-[16px] laptop:leading-[1] laptop:text-[14px] smobile:w-1/2'>Car</p>
                  <p className='font-mundialThin smobile:text-nowrap laptop:text-[16px] laptop:leading-[1] desktop:text-[14px] smobile:w-1/2'>{unitData?.attributes.cars}</p>
                </div>
                <div className='smobile:flex smobile:w-full laptop:bg-summaryOddTextBackground laptop:pt-[5px] laptop:pr-[8px] laptop:pl-[8px] laptop:pb-[5px]'>
                  <p className='smobile:font-mundialRegular smobile:text-black laptop:text-[16px] laptop:leading-[1] desktop:text-[14px] smobile:w-1/2'>Living</p>
                  <p className='smobile:font-mundialThin smobile:text-nowrap bdesktop:text-[16px] laptop:leading-[1] laptop:text-[14px] smobile:w-1/2'>{unitData?.attributes.living}</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      )

    case 2:
      return (
        <div className='smobile:flex-col smobile:gap-4 smobile:hidden smobile:h-0 laptop:flex laptop:gap-0 laptop:h-auto smobile:w-full'>
          <div
            className={dropdownClassList}
            onClick={() => handleDialogue(1)}
          >
            <h3 className='smobile:mb-[10px] smobile:text-[20px] smobile:leading-[1] smobile:font-mundialRegular laptop:text-[16px] laptop:mb-0 laptop:pb-0'>Fees & Rates</h3>
            {activeDialogue
              ? <ChevronUp className='smobile:w-[16px] smobile:h-[16px]' />
              : <ChevronDown className='smobile:w-[16px] smobile:h-[16px]' />}
          </div>
          <ul
            ref={contentRef}
            style={{
              maxHeight: height,
              transition: 'max-height 0.2s ease-in-out',
              overflow: 'hidden'
            }}
            className='smobile:flex smobile:flex-col smobile:gap-[12px]'
          >
            <li className='smobile:flex smobile:pt-[25px] laptop:py-[12px]'>
              <div className='smobile:flex smobile:flex-col smobile:w-full smobile:pt-5 smobile:pb-5 laptop:p-0'>
                <div className='flex smobile:w-full laptop:bg-summaryOddTextBackground laptop:pt-[5px] laptop:pr-[8px] laptop:pl-[8px] laptop:pb-[5px]'>
                  <p className='font-mundialRegular text-black bdesktop:text-[16px] laptop:leading-[1] laptop:text-[14px] w-1/2'>Body Corp Fees</p>
                  <p className='font-mundialThin text-nowrap bdesktop:text-[16px] laptop:leading-[1] laptop:text-[14px] w-1/2'>{formatPrice(currency, convertPrice(currency, formatNumber(unitData?.attributes.bodyCorp)), true)}/w</p>
                </div>
                <div className='flex smobile:w-full laptop:pt-[5px] laptop:pr-[8px] laptop:pl-[8px] laptop:pb-[5px]'>
                  <p className='font-mundialRegular text-black bdesktop:text-[16px] laptop:leading-[1] laptop:text-[14px] w-1/2'>Rental Appraisal</p>
                  <p className='font-mundialThin text-nowrap bdesktop:text-[16px] laptop:leading-[1] laptop:text-[14px] w-1/2'>{formatPrice(currency, convertPrice(currency, formatNumber(unitData?.attributes.rentApp)), true)}/w</p>
                </div>
                <div className='flex smobile:w-full laptop:bg-summaryOddTextBackground laptop:pt-[5px] laptop:pr-[8px] laptop:pl-[8px] laptop:pb-[5px]'>
                  <p className='font-mundialRegular text-black bdesktop:text-[16px] laptop:leading-[1] laptop:text-[14px] w-1/2'>Rates</p>
                  <p className='font-mundialThin text-nowrap bdesktop:text-[16px] laptop:leading-[1] laptop:text-[14px] w-1/2'>{formatPrice(currency, convertPrice(currency, formatNumber(unitData?.attributes.rates)), true)}/year</p>
                </div>
              </div>
            </li>
          </ul>
        </div>
      )

    case 3:
      return (
        <div className='smobile:flex-col smobile:gap-4 smobile:hidden smobile:h-0 laptop:flex laptop:gap-0 laptop:h-auto smobile:w-full'>
          <div
            className={dropdownClassList}
            onClick={() => handleDialogue(2)}
          >
            <h3 className='smobile:mb-[10px] smobile:text-[20px] smobile:leading-[1] smobile:font-mundialRegular laptop:text-[16px] laptop:mb-0 laptop:pb-0'>Units on this Level</h3>
            {activeDialogue
              ? <ChevronUp className='smobile:w-[16px] smobile:h-[16px]' />
              : <ChevronDown className='smobile:w-[16px] smobile:h-[16px]' />}
          </div>
          {unitId !== null && (
            <ul
              ref={contentRef}
              style={{
                maxHeight: height,
                transition: 'max-height 0.2s ease-in-out',
                overflow: height === '0px' ? 'hidden' : 'visible'
              }}
              className='smobile:flex smobile:flex-col smobile:gap-[12px]'
            >
              <li className='smobile:flex smobile:pt-[25px] laptop:py-[12px]'>
                <div className='smobile:flex smobile:flex-col smobile:w-full smobile:pb-4 laptop:p-0 overflow-visible desktop:pb-[40px]'>
                  <UnitSelector
                    onUnitIdChange={onUnitIdChange}
                    unitId={unitId}
                    currentFloorData={currentFloorData}
                    currentTab={currentTab}
                    isOnlyUnits
                  />
                </div>
              </li>
            </ul>
          )}
        </div>
      )

    default:
      break
  }
}
