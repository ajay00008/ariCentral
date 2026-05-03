'use client'

import * as React from 'react'
import { SearchInput } from '@/components/Custom/SearchInput'
import { ShowFirstName } from '@/components/Custom/ShowFirstName'
import { SearchSwiper } from '@/components/Swipers/SearchSwiper'
import { SwiperProvider } from '@/providers/SwiperProvider'
import { SearchPropertiesCard } from '@/components/Cards/SearchPropertiesCard'
import { SearchPropertyCard } from '../Cards/SearchPropertyCard'
import { cityList } from '@/constants/cityList'
import { PropertyCardSkeleton } from '@/components/Skeletons/PropertyCardSkeleton'

interface Props {
  currency: Currency
  amountOfFiltersActive: number
  allProperties: FullProperty[]
  featuredProperties: PropertyMain[]
  isCommissionEnabled: boolean
  userName: string
  onSearch: () => void
  onSearchValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSearchValueClean: () => void
  searchValue: string
  onBadgeCreate: (searchQ: string) => void
  onBadgeDelete: (index: number) => void
  badgeArray: string[]
  loading?: boolean
  skeletonCount?: number
  setBottomSentinel?: (el: HTMLDivElement | null) => void
}

export function SearchSection ({
  currency,
  allProperties,
  isCommissionEnabled,
  featuredProperties,
  userName,
  amountOfFiltersActive,
  searchValue,
  onSearch,
  onSearchValueChange,
  onSearchValueClean,
  onBadgeCreate,
  onBadgeDelete,
  badgeArray,
  loading = false,
  skeletonCount = 0,
  setBottomSentinel
}: Props): React.ReactNode {
  const [featuredPropertiesSlidesChanges, setFeaturedPropertiesSlidesChanges] = React.useState<number>(0)

  function handleFeaturedPropertiesSlidesChange (): void {
    setFeaturedPropertiesSlidesChanges(prev => prev + 1)
  }

  return (
    <section id='search' className='smobile:pt-[64px] mobile:pt-[84px] laptop:pt-[98px] bdesktop:pt-[112px] smobile:pb-[80px] smobile:mx-auto laptop:max-w-[1280px] desktop:max-w-[1440px] bdesktop:max-w-[1728px]'>
      <div className='smobile:flex smobile:flex-col smobile:justify-between smobile:w-full smobile:px-[16px] tablet:px-[32px] desktop:px-[64px] smobile:gap-[64px] mobile:gap-[84px] smobile:overflow-hidden laptop:overflow-hidden'>
        <div className='smobile:flex smobile:flex-col smobile:w-full smobile:gap-[24px] mobile:gap-[34px] desktop:gap-[48px] tablet:px-[32px] laptop:px-[224px] desktop:px-[272px] bdesktop:px-[360px]'>
          <div className='smobile:flex smobile:flex-col smobile:justify-between smobile:w-full'>
            <ShowFirstName userName={userName} />
          </div>
          <div>
            <SearchInput
              searchQ={searchValue}
              onSearch={onSearch}
              onSearchChange={onSearchValueChange}
              onSearchValueClean={onSearchValueClean}
              onBadgeCreate={onBadgeCreate}
              onBadgeDelete={onBadgeDelete}
              badgeArray={badgeArray}
              amountOfFiltersActive={amountOfFiltersActive}
              isSearchResults={false}
              loading={loading}
            />
          </div>
        </div>

        <div className='smobile:flex smobile:flex-col smobile:w-full smobile:gap-[16px] laptop:gap-[23px] desktop:gap-[27px] bdesktop:gap-[32px]'>
          <div className='w-full flex justify-end overflow-x-auto py-2'>
            <ul className='flex items-center space-x-4 px-4'>
              {cityList.map(city => (
                <li key={city} className='flex-shrink-0'>
                  <button
                    type='button'
                    onClick={() => onBadgeCreate(city)}
                    className='px-4 py-2 bg-gray-100 text-blue-600 rounded-full text-md font-mundialRegular underline-offset-4 underline decoration-3 hover:bg-blue-200 transition-colors'
                  >
                    {city}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <h2 className='smobile:font-mundialRegular smobile:text-[20px] bdesktop:text-[24px] smobile:leading-[1]'>Featured properties</h2>
          <ul className='smobile:flex smobile:justify-between smobile:flex-wrap smobile:gap-y-[15px] laptop:hidden laptop:h-0'>
            <SwiperProvider>
              <div className='w-full'>
                <SearchSwiper
                  data={featuredProperties}
                  currency={currency}
                  slidesChanges={featuredPropertiesSlidesChanges}
                  onSlideChange={handleFeaturedPropertiesSlidesChange}
                  swiperNumber={2}
                  isCommissionEnabled={isCommissionEnabled}
                />
              </div>
            </SwiperProvider>
          </ul>
          <ul className='smobile:hidden smobile:h-0 laptop:flex laptop:h-auto laptop:gap-[24px] desktop:hidden desktop:h-0'>
            {featuredProperties.slice(0, 3).map(property => (
              <SearchPropertiesCard
                key={property.id}
                data={property}
                currency={currency}
                slideChanged={featuredPropertiesSlidesChanges}
                swiperNumber={2}
                isCommissionEnabled={isCommissionEnabled}
              />
            ))}
          </ul>
          <ul className='smobile:hidden smobile:h-0 desktop:flex desktop:h-auto desktop:gap-[24px]'>
            {featuredProperties.slice(0, 4).map(property => (
              <SearchPropertiesCard
                key={property.id}
                data={property}
                currency={currency}
                slideChanged={featuredPropertiesSlidesChanges}
                swiperNumber={2}
                isCommissionEnabled={isCommissionEnabled}
              />
            ))}
          </ul>
        </div>
        <div className='smobile:flex smobile:flex-col smobile:w-full smobile:gap-[16px] laptop:gap-[23px] desktop:gap-[27px] bdesktop:gap-[32px]'>
          <h2 className='smobile:font-mundialRegular smobile:text-[20px] bdesktop:text-[24px] smobile:leading-[1]'>All Properties</h2>
          <ul className='grid w-full grid-cols-1 smobile:grid-cols-1 tablet:grid-cols-3 laptop:grid-cols-4 smobile:gap-[16px] laptop:gap-[24px] bdesktop:gap-[32px]'>
            {allProperties.map(property => (
              <div key={property.id}>
                <SearchPropertyCard
                  key={property.id}
                  data={property}
                  currency={currency}
                  isMapView={false}
                  isCommissionEnabled={isCommissionEnabled}
                />
              </div>
            ))}
            {loading && Array.from({ length: skeletonCount }).map((_, idx) => (
              <PropertyCardSkeleton key={`skeleton-${idx}`} />
            ))}
          </ul>
          <div ref={setBottomSentinel ?? undefined} className='w-full h-[1px]' />
        </div>
      </div>
    </section>
  )
}
