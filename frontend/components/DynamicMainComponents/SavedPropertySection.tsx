'use client'

import * as React from 'react'
import { SearchInput } from '@/components/Custom/SearchInput'
import { ShowFirstName } from '@/components/Custom/ShowFirstName'
import { SearchPropertyCard } from '../Cards/SearchPropertyCard'
import Link from 'next/link'

interface Props {
  currency: Currency
  amountOfFiltersActive: number
  allProperties: FullProperty[]
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

export function SavedPropertySection ({
  currency,
  allProperties,
  isCommissionEnabled,
  userName,
  amountOfFiltersActive,
  searchValue,
  onSearch,
  onSearchValueChange,
  onSearchValueClean,
  onBadgeCreate,
  onBadgeDelete,
  badgeArray,
  loading,
  skeletonCount,
  setBottomSentinel
}: Props): React.ReactNode {
  const visibleProperties = React.useMemo(
    () => allProperties.filter(p => p.attributes?.Approved),
    [allProperties]
  )
  return (
    <section
      id='search'
      className='smobile:pt-[64px] mobile:pt-[84px] laptop:pt-[98px] bdesktop:pt-[112px] smobile:pb-[80px] smobile:mx-auto laptop:max-w-[1280px] desktop:max-w-[1440px] bdesktop:max-w-[1728px]'
    >
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
            />
          </div>
        </div>
        <div className='smobile:flex smobile:flex-col smobile:w-full smobile:gap-[16px] laptop:gap-[23px] desktop:gap-[27px] bdesktop:gap-[32px]'>
          <h2 className='smobile:font-mundialRegular smobile:text-[20px] bdesktop:text-[24px] smobile:leading-[1]'>
            Saved Properties
          </h2>
          {visibleProperties.length === 0 && loading !== true && (
            <div className='flex flex-col items-center justify-center gap-7'>
              <p className='smobile:font-mundialRegular text-center smobile:[20px] smobile:leading-[1] smobile:text-black'>
                You haven't saved any properties yet. Start exploring and save
                the ones you like!
              </p>
              <div className='flex justify-center w-full'>
                <Link
                  href='/search'
                  aria-label='Check all properties link'
                  title='See all properties'
                  className='smobile:w-full smobile:h-auto smobile:min-h-[48px] smobile:mx-auto smobile:bg-orange smobile:font-mundialRegular disabled:opacity-100 smobile:text-customWhite smobile:font-normal smobile:text-[14px] disabled:bg-grey disabled:text-nativeBlack smobile:leading-[1] rounded-none p-1 max-w-[300px] w-full flex justify-center items-center smobile:gap-[8px] smobile:py-[12px] smobile:px-[16px] smobile:rounded-[100px] smobile:cursor-pointer'
                >
                  Explore Properties
                </Link>
              </div>
            </div>
          )}
          <ul className='w-full grid grid-cols-1 smobile:grid-cols-1 mobile:grid-cols-2 tablet:grid-cols-3 laptop:grid-cols-4 smobile:gap-[16px] laptop:gap-[24px] bdesktop:gap-[32px] items-stretch'>
            {visibleProperties.map((property) => (
              <li className='h-full flex' key={property.id}>
                <SearchPropertyCard
                  data={property}
                  currency={currency}
                  isMapView={false}
                  isCommissionEnabled={isCommissionEnabled}
                />
              </li>
            ))}
          </ul>
          {loading === true && (skeletonCount ?? 0) > 0 && (
            <div className='w-full text-center py-4 text-sm text-gray-500'>Loading…</div>
          )}
          <div ref={setBottomSentinel ?? undefined} />
        </div>
      </div>
    </section>
  )
}
