'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BurgerModal } from '@/components/Modals/Client/BurgerModal'
import { ClientHeader } from '@/components/Header/ClientHeader/ClientHeader'
import { Footer } from '@/components/Footer/Footer'
import { SearchFiltersModal } from '@/components/Modals/Client/SearchFiltersModal'
import { SearchResultsSection } from '@/components/DynamicMainComponents/SearchResultsSection'
import { SearchSection } from '@/components/DynamicMainComponents/SearchSection'
import { withInfiniteAllProperties } from '@/hoc/withInfiniteAllProperties'
import { getFeaturedProperties, searchPropertyByParams } from '@/app/actions'
import { useCurrencyProvider } from '@/providers/CurrencyProvider'
import { SearchSkeleton } from '@/components/Skeletons/SearchSkeleton'
import { SavedPropertySection } from '@/components/DynamicMainComponents/SavedPropertySection'
import { SEARCH_PAGE_SIZE } from '@/constants/variable'

interface Props {
  user: SessionType | null
  isSavedProperties?: boolean
}

export function DynamicSearch ({ user, isSavedProperties = false }: Props): React.ReactNode {
  const { currency, handleChangeCurrency } = useCurrencyProvider()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [featuredProperties, setFeaturedProperties] = React.useState<PropertyMain[] | null>(null)
  const [queryArray, setQueryArray] = React.useState(
    searchParams.get('q')?.split(',').map((it) => it.trim()).filter((it) => it !== '') ?? []
  )
  const [mainSearchQuery, setMainSearchQuery] = React.useState('')

  const [checkboxes, setCheckboxes] = React.useState<SearchCheckboxes>({
    Pool: searchParams.get('Pool') === 'true',
    Spa: searchParams.get('Spa') === 'true',
    Sauna: searchParams.get('Sauna') === 'true',
    RooftopTerrace: searchParams.get('RooftopTerrace') === 'true',
    Lift: searchParams.get('Lift') === 'true',
    WaterViews: searchParams.get('WaterViews') === 'true',
    Villa: searchParams.get('Villa') === 'true',
    Townhouse: searchParams.get('Townhouse') === 'true',
    Apartment: searchParams.get('Apartment') === 'true',
    House: searchParams.get('House') === 'true',
    Penthouse: searchParams.get('Penthouse') === 'true',
    Land: searchParams.get('Land') === 'true',
    PreRelease: searchParams.get('PreRelease') === 'true',
    UnderConstruction: searchParams.get('UnderConstruction') === 'true',
    Completed: searchParams.get('Completed') === 'true'
  })

  const [selects, setSelects] = React.useState<FilterParamsSelects>({
    Min: searchParams.get('Min') ?? 'Any',
    Max: searchParams.get('Max') ?? 'Any',
    Bedroom: searchParams.get('Bedroom') ?? 'Any',
    Bathroom: searchParams.get('Bathroom') ?? 'Any',
    Living: searchParams.get('Living') ?? 'Any',
    CarSpaces: searchParams.get('CarSpaces') ?? 'Any'
  })

  const [searchResultData, setSearchResultData] = React.useState<ActionSearchPropertiesByParams | null>(null)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [resultsItems, setResultsItems] = React.useState<FullProperty[] | null>(null)
  const [resultsPage, setResultsPage] = React.useState<number>(1)
  const [resultsHasMore, setResultsHasMore] = React.useState<boolean>(true)
  const [resultsLoadingMore, setResultsLoadingMore] = React.useState<boolean>(false)
  const [resultsTotal, setResultsTotal] = React.useState<number | null>(null)
  const [, setResultsPageCount] = React.useState<number | null>(null)
  const resultsObserverRef = React.useRef<IntersectionObserver | null>(null)
  const [amountOfFiltersActive, setAmountOfFiltersActive] = React.useState(0)
  const [viewType, setViewType] = React.useState(searchParams.get('viewType') ?? 'List')
  const [hasEverSearched, setHasEverSearched] = React.useState<boolean>(false)

  const addresses = React.useMemo(() => {
    const dataSource: FullProperty[] = (resultsItems ?? searchResultData?.data) ?? []
    const result = dataSource
      .map((item) => item.attributes.Address?.replace(/\n/g, ' ').replace(/\s/g, ' ').replace(/  +/g, ' ').trim() ?? '')
      .filter((item) => item !== '')

    return result ?? []
  }, [resultsItems, searchResultData])

  React.useEffect(() => {
    const activeCheckboxes = Object.values(checkboxes).filter(value => value).length
    const activeSelects = Object.values(selects).filter(value => value !== 'Any').length

    setAmountOfFiltersActive(activeCheckboxes + activeSelects)
  }, [selects, checkboxes])

  React.useEffect(() => {
    const hasSearchParams = searchParams.get('q') !== null ||
      Object.values(checkboxes).some(v => v) ||
      Object.values(selects).some(v => v !== 'Any')
    if (hasSearchParams && !hasEverSearched) {
      setHasEverSearched(true)
    }
  }, [searchParams, checkboxes, selects, hasEverSearched])

  function handleSearchChange (event: React.ChangeEvent<HTMLInputElement>): void {
    const { value } = event.target
    setMainSearchQuery(value)
  }

  const handleSearchQueryChange = React.useCallback((newQuery: string[]): void => {
    setQueryArray(newQuery)
    void updateQueryParams({
      mainQ: newQuery,
      viewType,
      ...checkboxes,
      ...selects
    })
  }, [viewType, checkboxes, selects])

  const fetchSearchResults = React.useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      const filters = {
        mainQ: queryArray,
        viewType,
        ...checkboxes,
        ...selects
      }
      const res = await searchPropertyByParams(filters, '1', SEARCH_PAGE_SIZE.toString())
      if (res !== null) {
        if (isSavedProperties) {
          res.data = res.data.filter(property => property.attributes?.Approved)
        }
        setSearchResultData(res)
        setResultsItems(res.data)
        setResultsPage(1)
        const total = (res as any)?.meta?.pagination?.total as number | undefined
        const pageCount = (res as any)?.meta?.pagination?.pageCount as number | undefined
        if (typeof total === 'number') setResultsTotal(total)
        if (typeof pageCount === 'number') setResultsPageCount(pageCount)
        setResultsHasMore(typeof pageCount === 'number' ? pageCount > 1 : res.data.length >= SEARCH_PAGE_SIZE)
        setHasEverSearched(true)
      }
    } finally {
      setLoading(false)
    }
  }, [queryArray, viewType, checkboxes, selects, isSavedProperties])

  const handleSearch = React.useCallback(async (): Promise<void> => {
    const newQueryArray = queryArray.filter(item => item !== '')

    if (mainSearchQuery !== '') {
      newQueryArray.push(mainSearchQuery)
      handleSearchValueClean()
    }

    handleSearchQueryChange(newQueryArray)
    await fetchSearchResults()
  }, [handleSearchQueryChange, queryArray, mainSearchQuery, fetchSearchResults])

  const handleSearchValueClean = React.useCallback((): void => {
    setMainSearchQuery('')
  }, [handleSearchQueryChange])

  const handleSearchFunction = (): void => {
    void handleSearch()
  }

  const handleBadgeCreateFunction = (value: string): void => {
    void handleBadgeCreate(value)
  }

  const handleBadgeCreate = React.useCallback(async (searchQ: string): Promise<void> => {
    const newArray = [...queryArray, searchQ]
    handleSearchQueryChange(newArray)
    const filters = {
      mainQ: newArray,
      viewType,
      ...checkboxes,
      ...selects
    }
    const res = await searchPropertyByParams(filters, '1', SEARCH_PAGE_SIZE.toString())
    if (res !== null) {
      if (isSavedProperties) {
        res.data = res.data.filter(property => property.attributes?.Approved)
      }
      setSearchResultData(res)
      setResultsItems(res.data)
      setResultsPage(1)
      setResultsHasMore(res.data.length >= SEARCH_PAGE_SIZE)
    }
  }, [queryArray, viewType, checkboxes, selects, handleSearchQueryChange, isSavedProperties])

  const handleBadgeRemove = React.useCallback((index: number): void => {
    handleSearchQueryChange(queryArray.filter((_, i) => i !== index))
  }, [handleSearchQueryChange, queryArray])

  function handleSelectChange (event: React.ChangeEvent<HTMLSelectElement>, name: string): void {
    const { value } = event.target
    setSelects(prev => ({
      ...prev,
      [name]: value
    }))
  }

  function handleCheckboxChange (event: React.ChangeEvent<HTMLInputElement>): void {
    const { name, checked } = event.target

    setCheckboxes(prevCheckboxes => ({
      ...prevCheckboxes,
      [name]: checked
    }))
  }

  function handleFilterClean (): void {
    const newCheckboxes: SearchCheckboxes = {
      Pool: false,
      Spa: false,
      Sauna: false,
      RooftopTerrace: false,
      Lift: false,
      WaterViews: false,
      Villa: false,
      Townhouse: false,
      Apartment: false,
      House: false,
      Penthouse: false,
      Land: false,
      PreRelease: false,
      UnderConstruction: false,
      Completed: false
    }

    const newSelects: FilterParamsSelects = {
      Min: 'Any',
      Max: 'Any',
      Bedroom: 'Any',
      Bathroom: 'Any',
      Living: 'Any',
      CarSpaces: 'Any'
    }

    setCheckboxes(newCheckboxes)
    setSelects(newSelects)
  }

  function handleSelectChangeUpdated (array: [number, number]): void {
    const minimum = array[0] === 200000 ? 'Any' : array[0].toString()
    const maximum = array[1] === 20000000 ? 'Any' : array[1].toString()

    setSelects(prev => ({
      ...prev,
      Min: minimum,
      Max: maximum
    }))
  }

  const handleViewChange = React.useCallback((newType: string): void => {
    setViewType(newType)

    void updateQueryParams({
      mainQ: queryArray,
      viewType: newType,
      ...checkboxes,
      ...selects
    })
  }, [queryArray, checkboxes, selects])

  async function updateQueryParams (filters: FilterParams): Promise<void> {
    const query = new URLSearchParams()

    if (filters.mainQ.length > 0) {
      query.set('q', filters.mainQ.join(','))
    }

    for (const [key, value] of Object.entries(filters)) {
      if (['viewType'].includes(key)) {
        continue
      }

      if (typeof value === 'boolean' && value) {
        query.set(key, value.toString())
      }

      if (typeof value === 'string' && value !== 'Any') {
        query.set(key, value)
      }
    }

    query.set('viewType', filters.viewType)

    router.push(`${isSavedProperties ? '/saved-properties' : '/search'}?${query.toString()}`, { scroll: true })
  }

  React.useEffect(() => {
    const hasSearchParams = searchParams.get('q') !== null ||
      Object.values(checkboxes).some(v => v) ||
      Object.values(selects).some(v => v !== 'Any')

    if (hasSearchParams) {
      void fetchSearchResults()
    }
  }, [fetchSearchResults])

  const loadMoreResults = React.useCallback(async () => {
    if (resultsLoadingMore || !resultsHasMore) return
    setResultsLoadingMore(true)
    try {
      const filters = {
        mainQ: queryArray,
        viewType,
        ...checkboxes,
        ...selects
      }
      const nextPage = resultsPage + 1
      const res = await searchPropertyByParams(filters, nextPage.toString(), SEARCH_PAGE_SIZE.toString())
      if (res !== null) {
        const newItems = res.data
        setResultsItems(prev => {
          const base = prev ?? []
          const existingIds = new Set(base.map(p => p.id))
          const merged = [...base, ...newItems.filter(p => !existingIds.has(p.id))]
          return merged
        })
        setResultsPage(nextPage)
        const pageCount = (res as any)?.meta?.pagination?.pageCount as number | undefined
        if (typeof pageCount === 'number') {
          setResultsPageCount(pageCount)
          setResultsHasMore(nextPage < pageCount)
        } else {
          if (newItems.length < SEARCH_PAGE_SIZE) setResultsHasMore(false)
        }
      } else {
        setResultsHasMore(false)
      }
    } finally {
      setResultsLoadingMore(false)
    }
  }, [resultsLoadingMore, resultsHasMore, queryArray, viewType, checkboxes, selects, resultsPage])

  const setResultsBottomSentinel = React.useCallback((el: HTMLDivElement | null) => {
    if (resultsObserverRef.current != null) {
      resultsObserverRef.current.disconnect()
      resultsObserverRef.current = null
    }
    if (el == null) return

    const getScrollParent = (node: Element | null): Element | null => {
      if (node == null) return null
      let current: Element | null = node.parentElement
      while (current != null) {
        const style = window.getComputedStyle(current)
        const overflowY = style.overflowY
        if (overflowY === 'auto' || overflowY === 'scroll') return current
        current = current.parentElement
      }
      return null
    }

    const rootEl = getScrollParent(el)
    const obs = new IntersectionObserver((entries) => {
      const entry = entries[0]
      if (entry.isIntersecting) {
        void loadMoreResults()
      }
    }, { root: rootEl ?? null, rootMargin: '200px', threshold: 0 })
    obs.observe(el)
    resultsObserverRef.current = obs
  }, [loadMoreResults])

  React.useEffect(() => {
    async function fetchInitial (): Promise<void> {
      const hasSearchParams = searchParams.get('q') !== null ||
        Object.values(checkboxes).some(v => v) ||
        Object.values(selects).some(v => v !== 'Any')

      if (hasSearchParams || hasEverSearched) return

      if (!isSavedProperties) {
        const featuredRes = await getFeaturedProperties()
        setFeaturedProperties(featuredRes)
      }
    }

    void fetchInitial()
  }, [searchParams, isSavedProperties, hasEverSearched, checkboxes, selects])

  return (
    <>
      <header id='header' className='sticky flex h-auto items-center bg-transparent mx-auto z-50'>
        <ClientHeader
          isSearchPage
          currency={currency}
          changeCurrency={handleChangeCurrency}
          userData={user}
        />
        <BurgerModal />
      </header>
      <main id='main'>
        {(featuredProperties === null && searchResultData === null && !isSavedProperties) && (
          <SearchSkeleton />
        )}
        {searchResultData === null && !isSavedProperties && featuredProperties !== null && (
          <SearchSectionWithInfinite
            currency={currency}
            searchValue={mainSearchQuery}
            onSearch={handleSearchFunction}
            onSearchValueChange={handleSearchChange}
            onSearchValueClean={handleSearchValueClean}
            onBadgeCreate={handleBadgeCreateFunction}
            onBadgeDelete={handleBadgeRemove}
            badgeArray={queryArray}
            featuredProperties={featuredProperties}
            amountOfFiltersActive={amountOfFiltersActive}
            userName={user?.user?.firstName ?? ''}
            isCommissionEnabled={user?.user?.showCommission ?? false}
          />
        )}
        {searchResultData === null && isSavedProperties && (
          <SavedPropertySectionWithInfinite
            currency={currency}
            searchValue={mainSearchQuery}
            onSearch={handleSearchFunction}
            onSearchValueChange={handleSearchChange}
            onSearchValueClean={handleSearchValueClean}
            onBadgeCreate={handleBadgeCreateFunction}
            onBadgeDelete={handleBadgeRemove}
            badgeArray={queryArray}
            amountOfFiltersActive={amountOfFiltersActive}
            userName={user?.user?.firstName ?? ''}
            isCommissionEnabled={user?.user?.showCommission ?? false}
          />
        )}
        {searchResultData !== null && (
          <SearchResultsSection
            currency={currency}
            searchValue={mainSearchQuery}
            onSearch={handleSearchFunction}
            onSearchValueChange={handleSearchChange}
            onSearchValueClean={handleSearchValueClean}
            onBadgeCreate={handleBadgeCreateFunction}
            onBadgeDelete={handleBadgeRemove}
            onViewChange={handleViewChange}
            viewType={viewType}
            badgeArray={queryArray}
            searchResultData={(() => {
              const sr = searchResultData
              const computed: ActionSearchPropertiesByParams = { ...sr, data: resultsItems ?? sr.data }
              return computed
            })()}
            amountOfFiltersActive={amountOfFiltersActive}
            addresses={addresses}
            isCommissionEnabled={user?.user?.showCommission ?? false}
            loading={loading || resultsLoadingMore}
            skeletonCount={SEARCH_PAGE_SIZE}
            setBottomSentinel={setResultsBottomSentinel}
            totalCount={resultsTotal ?? (searchResultData as any)?.meta?.pagination?.total}
          />
        )}
        <SearchFiltersModal
          checkboxes={checkboxes}
          selects={selects}
          onSearch={handleSearchFunction}
          onSelectChange={handleSelectChange}
          onCheckboxUpdate={handleCheckboxChange}
          onFilterClean={handleFilterClean}
          onSelectChangeUpdated={handleSelectChangeUpdated}
        />
      </main>
      <footer id='footer'>
        <Footer />
      </footer>
    </>
  )
}

const SearchSectionWithInfinite = withInfiniteAllProperties(SearchSection, { pageSize: SEARCH_PAGE_SIZE })
const SavedPropertySectionWithInfinite = withInfiniteAllProperties(SavedPropertySection, { pageSize: SEARCH_PAGE_SIZE })
