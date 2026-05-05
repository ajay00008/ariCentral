'use client'

import { getFloorUnits } from '@/lib/property-units'

interface Props {
  currentFloorData: Floor | undefined
  unitId: number
  currentTab: string
  onUnitIdChange: (unitId: number) => void
  isOnlyUnits?: boolean
}

export function UnitSelector ({ currentFloorData, currentTab, unitId, onUnitIdChange, isOnlyUnits }: Props): React.ReactNode {
  const selectorStyles = currentTab === 'FloorPlans'
    ? 'absolute smobile:left-[16px] smobile:bottom-[74px] smobile:max-w-[calc(100%_-_140px)] tablet:left-[30px] tablet:bottom-[82px] smobile:max-w-[calc(100%_-_172px)] laptop:left-[95px] laptop:bottom-[32px] laptop:max-w-[calc(100%_-_268px)] desktop:bottom-[48px] desktop:left-[112px] bdesktop:bottom-[64px] bdesktop:left-[128px]'
    : ''

  return (
    isOnlyUnits === undefined
      ? (
        <div className={`bg-dropdownWhite flex flex-col pt-2 pr-2 gap-3 ${selectorStyles}`}>
          <h3 className='text-black font-mundialRegular smobile:text-[14px] laptop:text-[16px] desktop:text-[20px]'>
            Units on this level
          </h3>
          <div className='overflow-x-auto whitespace-nowrap'>
            <ul className='flex gap-[20px]'>
              {getFloorUnits(currentFloorData)
                .sort((a, b) => a.attributes.order - b.attributes.order)
                .map(unit => {
                  const statusColor = unit.attributes.status === 'AVAILABLE'
                    ? 'bg-unitGreen'
                    : unit.attributes.status === 'SOLD'
                      ? 'bg-unitRed'
                      : unit.attributes.status === 'RESERVED'
                        ? 'bg-unitOrange'
                        : ''
                  const opacity = unit.id === unitId
                    ? 'opacity-100'
                    : 'opacity-60'
                  const isSelected = unit.id === unitId
                    ? 'pointer-events-none'
                    : 'pointer-events-auto'
                  return (
                    <li
                      key={unit.id}
                      className='w-auto'
                    >
                      <button
                        onClick={() => onUnitIdChange(unit.id)}
                        className={`flex items-center justify-center smobile:min-w-[85px] gap-[5px] pr-[23px] pl-[30px] py-[17px] w-fit ${opacity} ${isSelected} hover:opacity-100 ${unit.id === unitId ? 'bg-black' : 'bg-updatedGrey'} transition duration-200 text-center cursor-pointer`}
                      >
                        <p className={`${unit.id === unitId ? 'text-white' : 'text-black'} font-mundialRegular text-[16px] leading-[1]`}>{unit.attributes.identifier}</p>
                        <div className={`min-w-[8px] h-[8px] ${statusColor} rounded-xl`} />
                      </button>
                    </li>
                  )
                })}
            </ul>
          </div>
        </div>
        )
      : (
        <div className='overflow-x-auto whitespace-nowrap'>
          <ul className='flex gap-[20px]'>
            {getFloorUnits(currentFloorData)
              .sort((a, b) => a.attributes.order - b.attributes.order)
              .map(unit => {
                const statusColor = unit.attributes.status === 'AVAILABLE'
                  ? 'bg-unitGreen'
                  : unit.attributes.status === 'SOLD'
                    ? 'bg-unitRed'
                    : unit.attributes.status === 'RESERVED'
                      ? 'bg-unitOrange'
                      : ''
                const opacity = unit.id === unitId
                  ? 'opacity-100'
                  : 'opacity-60'
                const isSelected = unit.id === unitId
                  ? 'pointer-events-none'
                  : 'pointer-events-auto'
                return (
                  <li
                    key={unit.id}
                    className='w-auto'
                  >
                    <button
                      onClick={() => onUnitIdChange(unit.id)}
                      className={`flex items-center justify-center smobile:min-w-[85px] gap-[5px] pr-[23px] pl-[30px] py-[17px] w-fit ${opacity} ${isSelected} hover:opacity-100 ${unit.id === unitId ? 'bg-black' : 'bg-updatedGrey'} transition duration-200 text-center cursor-pointer`}
                    >
                      <p className={`${unit.id === unitId ? 'text-white' : 'text-black'} font-mundialRegular text-[16px] leading-[1]`}>{unit.attributes.identifier}</p>
                      <div className={`min-w-[8px] h-[8px] ${statusColor} rounded-xl`} />
                    </button>
                  </li>
                )
              })}
          </ul>
        </div>
        )
  )
}
