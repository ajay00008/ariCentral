'use client'

import assets from '@/assets'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import React from 'react'
import { TabIcon } from './TabIcon'

interface Props {
  currentTab: string
  unit: CustomUnit | undefined
  property: ActionGetPropertyBySlug
  onTabChange: (newTab: string) => void
}

export function UnitTabs ({ currentTab, property, unit, onTabChange }: Props): React.ReactNode {
  const [isDropdownOpen, setIsDropdownOpen] = React.useState(false)

  const unitGalleryLength = unit?.attributes.unitGallery.data?.length ?? 0

  const amenitiesGalleryLength =
    property?.AmenitiesGallery?.SubGallery?.reduce(
      (total, subGallery) => total + (subGallery.Media.data?.length ?? 0),
      0
    ) ?? 0

  const viewsGalleryLength =
    property?.ViewsGallery?.SubGallery?.reduce(
      (total, subGallery) => total + (subGallery.Media.data?.length ?? 0),
      0
    ) ?? 0

  const generalGalleryLength =
    property.Gallery?.SubGallery?.reduce(
      (total, subGallery) => total + (subGallery.Media.data?.length ?? 0),
      0
    ) ?? 0

  const totalGalleryLength = unitGalleryLength + amenitiesGalleryLength + generalGalleryLength

  const tabs = [
    { name: 'Summary', icon: assets.ListSVGUpdated },
    {
      name: 'FloorPlans',
      icon: assets.PlanSVGUpdated,
      count: unit?.attributes.unitPlan.data !== null ? 1 : 0
    },
    {
      name: 'Gallery',
      icon: assets.GallerySVGUpdated,
      count: totalGalleryLength
    },
    { name: 'Views', icon: assets.ViewsSVGUpdated, count: viewsGalleryLength },
    { name: 'VTour', icon: assets.VTourSVGUpdated }
  ]

  return (
    <div className='smobile:w-full smobile:border-t smobile:mb-10 mb-0 laptop:border-none'>
      <div
        className='smobile:block absolute laptop:hidden w-full h-full left-0'
        style={{
          background: isDropdownOpen ? '#00000099' : 'transparent',
          zIndex: isDropdownOpen ? 10 : 0
        }}
      >
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          style={{ background: 'black' }}
          className='w-full py-2 px-4 flex text-customWhite text-left items-center justify-between '
        >
          <div className='flex items-center gap-2'>
            <TabIcon tabs={tabs} currentTab={currentTab} />
            <div className='smobile:flex smobile:gap-[8px] smobile:items-center'>
              <p className='smobile:font-mundialRegular laptop:text-[14px]'>{currentTab}</p>
            </div>
          </div>
          <ChevronDownIcon
            className={`w-5 h-5 transform transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
            style={{ color: 'white' }}
          />
        </button>
        {isDropdownOpen && (
          <ul className='border border-gray-300 bg-white'>
            {tabs.map((tab) => (
              <li
                key={tab.name}
                onClick={() => {
                  onTabChange(tab.name)
                  setIsDropdownOpen(false)
                }}
                style={currentTab === tab.name ? { display: 'none' } : {}}
                className='group hover:cursor-pointer hover:bg-[#ECF0F4] smobile:w-full smobile:py-[16px] smobile:px-[16px] smobile:flex smobile:gap-[23px] smobile:items-center smobile:border smobile:border-[#D1D1D1] smobile:border-t-0 laptop:gap-[16px] laptop:max-w-none laptop:w-fit laptop:px-[22px] laptop:py-[10px] laptop:h-[40px] laptop:whitespace-nowrap'
              >
                <tab.icon
                  width={22}
                  height={22}
                  style={currentTab === tab.name ? { fill: 'white' } : {}}
                  className='smobile:w-[22px] smobile:h-[22px] laptop:flex laptop:shrink-0'
                />
                <div className='smobile:flex smobile:gap-[8px] smobile:items-center'>
                  <p
                    style={currentTab === tab.name ? { color: 'white' } : {}}
                    className='smobile:font-mundialRegular smobile:text-black laptop:text-[14px]'
                  >
                    {tab.name}
                  </p>
                </div>
                {tab.count !== undefined && (
                  <span className='smobile:leading-[1] smobile:w-[24px] smobile:h-[24px] smobile:rounded-[50%] smobile:bg-updatedGrey smobile:flex smobile:items-center smobile:justify-center smobile:text-[12px] laptop:text-[10px] laptop:w-[20px] laptop:h-[20px] smobile:font-mundialRegular'>
                    {tab.count}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ul className='hidden laptop:flex smobile:w-full smobile:border-t laptop:flex-row smobile:border-[#D1D1D1]'>
        {tabs.map((tab) => (
          <li
            key={tab.name}
            onClick={() => onTabChange(tab.name)}
            style={currentTab === tab.name ? { background: 'black' } : {}}
            className='group hover:cursor-pointer hover:bg-[#ECF0F4] smobile:w-full smobile:py-[16px] smobile:px-[16px] smobile:flex smobile:gap-[23px] smobile:items-center smobile:border smobile:border-[#D1D1D1] smobile:border-t-0 laptop:gap-[16px] laptop:max-w-none laptop:w-fit laptop:px-[22px] laptop:py-[10px] laptop:h-[40px] laptop:whitespace-nowrap'
          >
            <tab.icon
              width={22}
              height={22}
              style={currentTab === tab.name ? { fill: 'white' } : {}}
              className='smobile:w-[22px] smobile:h-[22px] laptop:flex laptop:shrink-0'
            />
            <div className='smobile:flex smobile:gap-[8px] smobile:items-center'>
              <p
                style={currentTab === tab.name ? { color: 'white' } : {}}
                className='smobile:font-mundialRegular smobile:text-black laptop:text-[14px]'
              >
                {tab.name}
              </p>
              {tab.count !== undefined && (
                <span className='smobile:leading-[1] smobile:w-[24px] smobile:h-[24px] smobile:rounded-[50%] smobile:bg-updatedGrey smobile:flex smobile:items-center smobile:justify-center smobile:text-[12px] laptop:text-[10px] laptop:w-[20px] laptop:h-[20px] smobile:font-mundialRegular'>
                  {tab.count}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
