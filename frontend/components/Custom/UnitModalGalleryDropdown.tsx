'use client'

import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Props {
  caseNumber: number
  onUnitIdChange: (unitId: number) => void
  onGalleryChange: (galleryVariant: number) => void
  onSubGalleryChange: (index: number) => void
  toggleDropdown: (index: number) => void
  currentFloorData: Floor | undefined
  dropdowns: boolean[]
  unitId: string
  views: boolean
  currentGallery: string
  currentImageGallery: ImageGallery['marketPlace'] | undefined
  currentImageGalleryMedia: ServerSubGalleryData | { data?: StrapiMedia[] } | undefined
}

export function UnitModalGalleryDropdown ({
  caseNumber,
  unitId,
  onUnitIdChange,
  onGalleryChange,
  onSubGalleryChange,
  toggleDropdown,
  currentGallery,
  currentImageGallery,
  currentFloorData,
  currentImageGalleryMedia,
  views,
  dropdowns
}: Props): React.ReactNode {
  switch (caseNumber) {
    case 1:
      return (
        <div id='fs-dropdown-1' className='relative z-10 smobile:w-full smobile:border smobile:border-white smobile:bg-black'>
          <motion.div
            initial={{ height: '56px' }}
            animate={{ height: dropdowns[0] ? 'auto' : '56px' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className='bg-gray-800 text-white p-4 smobile:bg-transparent'
          >
            <div onClick={() => toggleDropdown(0)} className='flex justify-between items-center smobile:bg-transparent'>
              <span className='font-mundialRegular text-white'>{currentFloorData?.attributes.units.data?.find((item) => item.id === parseInt(unitId))?.attributes.identifier}</span>
              <button className='text-white w-auto h-auto'>
                {dropdowns[0]
                  ? <ChevronUp className='smobile:stroke-white smobile:w-[20px] smobile:h-[20px]' />
                  : <ChevronDown className='smobile:stroke-white smobile:w-[20px] smobile:h-[20px]' />}
              </button>
            </div>
            {dropdowns[0] && (
              <ul className='smobile:flex smobile:flex-col smobile:w-full'>
                {currentFloorData?.attributes.units.data?.map((item) => (
                  <li key={item.id}>
                    <button
                      type='button'
                      className={`w-full py-[10px] px-[20px] font-mundialRegular hover:bg-opacity-100 ${item.id === parseInt(unitId) ? 'bg-opacity-100 bg-black text-white border border-white' : 'bg-opacity-30 bg-white text-black'} transition-colors duration-200 mt-[10px]`}
                      onClick={() => { onUnitIdChange(item.id) }}
                    >
                      {item.attributes.identifier}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      )

    case 2:
      return (
        <div id='fs-dropdown-2' className='relative z-10 smobile:w-full smobile:border smobile:border-white smobile:bg-black smobile:mt-[10px]'>
          <motion.div
            initial={{ height: '56px' }}
            animate={{ height: dropdowns[1] ? 'auto' : '56px' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className='bg-gray-800 text-white p-4 smobile:bg-transparent'
          >
            <div onClick={() => toggleDropdown(1)} className='flex justify-between items-center smobile:bg-transparent'>
              <span className='font-mundialRegular text-white'>{currentGallery}</span>
              <button className='text-white w-auto h-auto'>
                {dropdowns[1]
                  ? <ChevronUp className='smobile:stroke-white smobile:w-[20px] smobile:h-[20px]' />
                  : <ChevronDown className='smobile:stroke-white smobile:w-[20px] smobile:h-[20px]' />}
              </button>
            </div>
            {dropdowns[1] && (
              <ul className='smobile:flex smobile:flex-col smobile:w-full'>
                {['Exterior', 'Interior', 'Facilities'].map((item, index) => (
                  <li key={`${item}1`}>
                    <button
                      type='button'
                      className={`w-full py-[10px] px-[20px] font-mundialRegular hover:bg-opacity-100 ${item === currentGallery ? 'bg-opacity-100 bg-black text-white border border-white' : 'bg-opacity-30 bg-white text-black'} transition-colors duration-200 mt-[10px]`}
                      onClick={() => { onGalleryChange(index + 1) }}
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      )

    case 3:
      if (currentGallery === 'Interior') return null
      return (
        <div id='fs-dropdown-3' className='relative z-10 smobile:w-full smobile:border smobile:border-white smobile:bg-black smobile:mt-[10px]'>
          <motion.div
            initial={{ height: '56px' }}
            animate={{ height: dropdowns[2] ? 'auto' : '56px' }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className='bg-gray-800 text-white p-4 smobile:bg-transparent'
          >
            <div onClick={() => toggleDropdown(2)} className='flex justify-between items-center smobile:bg-transparent'>
              <span className='font-mundialRegular text-white'>{views ? 'Views' : currentImageGallery?.SubGallery?.find(item => item.id === (currentImageGalleryMedia as ServerSubGalleryData)?.id)?.Name}</span>
              <button className='text-white w-auto h-auto'>
                {dropdowns[2]
                  ? <ChevronUp className='smobile:stroke-white smobile:w-[20px] smobile:h-[20px]' />
                  : <ChevronDown className='smobile:stroke-white smobile:w-[20px] smobile:h-[20px]' />}
              </button>
            </div>
            {dropdowns[2] && (
              <ul className='smobile:flex smobile:flex-col smobile:w-full'>
                {currentImageGallery?.SubGallery?.map((item, index) => (
                  <li key={item.id}>
                    <button
                      type='button'
                      className={`w-full py-[10px] px-[20px] font-mundialRegular hover:bg-opacity-100 ${item.id === (currentImageGalleryMedia as ServerSubGalleryData)?.id ? 'bg-opacity-100 bg-black text-white border border-white' : 'bg-opacity-30 bg-white text-black'} transition-colors duration-200 smobile:mt-[10px]`}
                      onClick={() => { onSubGalleryChange(index) }}
                    >
                      {item.Name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        </div>
      )

    default:
      break
  }
}
