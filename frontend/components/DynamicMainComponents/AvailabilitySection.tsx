'use client'

import * as React from 'react'
import { AvailabilityTable } from '@/components/Tables/AvailabilityTable'
import { AvailabilityCard } from '../Cards/AvailabilityCard'

interface Props {
  data: ActionGetPropertyBySlug
  currency: Currency
}

export function AvailabilitySection ({ data, currency }: Props): React.ReactNode {
  const [unitsData, setUnitsData] = React.useState<CustomUnit[] | null>(null)
  React.useEffect(() => {
    if (data.floors.data.length > 0) {
      const allUnits: UnitWithIndex[] = []

      data.floors.data.forEach((floor, index) => {
        if (floor.attributes === undefined || floor.id === undefined) return

        allUnits.push(...floor.attributes.units.data.map(unit => ({ ...unit, floorIndex: index })))
      })

      allUnits.sort((a, b) => {
        if (a.floorIndex !== b.floorIndex) {
          return a.floorIndex - b.floorIndex
        } else {
          return a.attributes.order - b.attributes.order
        }
      })

      const customUnits: CustomUnit[] = allUnits.map(({ floorIndex, ...unit }) => ({ ...unit }))

      setUnitsData(customUnits)
    }
  }, [data])

  return (unitsData !== null
    ? (
      <section
        id='table'
        className='smobile:px-[16px] smobile:py-[32px] tablet:px-[32px] laptop:p-[64px] max-w-[2000px] w-full mx-auto'
      >
        <div className='smobile:flex smobile:flex-col smobile:justify-between smobile:w-full smobile:gap-10 laptop:gap-0'>
          <h2 className='smobile:text-[24px] laptop:text-[32px] smobile:leading-[1] smobile:font-mundialRegular laptop:mb-[65px] bdesktop:mb-[96px]'>
            Availability
          </h2>
          <div className='smobile:hidden smobile:h-0 laptop:flex laptop:h-auto'>
            <AvailabilityTable
              data={unitsData}
              currency={currency}
            />
          </div>
          <ul className='smobile:w-full smobile:gap-[16px] smobile:flex smobile:flex-col laptop:hidden laptop:h-0'>
            {unitsData.map((unit) => (
              <AvailabilityCard
                key={unit.id}
                data={unit}
                currency={currency}
              />
            ))}
          </ul>
        </div>
      </section>
      )
    : null
  )
}
