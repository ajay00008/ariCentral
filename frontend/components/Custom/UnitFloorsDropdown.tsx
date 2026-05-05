'use client'

import * as React from 'react'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { getPropertyFloors } from '@/lib/property-units'

interface Props {
  onFloorChange: (floorId: number) => void
  data: ActionGetPropertyBySlug
  currentFloorData: Floor | undefined
  currentTab: string
}

export function UnitFloorsDropdown ({ onFloorChange, data, currentFloorData, currentTab }: Props): React.ReactNode {
  const [isOpen, setIsOpen] = React.useState(false)
  const wrapperRef = React.useRef<HTMLDivElement>(null)
  const wrapperStyles = currentTab === 'FloorPlans' ? 'smobile:bottom-0' : 'smobile:bottom-0'

  function toggleDropdown (): void {
    setIsOpen(!isOpen)
  }

  function handleClickOutside (e: MouseEvent): void {
    if ((wrapperRef.current !== null) && !wrapperRef.current.contains(e.target as Node)) {
      setIsOpen(false)
    }
  }

  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div ref={wrapperRef} className={`smobile:fixed smobile:left-0 smobile:w-full ${wrapperStyles} laptop:hidden laptop:h-0`}>
      {isOpen && (
        <motion.div
          initial={{ height: '50px' }}
          animate={{ height: isOpen ? 'auto' : 'auto' }}
          transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
          className='bg-dropdownWhite flex flex-col h-auto'
        >
          <ul className='mb-auto'>
            {getPropertyFloors(data).map(item => {
              if (currentFloorData === undefined) return null
              const isSelected = item.id === currentFloorData.id
                ? 'pointer-events-none bg-black'
                : 'pointer-events-auto bg-dropdownWhite'
              return (
                <li
                  key={item.id}
                  className={`pt-[20px] pr-[18px] pb-[20px] pl-[18px] list-none cursor-pointer group hover:bg-white hover:bg-opacity-100 transition-colors duration-200 ${isSelected}`}
                  onClick={() => onFloorChange(item.id)}
                >
                  <p className={`${item.id === currentFloorData.id ? 'text-white' : 'text-black'} text-start font-mundialLight text-lg group-hover:text-black transition-colors duration-200`}>{item.attributes.identifier}</p>
                </li>
              )
            })}
          </ul>
        </motion.div>
      )}
      <div onClick={toggleDropdown} className='flex justify-between items-center px-[18px] py-[20px] max-h-[56px] bg-black'>
        <span className='font-mundialLight text-white text-lg'>Level {currentFloorData?.attributes.identifier}</span>
        <button className='text-white w-auto h-auto'>
          {isOpen ? <ChevronUp className='smobile:stroke-white smobile:w-[20px] smobile:h-[20px]' /> : <ChevronDown className='smobile:stroke-white smobile:w-[20px] smobile:h-[20px]' />}
        </button>
      </div>
    </div>
  )
}
