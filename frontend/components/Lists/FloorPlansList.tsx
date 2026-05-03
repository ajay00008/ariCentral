'use client'

import * as React from 'react'
import { FloorPlanSwiper } from '@/components/Swipers/FloorPlanSwiper'
import { SwiperControlInterface } from '@/components/Custom/SwiperControlInterface'

interface Props {
  data: ActionGetPropertyBySlug
  currency: Currency
  isCommissionEnabled: boolean
}

export function FloorPlansList ({ data, currency, isCommissionEnabled }: Props): React.ReactNode {
  const [unitsData, setUnitsData] = React.useState<Unit[] | CustomUnit[]>([])
  const [slidesChanges, setSlidesChanges] = React.useState<number>(0)
  const [lastDisable, setLastDisable] = React.useState<boolean>(false)
  const [firstDisable, setFirstDisable] = React.useState<boolean>(false)

  function handleSlidesChange (): void {
    setSlidesChanges(prev => prev + 1)
  }

  function handleActiveIndexChange (index: number): void {
    const lastIndex = unitsData.length - 3
    const activeIndex = index

    if (activeIndex === lastIndex) {
      setLastDisable(true)
    } else {
      setLastDisable(false)
    }

    if (activeIndex === 0) {
      setFirstDisable(true)
    } else {
      setFirstDisable(true)
    }
  }

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

  return (unitsData.length > 0
    ? (
      <section id='floorPlans' className='smobile:overflow-hidden smobile:py-[32px] smobile:px-[16px] tablet:px-[32px] laptop:p-[64px] max-w-[2000px] w-full mx-auto'>
        <div className='smobile:flex smobile:flex-col smobile:justify-between smobile:w-full smobile:gap-10'>
          <div className='smobile:w-full smobile:flex smobile:justify-between'>
            <h2 className='smobile:text-[24px] smobile:leading-[1] laptop:text-[32px] font-mundialRegular'>Floor Plans</h2>
            {unitsData.length > 3 && (
              <SwiperControlInterface
                slidesChanges={slidesChanges}
                onSlideChange={handleSlidesChange}
                firstDisable={firstDisable}
                lastDisable={lastDisable}
              />
            )}
          </div>
          <div className='flex justify-between flex-wrap gap-y-[15px]'>
            <div id='floorPlans slider' className='w-full'>
              <FloorPlanSwiper
                data={unitsData}
                currency={currency}
                comission={data.Commission}
                onSlideChange={handleSlidesChange}
                slidesChanges={slidesChanges}
                isCommissionEnabled={isCommissionEnabled}
                onActiveIndexChange={handleActiveIndexChange}
              />
            </div>
          </div>
        </div>
      </section>
      )
    : null
  )
}
