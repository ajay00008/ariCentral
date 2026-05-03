'use client'

import * as React from 'react'
import assets from '@/assets'
import { SearchInput } from '@/components/Custom/SearchInput'
import { SearchPropertyCard } from '@/components/Cards/SearchPropertyCard'
import { SwitchViewButtons } from '@/components/Buttons/SwitchViewButtons'
import { useSearchFilterProvider } from '@/providers/SearchFiltersProvider'
import { MapMultiple } from '@/components/Custom/GoogleMapMultiple'
import { PropertyCardSkeleton } from '@/components/Skeletons/PropertyCardSkeleton'

interface Props {
  onSearchValueChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  searchValue: string
  currency: Currency
  amountOfFiltersActive: number
  onBadgeCreate: (searchQ: string) => void
  onBadgeDelete: (index: number) => void
  badgeArray: string[]
  onSearch: () => void
  onSearchValueClean: () => void
  onViewChange: (newType: string) => void
  searchResultData: ActionSearchPropertiesByParams
  viewType: string
  addresses: string[] | null
  isCommissionEnabled: boolean
  loading?: boolean
  skeletonCount?: number
  setBottomSentinel?: (el: HTMLDivElement | null) => void
  totalCount?: number
}

export function SearchResultsSection ({
  onSearch,
  onSearchValueChange,
  searchValue,
  onSearchValueClean,
  onBadgeCreate,
  onBadgeDelete,
  onViewChange,
  badgeArray,
  searchResultData,
  currency,
  viewType,
  amountOfFiltersActive,
  isCommissionEnabled,
  addresses,
  loading = false,
  skeletonCount = 0,
  setBottomSentinel,
  totalCount
}: Props): React.ReactNode {
  const { openModal } = useSearchFilterProvider()
  const [staleBadgeArray, setStaleBadgeArray] = React.useState(badgeArray)

  const total = totalCount ?? searchResultData.data.length

  const mapViewWrapperStyles = searchResultData.data.length === 0
    ? 'smobile:hidden smobile:h-0 laptop:flex laptop:h-auto laptop:w-full laptop:px-[32px] desktop:px-[64px] laptop:py-[32px] laptop:w-full'
    : 'smobile:hidden smobile:h-0 laptop:flex laptop:h-auto laptop:w-full laptop:px-[64px] laptop:pt-[48px] laptop:w-[42%] desktop:w-[90%]'

  React.useEffect(() => {
    setStaleBadgeArray(badgeArray)
  }, [searchResultData])

  return (
    <>
      <section id='search-input' className='smobile:py-[12px] tablet:py-[20px] laptop:py-[12px] smobile:border-b smobile:border-[#D1D1D1] laptop:max-w-[1280px] desktop:max-w-[1440px] bdesktop:max-w-[1728px] mx-auto'>
        <div className='smobile:flex smobile:flex-col smobile:w-full smobile:px-[16px] tablet:px-[32px] desktop:px-[64px]'>
          <div className='laptop:flex laptop:w-full laptop:gap-[16px] laptop:items-center'>
            <SearchInput
              searchQ={searchValue}
              onSearch={onSearch}
              onSearchChange={onSearchValueChange}
              onSearchValueClean={onSearchValueClean}
              onBadgeCreate={onBadgeCreate}
              onBadgeDelete={onBadgeDelete}
              badgeArray={badgeArray}
              amountOfFiltersActive={amountOfFiltersActive}
              isSearchResults
              loading={loading}
            />
            <button
              type='button'
              title='Select filters for search parameters'
              onClick={() => openModal()}
              className='smobile:hidden smobile:h-0 smobile:gap-[10px] laptop:flex laptop:h-auto laptop:py-[12px] laptop:px-[28px] laptop:rounded-[100px] laptop:border laptop:border-[#C8C8C8] laptop:max-h-[40px]'
            >
              <div className='smobile:flex smobile:items-center smobile:justify-center smobile:cursor-pointer'>
                <assets.SearchFilterSVG width={18} height={16} className='smobile:w-[18px] smobile:h-[16px] smobile:relative' />
              </div>
              <p className='smobile:font-mundialRegular smobile:text-[16px] smobile:leading-[1] smobile:text-black'>Filters</p>
              {amountOfFiltersActive !== 0 && (
                <div className='smobile:hidden smobile:h-0 mobile:flex mobile:h-[16px] mobile:items-center mobile:justify-center mobile:w-[16px] mobile:py-[4px] mobile:px-[5px] mobile:bg-black mobile:rounded-[100px]'>
                  <p className='mobile:flex mobile:h-auto mobile:font-mundialRegular mobile:text-[10px] mobile:leading-[1] mobile:text-white'>{amountOfFiltersActive ?? 0}</p>
                </div>
              )}
            </button>
            <SwitchViewButtons viewType={viewType} onViewChange={onViewChange} isResults />
          </div>
        </div>
      </section>
      {viewType === 'List' && (
        <section id='search-list' className='smobile:py-[32px] laptop:max-w-[1280px] desktop:max-w-[1440px] bdesktop:max-w-[1728px] mx-auto'>
          <div className='smobile:flex smobile:flex-col smobile:w-full smobile:px-[16px] tablet:px-[32px] desktop:px-[64px]'>
            <div>
              {searchResultData.data.length === 0
                ? <p className='smobile:font-mundialRegular smobile:[20px] smobile:leading-[1] smobile:text-black'>No properties found.</p>
                : (
                  <div className='smobile:flex smobile:flex-col smobile:w-full smobile:gap-[32px] laptop:gap-[48px]'>
                    <p className='smobile:font-mundialRegular smobile:[20px] smobile:leading-[1] laptop:max-w-[281px] desktop:max-w-[587px] bdesktop:max-w-[715px] laptop:truncate smobile:text-black'>
                      {staleBadgeArray.length !== 0
                        ? (
                        `${total} properties found in ${staleBadgeArray.map(item => item).join(', ')}`
                          )
                        : (
                      `${total} properties found`
                          )}
                    </p>
                    <ul className='grid w-full grid-cols-1 smobile:grid-cols-1 tablet:grid-cols-3 laptop:grid-cols-4 smobile:gap-[16px] laptop:gap-[24px] bdesktop:gap-[32px]'>
                      {searchResultData.data.map(item => (
                        <div key={item.id}>
                          <SearchPropertyCard data={item} currency={currency} isMapView={false} isCommissionEnabled={isCommissionEnabled} />
                        </div>
                      ))}
                      {loading && Array.from({ length: skeletonCount }).map((_, idx) => (
                        <PropertyCardSkeleton key={`res-skeleton-${idx}`} />
                      ))}
                    </ul>
                    <div ref={setBottomSentinel ?? undefined} className='w-full h-[1px]' />
                  </div>
                  )}
            </div>
          </div>
        </section>
      )}
      {viewType === 'Map' && (
        <section id='search-map' className='laptop:max-w-[1280px] desktop:max-w-[1440px] bdesktop:max-w-[1728px] mx-auto'>
          <div className='smobile:flex smobile:w-full'>
            <div className={mapViewWrapperStyles}>
              {searchResultData.data.length === 0
                ? <p className='smobile:font-mundialRegular smobile:[20px] smobile:leading-[1] smobile:text-black'>No properties found.</p>
                : (
                  <div className='smobile:flex smobile:flex-col smobile:w-full laptop:gap-[48px]'>
                    <p className='smobile:font-mundialRegular smobile:[20px] smobile:leading-[1] laptop:max-w-[281px] desktop:max-w-[587px] bdesktop:max-w-[715px] laptop:truncate smobile:text-black'>
                      {staleBadgeArray.length !== 0
                        ? (
                        `${total} properties found in ${staleBadgeArray.map(item => item).join(', ')}`
                          )
                        : (
                      `${total} properties found`
                          )}
                    </p>
                    <ul className='flex w-full flex-wrap gap-[32px] overflow-y-scroll no-scrollbar laptop:max-h-[585px] desktop:max-h-[688px] bdesktop:max-h-[843px] overflow-hidden'>
                      {searchResultData.data.map(item => (
                        <SearchPropertyCard key={item.id} data={item} currency={currency} isMapView isCommissionEnabled={isCommissionEnabled} />
                      ))}
                      {loading && Array.from({ length: skeletonCount }).map((_, idx) => (
                        <PropertyCardSkeleton key={`map-skeleton-${idx}`} />
                      ))}
                      <div ref={setBottomSentinel ?? undefined} className='w-full h-[1px]' />
                    </ul>
                  </div>
                  )}
            </div>
            {searchResultData.data.length !== 0 && (
              <MapMultiple
                addresses={addresses}
                searchResultData={searchResultData}
                currency={currency}
              />
            )}
          </div>
        </section>
      )}
      <SwitchViewButtons viewType={viewType} onViewChange={onViewChange} isResults={false} />
    </>
  )
}
