'use client'

import * as React from 'react'
import Image from 'next/image'
import { useMediaQuery } from 'react-responsive'
import { HeroPropertyData } from '@/components/Custom/HeroPropertyData'
import { TitleCapitalize } from '@/utils/capitalize'
import { useUnitModalProvider } from '@/providers/UnitModalProvider'
import { heroImages } from '@/lib/hero-images'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface HeroSectionProps {
  data: ActionGetPropertyBySlug
  isCommissionEnabled: boolean
  isPreview?: boolean
}

export function HeroSection ({ data, isCommissionEnabled, isPreview }: HeroSectionProps): React.ReactNode {
  const { openModal } = useUnitModalProvider()
  const isTabletScreen = useMediaQuery({ query: '(min-width: 768px)' })
  const [imageIdx, setImageIdx] = React.useState(0)

  function handleChangeImage (step: number): void {
    setImageIdx((prev) => (prev + step))
  }

  const dataHeroImages = heroImages(data)
  const units = data.floors.data.map((floor) => floor.attributes.units.data).flat()

  const arrowsClassName = cn('text-white opacity-70 hover:opacity-100 transition duration-200 flex items-center justify-center w-[25px] shrink-0')

  const leftArrowClassName = cn(arrowsClassName, {
    'opacity-0 pointer-events-none': imageIdx === 0
  })

  const rightArrowClassName = cn(arrowsClassName, {
    'opacity-0 pointer-events-none': imageIdx === dataHeroImages.length - 1
  })

  return (
    <section id='hero' className='smobile:py-[32px]  laptop:p-[64px] tablet:px-[32px] laptop:h-[min(calc(100vh_-_62px),_1200px)] smobile:flex max-w-[2000px] mx-auto'>
      <div className='smobile:flex smobile:flex-col-reverse smobile:w-full laptop:gap-5 laptop:flex-row laptop:justify-between'>
        <div className='smobile:w-full smobile:px-[16px] tablet:px-0  laptop:w-[20.5%] desktop:w-[18%] bdesktop:w-[15%]'>
          <HeroPropertyData data={data} isCommissionEnabled={isCommissionEnabled} isPreview={isPreview} />
        </div>
        {dataHeroImages.length > 0 && (
          <div className='smobile:relative smobile:overflow-hidden smobile:w-full smobile:h-full laptop:w-[66%] desktop:w-[63.5%] bdesktop:w-[64%] smobile:flex'>
            <Image
              alt='Property image'
              className='smobile:hidden smobile:w-full smobile:h-full smobile:select-none smobile:pointer-events-none smobile:object-cover laptop:flex'
              fill
              priority
              src={dataHeroImages[imageIdx].Image.data.attributes.url ?? '/empty-skeleton.jpg'}
            />
            <Image
              alt='Property image'
              className='smobile:w-full smobile:h-full smobile:select-none smobile:pointer-events-none smobile:object-cover laptop:hidden'
              height={dataHeroImages[imageIdx].Image.data.attributes.height ?? 400}
              priority
              src={dataHeroImages[imageIdx].Image.data.attributes.url ?? '/empty-skeleton.jpg'}
              width={dataHeroImages[imageIdx].Image.data.attributes.width ?? 400}
            />
            {(dataHeroImages.length > 1 || dataHeroImages[imageIdx].Name !== '') && (
              <div
                className='absolute left-0 bottom-0 w-full px-2 pb-3 pt-[68px] flex'
                style={{ background: 'linear-gradient(to top, rgba(0, 0, 0, 0.5), transparent)' }}
              >
                <button
                  className={leftArrowClassName}
                  onClick={() => handleChangeImage(-1)}
                  type='button'
                >
                  <ChevronLeftIcon size={18} />
                </button>
                <div className='grow overflow-hidden px-2'>
                  {dataHeroImages[imageIdx].Name !== '' && (
                    <p className='text-grey font-mundialThin text-xl/tight whitespace-nowrap overflow-hidden overflow-ellipsis text-center'>
                      {dataHeroImages[imageIdx].Name}
                    </p>
                  )}
                </div>
                <button
                  className={rightArrowClassName}
                  onClick={() => handleChangeImage(1)}
                  type='button'
                >
                  <ChevronRightIcon size={18} />
                </button>
              </div>
            )}
            {units.map((unit) => {
              const position = unit.attributes.positions.find((position) => position.imageId === imageIdx)

              if (position === undefined) {
                return null
              }

              const unitIdentifier = unit.attributes.identifier

              const statusColor = unit.attributes.status === 'AVAILABLE'
                ? 'bg-unitGreen'
                : unit.attributes.status === 'SOLD'
                  ? 'bg-unitRed'
                  : unit.attributes.status === 'RESERVED'
                    ? 'bg-unitOrange'
                    : ''

              return (
                <div
                  key={unit.id}
                  onClick={() => openModal(unit.id)}
                  className='smobile:absolute smobile:hover:cursor-pointer group'
                  style={{
                    left: isTabletScreen
                      ? `calc(50% + ${position.x}% - 24px)`
                      : `calc(50% + ${position.x}% - 16px)`,
                    top: isTabletScreen
                      ? `calc(50% + ${position.y}% - 24px)`
                      : `calc(50% + ${position.y}% - 16px)`
                  }}
                >
                  <div
                    className='smobile:w-[32px] smobile:h-[32px] bg-black smobile:text-white smobile:font-mundialRegular smobile:text-[12px] smobile:flex smobile:items-center smobile:justify-center smobile:p-[10px] smobile:rounded-[50%] tablet:text-[20px] tablet:leading-[1] tablet:w-[48px] tablet:h-[48px] relative'
                  >
                    {unitIdentifier}
                    <div className='z-30 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto absolute bottom-full left-1/2 transform -translate-x-1/2 mb-[20px] min-w-[158px] p-[12px] bg-grey text-black text-[14px] leading-[1] transition-opacity duration-200'>
                      <span className='flex gap-[12px] items-center justify-between'>
                        <p className='font-mundialRegular text-[14px] leading-[1] w-max'>
                          Unit {unitIdentifier}
                        </p>
                        <p className={`smobile:flex smobile:items-center smobile:justify-center smobile:font-mundialRegular smobile:w-[78px] smobile:h-[22px] smobile:text-[12px] smobile:leading-[1px] smobile:text-nowrap smobile:text-white ${statusColor}`}>
                          {TitleCapitalize(unit.attributes.status)}
                        </p>
                      </span>
                      <div className='absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2'>
                        <svg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                          <path d='M12.3555 0.617188L23.8129 12.0745L12.3555 23.5319L0.898193 12.0745L12.3555 0.617188Z' fill='#F0F0F0' />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
