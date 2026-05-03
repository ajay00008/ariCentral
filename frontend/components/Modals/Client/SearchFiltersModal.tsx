'use client'

import * as React from 'react'
import RangeSlider from 'react-range-slider-input'
import assets from '@/assets'
import { closeModalWithAnimation, openModal } from './UnitDetailsModal'
import { useSearchFilterProvider } from '@/providers/SearchFiltersProvider'
import { SearchSelect } from '@/components/Custom/SearchPricesSelect'
import { convertPriceWithoutCurrency } from '@/constants/currencies'
import 'react-range-slider-input/dist/style.css'

interface Props {
  onCheckboxUpdate: (event: React.ChangeEvent<HTMLInputElement>) => void
  checkboxes: SearchCheckboxes
  selects: FilterParamsSelects
  onSearch: () => void
  onSelectChange: (event: React.ChangeEvent<HTMLSelectElement>, name: string) => void
  onFilterClean: () => void
  onSelectChangeUpdated: (array: [number, number]) => void
}

export function SearchFiltersModal ({ onCheckboxUpdate, checkboxes, selects, onSelectChange, onFilterClean, onSelectChangeUpdated, onSearch }: Props): React.ReactNode {
  const { closeModal, isModalOpen } = useSearchFilterProvider()
  const [rangeValues, setRangeValues] = React.useState([
    selects.Min !== 'Any' ? Number.parseInt(selects.Min, 10) : 100000,
    selects.Max !== 'Any' ? Number.parseInt(selects.Max, 10) : 20000000
  ])
  const [previousState, setPreviousState] = React.useState<{ checkboxes: SearchCheckboxes, selects: FilterParamsSelects }>({
    checkboxes: {
      Pool: checkboxes.Pool,
      Spa: checkboxes.Spa,
      Sauna: checkboxes.Sauna,
      RooftopTerrace: checkboxes.RooftopTerrace,
      Lift: checkboxes.Lift,
      WaterViews: checkboxes.WaterViews,
      Villa: checkboxes.Villa,
      Townhouse: checkboxes.Townhouse,
      Apartment: checkboxes.Apartment,
      House: checkboxes.House,
      Penthouse: checkboxes.Penthouse,
      Land: checkboxes.Land,
      PreRelease: checkboxes.PreRelease,
      UnderConstruction: checkboxes.UnderConstruction,
      Completed: checkboxes.Completed
    },
    selects: {
      Min: selects.Min,
      Max: selects.Max,
      Bedroom: selects.Bedroom,
      Bathroom: selects.Bathroom,
      Living: selects.Living,
      CarSpaces: selects.CarSpaces
    }
  })
  const [isDifferent, setIsDifferent] = React.useState(false)

  function handleRangeChange (values: [number, number]): void {
    const inputs = document.querySelectorAll('#range-slider-custom input[type="range"]')
    const minInput = inputs[0]
    const maxInput = inputs[1]

    const [min, max] = values
    const minimum = min
    const maximum = max

    if (inputs.length === 2) {
      minInput.setAttribute('max', (maximum).toString())
      maxInput.setAttribute('min', (minimum).toString())
    }

    if (min >= max - 100000) {
      maxInput.setAttribute('min', (minimum + 100000).toString())
    }

    if (max <= min + 100000) {
      minInput.setAttribute('max', (maximum - 100000).toString())
    }

    setRangeValues([minimum, maximum])
    onSelectChangeUpdated([minimum, maximum])
  }

  function handleFiltersClear (): void {
    setTimeout(() => {
      const minThumb = document.querySelector<HTMLElement>('#range-slider-custom .range-slider__thumb[data-lower]')
      const maxThumb = document.querySelector<HTMLElement>('#range-slider-custom .range-slider__thumb[data-upper]')
      setRangeValues([100000, 20000000])

      if ((minThumb !== null) && (maxThumb !== null)) {
        minThumb.style.left = 'calc(0% + 10px)'
        maxThumb.style.left = 'calc(100% - 10px)'
      }
    }, 1000)

    onFilterClean()
  }

  function handleCloseModal (): void {
    if (isDifferent) {
      closeModalWithAnimation('filtersModal')
      closeModal()
      onSearch()
    } else {
      closeModalWithAnimation('filtersModal')
      closeModal()
    }
  }

  function handleBackdropClick (e: React.MouseEvent<HTMLDivElement>): void {
    if (e.target === e.currentTarget) {
      if (isDifferent) {
        handleCloseModal()
        onSearch()
      } else handleCloseModal()
    }
  }

  function handleEscape (e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      handleCloseModal()
    }
  }

  function checkDifferences (): boolean {
    let checkboxDifferent = false
    let selectDifferent = false

    for (const key in checkboxes) {
      if (previousState.checkboxes[key as keyof SearchCheckboxes] !== checkboxes[key as keyof SearchCheckboxes]) {
        checkboxDifferent = true
        break
      }
    }

    for (const key in selects) {
      if (previousState.selects[key as keyof FilterParamsSelects] !== selects[key as keyof FilterParamsSelects]) {
        selectDifferent = true
        break
      }
    }

    if (checkboxDifferent || selectDifferent) {
      return true
    } else {
      return false
    }
  }

  React.useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('keydown', (e) => handleEscape(e))

      return () => {
        document.removeEventListener('keydown', (e) => handleEscape(e))
      }
    }
  }, [isModalOpen])

  React.useEffect(() => {
    if (isModalOpen) openModal('filtersModal')
  }, [isModalOpen])

  React.useEffect(() => {
    setPreviousState({
      checkboxes: {
        Pool: checkboxes.Pool,
        Spa: checkboxes.Spa,
        Sauna: checkboxes.Sauna,
        RooftopTerrace: checkboxes.RooftopTerrace,
        Lift: checkboxes.Lift,
        WaterViews: checkboxes.WaterViews,
        Villa: checkboxes.Villa,
        Townhouse: checkboxes.Townhouse,
        Apartment: checkboxes.Apartment,
        House: checkboxes.House,
        Penthouse: checkboxes.Penthouse,
        Land: checkboxes.Land,
        PreRelease: checkboxes.PreRelease,
        UnderConstruction: checkboxes.UnderConstruction,
        Completed: checkboxes.Completed
      },
      selects: {
        Min: selects.Min,
        Max: selects.Max,
        Bedroom: selects.Bedroom,
        Bathroom: selects.Bathroom,
        Living: selects.Living,
        CarSpaces: selects.CarSpaces
      }
    })
  }, [isModalOpen])

  React.useEffect(() => {
    setIsDifferent(checkDifferences())
  }, [checkboxes, selects])

  return (
    <div
      id='filtersModal'
      className='fixed inset-0 desktop:items-baseline justify-center z-50 bg-customBlackRGBA hidden smobile:overflow-y-auto'
      onClick={handleBackdropClick}
    >
      <div className='w-full'>
        <div className='bg-white smobile:px-[16px] smobile:py-[32px] tablet:px-[32px] tablet:py-[34px] desktop:px-[64px] desktop:py-[64px] w-full'>
          <div className='laptop:max-w-[1280px] desktop:max-w-[1440px] bdesktop:max-w-[1728px] mx-auto'>
            <div className='smobile:flex smobile:justify-between smobile:items-center smobile:pb-[34px] smobile:border-b smobile:border-[#D1D1D1]'>
              <div className='smobile:flex smobile:gap-[15px] smobile:items-center smobile:justify-center'>
                <div className='smobile:flex smobile:items-center smobile:justify-center'>
                  <assets.SearchFilterSVG width={18} height={16} className='smobile:w-[18px] smobile:h-[16px] smobile:relative' />
                </div>
                <p className='smobile:font-mundialRegular smobile:text-[20px] desktop:text-[24px] smobile:leading-[1] smobile:text-black'>
                  Filters
                </p>
              </div>
              <div className='smobile:flex smobile:gap-[25px]'>
                <button
                  type='button'
                  title='Clear all search filters'
                  onClick={() => handleFiltersClear()}
                  className='smobile:font-mundialLight smobile:text-[14px] smobile:leading-[1] smobile:underline smobile:text-black'
                >
                  Clear filters
                </button>
                <button onClick={() => handleCloseModal()} className='text-gray-600 hover:text-gray-800'>
                  <assets.CloseModalSVG width={16} height={16} className='smobile:w-[16px] smobile:h-[16px]' />
                </button>
              </div>
            </div>
            <div className='smobile:flex smobile:flex-col smobile:w-full smobile:h-full tablet:max-w-[435px] tablet:mx-auto desktop:mx-0 desktop:max-w-none desktop:flex-row desktop:justify-between desktop:mt-[52px]'>
              <div className='smobile:flex smobile:flex-col smobile:gap-[30px] smobile:mt-[32px] tablet:mt-[48px] smobile:pb-[40px] smobile:border-b smobile:border-[#D1D1D1] desktop:border-none desktop:mt-0 desktop:pb-0 desktop:min-w-[300px] bdesktop:min-w-[352px]'>
                <h2 className='smobile:font-mundialRegular smobile:text-[20px] smobile:leading-[1] smobile:text-black'>Price</h2>
                <div className='smobile:flex smobile:w-full smobile:gap-[25px] smobile:items-center'>
                  <p className='smobile:w-fit smobile:font-mundialLight smobile:text-[16px] smobile:leading-[1] smobile:min-w-[38px] smobile:text-black'>{convertPriceWithoutCurrency(rangeValues[0])}</p>
                  <div className='smobile:flex smobile:w-full'>
                    <RangeSlider
                      id='range-slider-custom'
                      min={100000}
                      max={20000000}
                      step={100000}
                      value={rangeValues}
                      onInput={handleRangeChange}
                      className='range-slider'
                      thumbsDisabled={[false, false]}
                    />
                    <style jsx global>{`
                      #range-slider-custom {
                        height: 2px;
                        background: #D1D1D1;
                      }
                      #range-slider-custom .range-slider__range {
                        background: black;
                        transition: height 0.2s;
                        height: 2px;
                      }
                      #range-slider-custom .range-slider__thumb {
                        background: black;
                        transition: transform 0.2s;
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                      }
                      #range-slider-custom .range-slider__thumb[data-active] {
                        transform: translate(-50%, -50%) scale(1.25);
                      }
                      #range-slider-custom .range-slider__range[data-active] {
                        height: 8px;
                      }
                    `}
                    </style>
                  </div>
                  <p className='smobile:w-fit smobile:font-mundialLight smobile:text-[16px] smobile:leading-[1] smobile:min-w-[32.6px] smobile:text-black'>{convertPriceWithoutCurrency(rangeValues[1])}</p>
                </div>
              </div>
              <div className='smobile:flex smobile:flex-col smobile:gap-[28px] smobile:mt-[40px] smobile:pb-[40px] smobile:border-b smobile:border-[#D1D1D1] desktop:border-none desktop:mt-0 desktop:pb-0 desktop:w-fit'>
                <h2 className='smobile:font-mundialRegular smobile:text-[20px] smobile:leading-[1] smobile:text-black'>Features</h2>
                <div className='smobile:flex smobile:flex-col smobile:gap-[12px] smobile:w-[248px]'>
                  <div className='smobile:flex smobile:justify-between smobile:items-center'>
                    <h3 className='smobile:font-mundialLight smobile:text-[16px] smobile:leading-[1] smobile:text-black'>Bedroom</h3>
                    <SearchSelect
                      variant={2}
                      text='Bedroom'
                      data={selects}
                      fieldName='Bedroom'
                      onValueChange={onSelectChange}
                      onCheckBoxChange={onCheckboxUpdate}
                      isHidden
                    />
                  </div>
                  <div className='smobile:flex smobile:justify-between smobile:items-center'>
                    <h3 className='smobile:font-mundialLight smobile:text-[16px] smobile:leading-[1] smobile:text-black'>Bathroom</h3>
                    <SearchSelect
                      variant={2}
                      text='Bathroom'
                      data={selects}
                      fieldName='Bathroom'
                      onValueChange={onSelectChange}
                      onCheckBoxChange={onCheckboxUpdate}
                      isHidden
                    />
                  </div>
                  <div className='smobile:flex smobile:justify-between smobile:items-center'>
                    <h3 className='smobile:font-mundialLight smobile:text-[16px] smobile:leading-[1] smobile:text-black'>Living</h3>
                    <SearchSelect
                      variant={2}
                      text='Living'
                      data={selects}
                      fieldName='Living'
                      onValueChange={onSelectChange}
                      onCheckBoxChange={onCheckboxUpdate}
                      isHidden
                    />
                  </div>
                  <div className='smobile:flex smobile:justify-between smobile:items-center'>
                    <h3 className='smobile:font-mundialLight smobile:text-[16px] smobile:leading-[1] smobile:text-black'>Car Spaces</h3>
                    <SearchSelect
                      variant={2}
                      text='Car Spaces'
                      data={selects}
                      fieldName='CarSpaces'
                      onValueChange={onSelectChange}
                      onCheckBoxChange={onCheckboxUpdate}
                      isHidden
                    />
                  </div>
                </div>
              </div>
              <div className='smobile:flex smobile:flex-col smobile:gap-[28px] smobile:mt-[40px] smobile:pb-[40px] smobile:border-b smobile:border-[#D1D1D1] desktop:border-none desktop:mt-0 desktop:pb-0 desktop:w-fit'>
                <h2 className='smobile:font-mundialRegular smobile:text-[20px] smobile:leading-[1] smobile:text-black'>Facilities</h2>
                <div className='smobile:flex smobile:flex-col smobile:gap-[16px] smobile:w-full'>
                  <SearchSelect
                    variant={3}
                    text='Pool'
                    data={checkboxes}
                    fieldName='Pool'
                    onValueChange={onSelectChange}
                    onCheckBoxChange={onCheckboxUpdate}
                  />
                  <SearchSelect
                    variant={3}
                    text='Spa'
                    data={checkboxes}
                    fieldName='Spa'
                    onValueChange={onSelectChange}
                    onCheckBoxChange={onCheckboxUpdate}
                  />
                  <SearchSelect
                    variant={3}
                    text='Sauna'
                    data={checkboxes}
                    fieldName='Sauna'
                    onValueChange={onSelectChange}
                    onCheckBoxChange={onCheckboxUpdate}
                  />
                  <SearchSelect
                    variant={3}
                    text='RooftopTerrace'
                    data={checkboxes}
                    fieldName='RooftopTerrace'
                    onValueChange={onSelectChange}
                    onCheckBoxChange={onCheckboxUpdate}
                  />
                  <SearchSelect
                    variant={3}
                    text='Lift'
                    data={checkboxes}
                    fieldName='Lift'
                    onValueChange={onSelectChange}
                    onCheckBoxChange={onCheckboxUpdate}
                  />
                  <SearchSelect
                    variant={3}
                    text='WaterViews'
                    data={checkboxes}
                    fieldName='WaterViews'
                    onValueChange={onSelectChange}
                    onCheckBoxChange={onCheckboxUpdate}
                  />
                </div>
              </div>
              <div className='smobile:flex smobile:flex-col smobile:gap-[28px] smobile:mt-[40px] smobile:pb-[40px] smobile:border-b smobile:border-[#D1D1D1] desktop:border-none desktop:mt-0 desktop:pb-0 desktop:w-fit'>
                <h2 className='smobile:font-mundialRegular smobile:text-[20px] smobile:leading-[1] smobile:text-black'>Type</h2>
                <div className='smobile:flex smobile:flex-col smobile:gap-[16px] smobile:w-full'>
                  <SearchSelect
                    variant={3}
                    text='Townhouse'
                    data={checkboxes}
                    fieldName='Townhouse'
                    onValueChange={onSelectChange}
                    onCheckBoxChange={onCheckboxUpdate}
                  />
                  <SearchSelect
                    variant={3}
                    text='Apartment'
                    data={checkboxes}
                    fieldName='Apartment'
                    onValueChange={onSelectChange}
                    onCheckBoxChange={onCheckboxUpdate}
                  />
                  <SearchSelect
                    variant={3}
                    text='House'
                    data={checkboxes}
                    fieldName='House'
                    onValueChange={onSelectChange}
                    onCheckBoxChange={onCheckboxUpdate}
                  />
                  <SearchSelect
                    variant={3}
                    text='Penthouse'
                    data={checkboxes}
                    fieldName='Penthouse'
                    onValueChange={onSelectChange}
                    onCheckBoxChange={onCheckboxUpdate}
                  />
                  <SearchSelect
                    variant={3}
                    text='Land'
                    data={checkboxes}
                    fieldName='Land'
                    onValueChange={onSelectChange}
                    onCheckBoxChange={onCheckboxUpdate}
                  />
                  <SearchSelect
                    variant={3}
                    text='Villa'
                    data={checkboxes}
                    fieldName='Villa'
                    onValueChange={onSelectChange}
                    onCheckBoxChange={onCheckboxUpdate}
                  />
                </div>
              </div>
              <div className='smobile:flex smobile:flex-col smobile:gap-[28px] smobile:mt-[40px] smobile:pb-[40px] smobile:border-b smobile:border-[#D1D1D1] desktop:border-none desktop:mt-0 desktop:pb-0 desktop:w-fit'>
                <h2 className='smobile:font-mundialRegular smobile:text-[20px] smobile:leading-[1] smobile:text-black'>Status</h2>
                <div className='smobile:flex smobile:flex-col smobile:gap-[16px] smobile:w-full'>
                  <SearchSelect
                    variant={3}
                    text='PreRelease'
                    data={checkboxes}
                    fieldName='PreRelease'
                    onValueChange={onSelectChange}
                    onCheckBoxChange={onCheckboxUpdate}
                  />
                  <SearchSelect
                    variant={3}
                    text='UnderConstruction'
                    data={checkboxes}
                    fieldName='UnderConstruction'
                    onValueChange={onSelectChange}
                    onCheckBoxChange={onCheckboxUpdate}
                  />
                  <SearchSelect
                    variant={3}
                    text='Completed'
                    data={checkboxes}
                    fieldName='Completed'
                    onValueChange={onSelectChange}
                    onCheckBoxChange={onCheckboxUpdate}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
