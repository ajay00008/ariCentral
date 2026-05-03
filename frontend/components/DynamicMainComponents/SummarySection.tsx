'use client'

import * as React from 'react'
import {
  MdAcUnit,
  MdBalcony,
  MdBeachAccess,
  MdDeck,
  MdElevator,
  MdEvStation,
  MdFilterHdr,
  MdFireplace,
  MdFitnessCenter,
  MdGarage,
  MdHotTub,
  MdInventory2,
  MdKeyboard,
  MdKitchen,
  MdLocalCarWash,
  MdLocalPizza,
  MdMicrowave,
  MdOutdoorGrill,
  MdPedalBike,
  MdPets,
  MdPool,
  MdQuestionMark,
  MdRoofing,
  MdSelfImprovement,
  MdShelves,
  MdShower,
  MdSolarPower,
  MdSpa,
  MdSurfing,
  MdWaves,
  MdWeekend
} from 'react-icons/md'

interface SummarySectionProps {
  data: ActionGetPropertyBySlug
}

export function SummarySection ({ data }: SummarySectionProps): React.ReactNode {
  const columns = [
    {
      label: 'Builder',
      text: data.Builder
    },
    {
      label: 'Architect',
      text: data.Architect
    },
    {
      label: 'Developer',
      text: data.Developer
    }
  ]

  const filteredColumns = columns.filter(
    (it) => !it.text.endsWith(' disabled')
  )
  const hasFacilities = (data.Facilities?.Items.length ?? 0) > 0
  const hasSummary = data.Summary !== ''
  const hasDates = (data.Dates?.Items?.length ?? 0) > 0

  const hasNoData =
    filteredColumns.length === 0 && !hasSummary && !hasDates && !hasFacilities

  if (hasNoData) {
    return null
  }

  return (
    <section
      id='summary'
      className='py-8 px-4 max-w-[2000px] w-full mx-auto flex flex-col gap-8 md:px-8 lg:p-16 lg:gap-16 xl:flex-row xl:justify-between'
    >
      {(filteredColumns.length > 0 || hasSummary || hasDates) && (
        <div className='flex flex-col gap-8 lg:gap-16 xl:w-1/2'>
          <SummarySectionHeadline text='Summary' />
          <div className='flex flex-col gap-8 xl:flex-row xl:gap-24'>
            {filteredColumns.length > 0 && (
              <div className='flex flex-col gap-5 shrink-0 md:flex-row md:gap-[52px] xl:flex-col xl:gap-5'>
                {filteredColumns.map((column) => (
                  <SummarySectionColumn
                    key={column.label}
                    label={column.label}
                    text={column.text}
                  />
                ))}
              </div>
            )}
            <div className='flex flex-col gap-8'>
              {hasSummary && (
                <div className='font-mundialLight font-base/normal text-[#221C1A] whitespace-pre-line'>
                  {data.Summary}
                </div>
              )}
              {data.Dates !== undefined && hasDates && (
                <SummarySectionColumn
                  label='Key Dates'
                  text={data.Dates.Items.map((item) => item.Item)}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {hasFacilities && (
        <>
          <SummarySectionSeparator />
          <div className='flex flex-col gap-8 shrink-0 xl:w-1/3 xl:gap-16'>
            <SummarySectionHeadline text='Facilities' />
            <div className='grid grid-cols-2 gap-4 md:gap-x-16 md:grid-cols-[max-content_max-content] xl:grid-cols-2 xl:gap-x-2'>
              {data.Facilities?.Items.map((facility) => (
                <SummarySectionFacility
                  key={facility.id}
                  name={facility.Item}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </section>
  )
}

interface SummarySectionHeadlineProps {
  text: string
}

export function SummarySectionHeadline ({
  text
}: SummarySectionHeadlineProps): React.ReactNode {
  return (
    <h2 className='font-mundialRegular text-xl/tight text-black xl:text-[32px]/tight'>
      {text}
    </h2>
  )
}

interface SummarySectionColumnProps {
  label: string
  text: string | string[]
}

export function SummarySectionColumn ({
  label,
  text
}: SummarySectionColumnProps): React.ReactNode {
  const texts = Array.isArray(text) ? text : [text]

  return (
    <div className='flex flex-col gap-[10px]'>
      <h6 className='font-mundialRegular text-base/none text-black'>{label}</h6>
      <div className='flex flex-col gap-[10px]'>
        {texts.map((text, idx) => (
          <p
            key={`${idx}.${text}`}
            className='font-mundialLight text-base/none text-[#464646] whitespace-pre-line'
          >
            {text}
          </p>
        ))}
      </div>
    </div>
  )
}

interface SummarySectionFacilityProps {
  name: string
}

export function SummarySectionFacility ({
  name
}: SummarySectionFacilityProps): React.ReactNode {
  let FacilityIcon = MdQuestionMark
  const key = name.toLowerCase().trim()

  if (key.includes('bbq')) {
    FacilityIcon = MdOutdoorGrill
  } else if (key.includes('beach')) {
    FacilityIcon = MdBeachAccess
  } else if (key.includes('bike')) {
    FacilityIcon = MdPedalBike
  } else if (key.includes('car wash')) {
    FacilityIcon = MdLocalCarWash
  } else if (key.includes('ceiling')) {
    FacilityIcon = MdRoofing
  } else if (key.includes('cold')) {
    FacilityIcon = MdAcUnit
  } else if (key.includes('ev charger')) {
    FacilityIcon = MdEvStation
  } else if (key.includes('fireplace')) {
    FacilityIcon = MdFireplace
  } else if (key.includes('fridge')) {
    FacilityIcon = MdKitchen
  } else if (key.includes('garage')) {
    FacilityIcon = MdGarage
  } else if (key.includes('gym')) {
    FacilityIcon = MdFitnessCenter
  } else if (key.includes('hot tub')) {
    FacilityIcon = MdHotTub
  } else if (key.includes('kitchen')) {
    FacilityIcon = MdOutdoorGrill
  } else if (key.includes('lift')) {
    FacilityIcon = MdElevator
  } else if (key.includes('living')) {
    FacilityIcon = MdDeck
  } else if (key.includes('mpr')) {
    FacilityIcon = MdWeekend
  } else if (key.includes('ocean')) {
    FacilityIcon = MdWaves
  } else if (key.includes('office')) {
    FacilityIcon = MdKeyboard
  } else if (key.includes('pantry')) {
    FacilityIcon = MdShelves
  } else if (key.includes('pizza')) {
    FacilityIcon = MdLocalPizza
  } else if (key.includes('sauna')) {
    FacilityIcon = MdMicrowave
  } else if (key.includes('spa')) {
    FacilityIcon = MdSpa
  } else if (key.includes('storage')) {
    FacilityIcon = MdInventory2
  } else if (key.includes('pet')) {
    FacilityIcon = MdPets
  } else if (key.includes('pool')) {
    FacilityIcon = MdPool
  } else if (key.includes('rooftop amenities')) {
    FacilityIcon = MdFilterHdr
  } else if (key.includes('shower')) {
    FacilityIcon = MdShower
  } else if (key.includes('solar')) {
    FacilityIcon = MdSolarPower
  } else if (key.includes('surfboard')) {
    FacilityIcon = MdSurfing
  } else if (key.includes('terrace')) {
    FacilityIcon = MdBalcony
  } else if (key.includes('water')) {
    FacilityIcon = MdWaves
  } else if (key.includes('yoga')) {
    FacilityIcon = MdSelfImprovement
  }

  return (
    <div className='flex gap-4 items-center'>
      <FacilityIcon color='#464646' size={18} />
      <p className='font-mundialLight text-base/none text-[#464646]'>{name}</p>
    </div>
  )
}

export function SummarySectionSeparator (): React.ReactNode {
  return <span className='block bg-[#D1D1D1] h-[1px] w-full lg:hidden' />
}
