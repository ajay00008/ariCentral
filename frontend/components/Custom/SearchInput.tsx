'use client'

import assets from '@/assets'
import { useSearchFilterProvider } from '@/providers/SearchFiltersProvider'
import { useMediaQuery } from 'react-responsive'

interface Props {
  searchQ: string
  amountOfFiltersActive: number
  onSearch: () => void
  onSearchChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onSearchValueClean: () => void
  onBadgeCreate: (searchQ: string) => void
  onBadgeDelete: (index: number) => void
  badgeArray: string[]
  isSearchResults: boolean
  loading?: boolean
}

export function SearchInput ({
  searchQ,
  badgeArray,
  amountOfFiltersActive,
  isSearchResults,
  onSearch,
  onSearchChange,
  onSearchValueClean,
  onBadgeCreate,
  onBadgeDelete,
  loading = false
}: Props): React.ReactNode {
  const isTabletScreen = useMediaQuery({ query: '(min-width:  768px)' })
  const { openModal } = useSearchFilterProvider()
  const wrapperStyles = isSearchResults
    ? 'smobile:relative smobile:w-full laptop:max-w-[475px]'
    : 'smobile:relative smobile:w-full'
  const inputWrapper = isSearchResults
    ? 'smobile:relative smobile:w-full smobile:flex smobile:items-center smobile:max-h-[56px] smobile:rounded-[100px] smobile:pt-[17px] smobile:pr-[8px] smobile:pb-[15px] smobile:pl-[24px] laptop:pl-[8px] smobile:bg-white smobile:cursor-text'
    : 'smobile:relative smobile:w-full smobile:flex smobile:items-center smobile:rounded-[100px] smobile:pt-[17px] smobile:pr-[8px] smobile:pb-[15px] smobile:pl-[24px] laptop:h-[64px] bdesktop:h-[72px] smobile:bg-white smobile:cursor-text'
  const badgeWrapper = isSearchResults
    ? 'smobile:flex smobile:items-center smobile:space-x-2'
    : 'smobile:flex smobile:pl-[40px] smobile:items-center smobile:space-x-2'
  const inputStyles = isSearchResults
    ? 'smobile:w-full smobile:pl-[16px] mobile:pl-[24px] smobile:pr-[95px] mobile:pr-[150px] laptop:pr-[60px] laptop:mr-[40px] smobile:outline-none smobile:bg-white smobile:h-[23px] smobile:font-mundialLight smobile:text-[20px] smobile:leading-[1]'
    : 'smobile:w-full smobile:pr-[95px] mobile:pr-[150px] laptop:pr-[330px] laptop:pl-[50px] smobile:outline-none smobile:bg-white smobile:h-[23px] smobile:font-mundialLight smobile:text-[20px] smobile:leading-[1]'
  const searchButtonStyles = isSearchResults
    ? 'smobile:flex smobile:items-center smobile:justify-center smobile:rounded-[100px] smobile:p-[12px] smobile:bg-orange smobile:cursor-pointer'
    : 'smobile:flex smobile:items-center smobile:justify-center smobile:rounded-[100px] smobile:p-[12px] smobile:bg-orange smobile:cursor-pointer laptop:hidden laptop:h-0'
  const filterButtonWithTextStyles = isSearchResults
    ? 'smobile:hidden smobile:h-0 smobile:gap-[10px] mobile:flex mobile:h-auto laptop:hidden laptop:h-0'
    : 'smobile:hidden smobile:h-0 smobile:gap-[10px] mobile:flex mobile:h-auto laptop:py-[12px] laptop:px-[28px] laptop:rounded-[100px] laptop:border laptop:border-[#C8C8C8] laptop:max-h-[40px]'

  function handleKeyDown (event: React.KeyboardEvent<HTMLInputElement>): void {
    if (event.key === 'Enter') {
      event.preventDefault()
      const trimmedValue = searchQ.trim()
      if (trimmedValue !== '') {
        onBadgeCreate(trimmedValue)
        onSearchValueClean()
      }
    } else if (event.key === ',') {
      event.preventDefault()
      const trimmedValue = searchQ.trim()
      if (trimmedValue !== '') {
        onBadgeCreate(trimmedValue)
        onSearchValueClean()
      }
    }
    if (event.key === 'Backspace' && searchQ === '') {
      if (badgeArray.length > 0) {
        onBadgeDelete(badgeArray.length - 1)
      }
    }
  }

  return (
    <div className={wrapperStyles}>
      <div
        className={inputWrapper}
        onClick={() => document.getElementById('search-input')?.focus()}
      >
        {badgeArray.length !== 0 && (
          <div className={badgeWrapper}>
            {badgeArray.map((query, index) => (
              <div key={index} className='smobile:flex smobile:items-center smobile:bg-highGrey smobile:p-4 smobile:rounded-3xl smobile:w-fit smobile:h-[40px] smobile:gap-[13px] smobile:max-w-[143px]'>
                <p className='smobile:font-mundialRegular smobile:text-[16px] smobile:leading-[1] smobile:text-black smobile:mr-[20px] smobile:text-nowrap smobile:text-ellipsis smobile:overflow-hidden'>{query}</p>
                <assets.BadgeCloseButtonSVG width={10} height={10} className='smobile:w-[10px] smobile:h-[10px] smobile:cursor-pointer flex flex-shrink-0' onClick={() => onBadgeDelete(index)} />
              </div>
            ))}
          </div>
        )}
        <input
          id='search-input'
          value={searchQ ?? ''}
          onChange={(e) => onSearchChange(e)}
          onKeyDown={handleKeyDown}
          type='text'
          placeholder={loading ? 'Loading...' : (isTabletScreen ? 'Search suburb, postcode or state' : 'Search locations')}
          className={inputStyles}
          style={badgeArray.length !== 0 ? { marginLeft: '10px', paddingLeft: 0 } : {}}
          disabled={loading}
        />
      </div>
      {!isSearchResults && (
        <div className='smobile:hidden smobile:h-0 laptop:h-auto laptop:flex laptop:items-center laptop:justify-center laptop:absolute laptop:top-1/2 laptop:transform laptop:-translate-y-1/2 laptop:left-[24px]'>
          <assets.IconSearchSVG width={20} height={20} className='smobile:w-[20px] smobile:h-[20px] bdesktop:w-[24px] bdesktop:h-[24px] smobile:relative' style={{ fill: 'black' }} />
        </div>
      )}
      <div className='smobile:flex smobile:gap-[24px] laptop:gap-[8px] smobile:items-center smobile:justify-center smobile:absolute smobile:top-1/2 smobile:transform smobile:-translate-y-1/2 smobile:right-[8px]'>
        <button
          type='button'
          title='Select filters for search paramaters'
          onClick={() => openModal()}
          className='smobile:flex smobile:gap-[10px] mobile:hidden mobile:h-0'
        >
          <div className='smobile:flex smobile:items-center smobile:justify-center smobile:cursor-pointer'>
            <assets.SearchFilterSVG width={18} height={16} className='smobile:w-[18px] smobile:h-[16px] smobile:relative' />
          </div>
        </button>
        <button
          type='button'
          title='Select filters for search paramaters'
          onClick={() => openModal()}
          className={filterButtonWithTextStyles}
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
        <button
          type='button'
          title='Search properties'
          onClick={onSearch}
          className={searchButtonStyles}
        >
          <assets.IconSearchSVG width={16} height={16} className='smobile:w-[16px] smobile:h-[16px] smobile:relative' style={{ fill: 'white' }} />
        </button>
        {!isSearchResults && (
          <button
            type='button'
            title='Search properties'
            onClick={onSearch}
            className='smobile:hidden smobile:h-0 smobile:items-center smobile:justify-center smobile:rounded-[100px] smobile:pt-[16px] smobile:px-[48px] smobile:pb-[12px] laptop:flex laptop:h-auto laptop:py-[14px] bdesktop:py-[18px] smobile:bg-orange smobile:cursor-pointer'
          >
            <p className='laptop:font-mundialRegular laptop:text-[20px] laptop:leading-[1] laptop:text-white'>Search</p>
          </button>
        )}
      </div>
    </div>
  )
}
