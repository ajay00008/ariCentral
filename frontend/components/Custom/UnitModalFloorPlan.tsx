'use client'

import * as React from 'react'
import Image from 'next/image'
import { UnitSelector } from './UnitSelector'
import panzoom, { type PanZoom } from 'panzoom'

interface UnitModalFloorPlanProps {
  currentFloorData: Floor | undefined
  currentTab: string
  onUnitIdChange: (unitId: number) => void
  unitData: CustomUnit | undefined
  unitId: number | null
}

export function UnitModalFloorPlan ({
  currentFloorData,
  currentTab,
  onUnitIdChange,
  unitData,
  unitId
}: UnitModalFloorPlanProps): React.ReactNode {
  const parentRef = React.useRef<HTMLDivElement | null>(null)
  const elementRef = React.useRef<HTMLImageElement | null>(null)
  const panzoomRef = React.useRef<PanZoom | null>(null)

  const panzoomOptions = {
    maxZoom: 5.0,
    minZoom: 0.2,
    smoothScroll: false
  }

  React.useLayoutEffect(() => {
    if (elementRef.current !== null) {
      panzoomRef.current = panzoom(elementRef.current, panzoomOptions)
    }

    return () => {
      panzoomRef.current?.dispose()
    }
  }, [])

  React.useEffect(() => {
    panzoomRef.current?.dispose()

    if (elementRef.current !== null) {
      panzoomRef.current = panzoom(elementRef.current, panzoomOptions)
    }
  }, [unitData])

  function handleZoom (e: React.MouseEvent<HTMLButtonElement>): void {
    if (elementRef.current === null || parentRef.current === null || panzoomRef.current === null) {
      return
    }

    const button = e.target as HTMLButtonElement
    const parentRect = parentRef.current.getBoundingClientRect()
    const rect = elementRef.current.getBoundingClientRect()
    const cx = (rect.left - parentRect.left) + rect.width / 2
    const cy = (rect.top - parentRect.top) + rect.height / 2
    const zoomBy = button.innerText === '+' ? 2 : 0.5

    panzoomRef.current.zoomTo(cx, cy, zoomBy)
  }

  const imageData = unitData?.attributes.unitPlan.data?.attributes ?? null

  return (
    <div className='smobile:flex smobile:flex-col smobile:w-full smobile:gap-5 smobile:pb-12 tablet:pb-[91px] laptop:pb-[84px] desktop:pb-[100px]'>
      {imageData !== null && (
        <div className='flex w-full h-full overflow-hidden' ref={parentRef}>
          <Image
            alt='Unit plan image'
            className='smobile:w-full smobile:mx-auto smobile:max-w-[428px] smobile:max-h-[210px] tablet:max-w-[703px] tablet:max-h-[400px] laptop:max-w-none laptop:max-h-none laptop:h-full object-contain'
            height={imageData.height ?? undefined}
            ref={elementRef}
            src={imageData.url}
            width={imageData.width ?? undefined}
          />
        </div>
      )}
      {unitId !== null && (
        <UnitSelector
          currentFloorData={currentFloorData}
          currentTab={currentTab}
          onUnitIdChange={onUnitIdChange}
          unitId={unitId}
        />
      )}
      <div className='bg-dropdownWhite flex pt-2 pl-2 gap-2 absolute smobile:right-[16px] smobile:bottom-[74px] tablet:right-[30px] tablet:bottom-[82px] laptop:right-[32px] laptop:bottom-[32px] desktop:right-[48px] desktop:bottom-[48px] bdesktop:right-[64px] bdesktop:bottom-[64px]'>
        {['+', '-'].map((button) => (
          <button
            key={button}
            className='bg-black text-white text-base/tight py-[15px] text-center cursor-pointer w-[50px]'
            onClick={handleZoom}
          >
            {button}
          </button>
        ))}
      </div>
    </div>
  )
}
