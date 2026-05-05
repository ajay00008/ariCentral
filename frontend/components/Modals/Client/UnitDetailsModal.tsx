'use client'

import * as React from 'react'
import { UnitFloorsDropdown } from '@/components/Custom/UnitFloorsDropdown'
import { UnitModalFloorPlan } from '@/components/Custom/UnitModalFloorPlan'
import { UnitModalGallery } from '@/components/Custom/UnitModalGallery'
import { UnitModalVTour } from '@/components/Custom/UnitModalVTour'
import { UnitSummary } from '@/components/Custom/UnitSummary'
import { UnitTabs } from '@/components/Lists/UnitTabs'
import { heroImages } from '@/lib/hero-images'
import { useUnitModalProvider } from '@/providers/UnitModalProvider'
import { TitleCapitalize } from '@/utils/capitalize'
import { X } from 'lucide-react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useMediaQuery } from 'react-responsive'

interface Props {
  data: ActionGetPropertyBySlug
  currency: Currency
  isPreview?: boolean
}

export function openModal (elementId: string): void {
  document.body.style.overflow = 'hidden'
  const modal = document.getElementById(elementId)
  modal?.classList.remove('hidden')
  modal?.classList.add('opacity-0', 'flex', 'transition-opacity', 'duration-200')
  setTimeout(() => {
    modal?.classList.remove('opacity-0')
  }, 50)
}

export function closeModalWithAnimation (elementId: string, isNested?: boolean): void {
  if (isNested === undefined) {
    document.body.style.overflow = ''
  }
  const modal = document.getElementById(elementId)
  modal?.classList.add('opacity-0')
  setTimeout(() => {
    modal?.classList.remove('flex')
    modal?.classList.add('hidden')
    modal?.classList.remove('opacity-100')
  }, 300)
}

export function UnitDetailsModal ({ data, currency, isPreview }: Props): React.ReactNode {
  const { closeModal, isModalOpen, tab, unitId } = useUnitModalProvider()
  const { data: session } = useSession()
  const allowPublicProperties = process.env.NEXT_PUBLIC_ALLOW_PUBLIC_PROPERTIES === 'true'
  if (!allowPublicProperties && session === null && isPreview !== true) {
    return null
  }

  const user = session as SessionType | null
  const [stableUnitId, setStableUnitId] = React.useState<number | null>(unitId)
  const [unitData, setUnitData] = React.useState<CustomUnit | undefined>(undefined)
  const [currentFloorData, setCurrentFloorData] = React.useState<Floor | undefined>(undefined)
  const [unitStatus, setUnitStatus] = React.useState<string>('')
  const [activeTab, setActiveTab] = React.useState<string>('Summary')
  const isLaptopScreen = useMediaQuery({ query: '(min-width: 1280px) and (max-width: 1439px)' })
  const isDesktopScreen = useMediaQuery({ query: '(min-width: 1440px) and (max-width: 1727px)' })
  const isBDesktopScreen = useMediaQuery({ query: '(min-width: 1728px)' })
  const current1280ScreenHeight = `${window.innerHeight - 217}px`
  const current1440ScreenHeight = `${window.innerHeight - 217}px`
  const current1728ScreenHeight = `${window.innerHeight - 217}px`

  function handleChangeActiveTab (newTab: string): void {
    setActiveTab(newTab)
  }

  function handleChangeUnitId (unitId: number): void {
    setStableUnitId(unitId)
  }

  function handleSetCurrentFloor (floorId: number): void {
    const foundedFloor = data.floors.data.find(item => item.id === floorId)
    if (foundedFloor === undefined) return
    setCurrentFloorData(foundedFloor)
    handleChangeUnitId(foundedFloor.attributes.units.data[0].id)
  }

  function handleCloseModal (): void {
    closeModalWithAnimation('modal')
    closeModal()
  }

  function handleBackdropClick (e: React.MouseEvent<HTMLDivElement>): void {
    if (e.target === e.currentTarget) {
      handleCloseModal()
    }
  }

  function handleEscape (e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      handleCloseModal()
    }
  }

  React.useEffect(() => {
    if (isModalOpen) {
      setActiveTab(tab)
      openModal('modal')
    }
  }, [isModalOpen])

  React.useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('keydown', (e) => handleEscape(e))

      return () => {
        document.removeEventListener('keydown', (e) => handleEscape(e))
      }
    }
  }, [isModalOpen])

  React.useEffect(() => {
    setStableUnitId(unitId)
  }, [unitId])

  React.useEffect(() => {
    if (stableUnitId !== null) {
      const allUnits: CustomUnit[] = []

      data.floors.data.map((item) => {
        const units = item.attributes.units.data.map((item) => {
          return allUnits.push(item)
        })

        return units
      })

      const foundedUnit = allUnits.find(item => item.id === stableUnitId)
      setUnitData(foundedUnit)
      if (foundedUnit === undefined) return
      const unitStatusBG = foundedUnit.attributes.status === 'AVAILABLE'
        ? 'bg-unitGreen'
        : foundedUnit.attributes.status === 'SOLD'
          ? 'bg-unitRed'
          : foundedUnit.attributes.status === 'RESERVED'
            ? 'bg-unitOrange'
            : ''
      setUnitStatus(unitStatusBG)
    }
  }, [stableUnitId])

  React.useEffect(() => {
    if (window.location.hash.length !== 0) {
      const hash = window.location.hash
      const element = document.getElementById(hash.substring(1))
      if (element !== null) {
        window.scrollTo({
          top: element.offsetTop,
          behavior: 'smooth'
        })
      }
    }
  }, [])

  React.useEffect(() => {
    if (stableUnitId !== null && unitData !== undefined) {
      const floorId = unitData?.attributes.floor.data.id

      const foundedFloor = data.floors.data.find(item => item.id === floorId)
      setCurrentFloorData(foundedFloor)
    }
  }, [unitData])

  const heroImage = heroImages(data)[0]

  return (
    <div
      id='modal'
      className='fixed inset-0 z-50 bg-black bg-opacity-30 hidden smobile:overflow-hidden laptop:max-w-none'
      onClick={handleBackdropClick}
    >
      <div className='smobile:bg-dropdownWhite smobile:overflow-auto smobile:relative w-full smobile:py-[30px] smobile:px-[16px] smobile:rounded-[20px] tablet:min-w-[768px] tablet:px-[30px] tablet:overflow-auto laptop:max-h-none laptop:w-full laptop:h-full laptop:overflow-hidden laptop:py-0 laptop:px-0 laptop:rounded-none'>
        <div className='smobile:flex smobile:flex-col smobile:w-auto smobile:h-auto laptop:flex-row'>
          <div className='smobile:hidden smobile:h-0 laptop:fixed laptop:flex'>
            <div className='laptop:flex laptop:flex-col laptop:w-full laptop:bg-black laptop:h-screen laptop:justify-between'>
              <div className='laptop:flex laptop:flex-col laptop:w-full laptop:divide-y'>
                <ul>
                  {data.floors.data.map(item => {
                    if (currentFloorData === undefined) return null
                    const isSelected = item.id === currentFloorData.id
                      ? 'pointer-events-none'
                      : 'pointer-events-auto'
                    return (
                      <li
                        key={item.id}
                        className={`p-[10px] list-none cursor-pointer group hover:bg-white hover:bg-opacity-100 transition-colors duration-200 ${isSelected} ${item.id === currentFloorData.id ? 'bg-opacity-100 bg-white' : 'bg-opacity-30'}`}
                        onClick={() => handleSetCurrentFloor(item.id)}
                      >
                        <p className={`${item.id === currentFloorData.id ? 'text-black' : 'text-white'} text-center group-hover:text-black transition-colors duration-200`}>{item.attributes.identifier}</p>
                      </li>
                    )
                  })}
                </ul>
              </div>
              <h3 className='laptop:text-white laptop:font-mundialRegular laptop:px-[16px] laptop:text-center laptop:text-[11px] laptop:leading-[9px] laptop:pb-[16px]'>LEVEL</h3>
            </div>
          </div>
          <div className='smobile:flex smobile:flex-col smobile:w-auto smobile:h-auto laptop:ml-[64px] laptop:w-full laptop:p-[32px] desktop:p-[48px] bdesktop:p-[64px]'>
            <div className='flex justify-between bdesktop:items-center'>
              <div className='flex gap-3 items-start bdesktop:items-center'>
                <h3 className='smobile:font-mundialRegular smobile:text-[40px] smobile:leading-[38px] smobile:text-black laptop:font-mundialRegular laptop:text-[40px] laptop:leading-[1] laptop:text-black laptop:mb-0 bdesktop:text-[72px] bdesktop:leading-[1]'>Unit {unitData?.attributes.identifier}</h3>
                <p className={`smobile:font-mundialRegular smobile:text-[12.4px] smobile:leading-[16px] desktop:leading-[8px] bdesktop:leading-[16px] smobile:text-nowrap smobile:w-fit smobile:py-[8px] smobile:px-[14px] smobile:text-white  desktop:font-mundialThin ${unitStatus} desktop:text-nowrap desktop:w-fit desktop:py-[12px] desktop:px-[25px] desktop:text-white desktop:text-[16px]`}>{TitleCapitalize(unitData?.attributes.status)}</p>
              </div>
              <button onClick={() => handleCloseModal()} className='text-gray-600 hover:text-gray-800'>
                <X width={26} height={26} />
              </button>
            </div>
            <div className='smobile:flex smobile:flex-col smobile:w-full smobile:h-auto'>
              <div className='my-5'>
                <UnitTabs currentTab={activeTab} onTabChange={handleChangeActiveTab} unit={unitData} property={data} />
              </div>
              <div
                className='smobile:flex smobile:flex-col smobile:w-full smobile:h-auto laptop:flex-row-reverse laptop:mt-0 laptop:gap-[50px] desktop:mt-[-4px] bdesktop:gap-[75px]'
                style={{
                  height: isBDesktopScreen
                    ? current1728ScreenHeight
                    : isDesktopScreen
                      ? current1440ScreenHeight
                      : isLaptopScreen
                        ? current1280ScreenHeight
                        : undefined
                }}
              >
                {activeTab === 'Summary' && (
                  <div className='mb-[20px] h-auto laptop:w-[65%] laptop:mb-0'>
                    {heroImage !== undefined && (
                      <Image
                        src={heroImage.Image.data.attributes.url}
                        alt='Property hero image'
                        width={heroImage.Image.data.attributes.width ?? undefined}
                        height={heroImage.Image.data.attributes.height ?? undefined}
                        className='smobile:max-w-[100%] smobile:object-cover smobile:max-h-[188px] mobile:max-h-[218px] tablet:max-h-[388px] laptop:min-h-none laptop:max-h-none laptop:h-full object-contain'
                      />
                    )}
                  </div>
                )}
                {activeTab === 'Summary' && (
                  <UnitSummary
                    unitData={unitData}
                    currency={currency}
                    currentFloorData={currentFloorData}
                    unitId={stableUnitId}
                    makeAnOfferLink={data.MakeAnOfferLink}
                    commission={data.Commission}
                    currentTab={activeTab}
                    onUnitIdChange={handleChangeUnitId}
                    isCommissionEnabled={user?.user?.showCommission ?? false}
                    slug={data.Slug}
                    isPreview={isPreview}
                  />
                )}
                {activeTab === 'FloorPlans' && (
                  <UnitModalFloorPlan
                    currentFloorData={currentFloorData}
                    currentTab={activeTab}
                    onUnitIdChange={handleChangeUnitId}
                    unitData={unitData}
                    unitId={stableUnitId}
                  />
                )}
                {activeTab === 'Gallery' && (
                  <UnitModalGallery
                    currentFloorData={currentFloorData}
                    onUnitIdChange={handleChangeUnitId}
                    views={false}
                    data={data}
                    unitId={stableUnitId?.toString() ?? ''}
                  />
                )}
                {activeTab === 'Views' && (
                  <UnitModalGallery
                    currentFloorData={currentFloorData}
                    onUnitIdChange={handleChangeUnitId}
                    views
                    data={data}
                    unitId={stableUnitId?.toString() ?? ''}
                  />
                )}
                {activeTab === 'VTour' && (
                  <UnitModalVTour />
                )}
                <UnitFloorsDropdown
                  currentFloorData={currentFloorData}
                  currentTab={activeTab}
                  data={data}
                  onFloorChange={handleSetCurrentFloor}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
