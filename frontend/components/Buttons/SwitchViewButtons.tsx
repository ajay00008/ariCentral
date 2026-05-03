'use client'

import assets from '@/assets'

interface Props {
  viewType: string
  onViewChange: (newType: string) => void
  isResults: boolean
}

export function SwitchViewButtons ({ viewType, onViewChange, isResults }: Props): React.ReactNode {
  const mapViewStyles = viewType === 'Map'
    ? 'bg-black smobile:flex smobile:items-center smobile:justify-center smobile:py-[12px] smobile:min-h-[40px] smobile:w-[50%] disabled:opacity-40'
    : 'smobile:flex smobile:items-center smobile:justify-center smobile:py-[12px] smobile:min-h-[40px] smobile:w-[50%] disabled:opacity-40 smobile:bg-white'

  const listViewStyles = viewType === 'List'
    ? 'bg-black smobile:flex smobile:items-center smobile:justify-center smobile:py-[12px] smobile:min-h-[40px] smobile:w-[50%] disabled:opacity-40'
    : 'smobile:flex smobile:items-center smobile:justify-center smobile:py-[12px] smobile:min-h-[40px] smobile:w-[50%] disabled:opacity-40 smobile:bg-white'

  const mapViewResultsStyles = viewType === 'Map'
    ? 'bg-black smobile:flex smobile:items-center smobile:justify-center smobile:py-[15px] smobile:px-[25px] smobile:w-[50%] disabled:opacity-40 smobile:font-mundialRegular smobile:text-[12px] smobile:leading-[1] smobile:text-white'
    : 'smobile:flex smobile:items-center smobile:justify-center smobile:py-[15px] smobile:px-[25px] smobile:w-[50%] disabled:opacity-40 smobile:font-mundialRegular smobile:text-[12px] smobile:leading-[1]'

  const listViewResultsStyles = viewType === 'List'
    ? 'bg-black smobile:flex smobile:items-center smobile:justify-center smobile:py-[15px] smobile:px-[28px] smobile:w-[50%] disabled:opacity-40 smobile:font-mundialRegular smobile:text-[12px] smobile:leading-[1] smobile:text-white'
    : 'smobile:flex smobile:items-center smobile:justify-center smobile:py-[15px] smobile:px-[28px] smobile:w-[50%] disabled:opacity-40 smobile:font-mundialRegular smobile:text-[12px] smobile:leading-[1]'

  return (
    <>
      <div className='smobile:fixed smobile:bottom-[16px] smobile:right-[16px] smobile:flex smobile:w-full smobile:max-w-[120px] smobile:h-full smobile:max-h-[40px] smobile:items-center smobile:justify-center smobile:z-40 smobile:rounded-[1000px] smobile:overflow-hidden smobile:border smobile:border-[#D1D1D1] laptop:hidden laptop:h-0'>
        <button
          type='button'
          title='Switch to MapView'
          onClick={() => onViewChange('Map')}
          className={mapViewStyles}
        >
          <assets.MapViewSVG width={11} height={16} style={viewType === 'Map' ? { fill: 'white' } : { fill: 'black' }} />
        </button>
        <button
          type='button'
          title='Switch to ListView'
          onClick={() => onViewChange('List')}
          className={listViewStyles}
        >
          <assets.ListViewSVG width={18} height={10} style={viewType === 'List' ? { fill: 'white' } : { fill: 'black' }} />
        </button>
      </div>
      {isResults && (
        <div className='smobile:hidden smobile:h-0 laptop:ml-auto laptop:flex laptop:h-auto smobile:w-full smobile:max-w-[216px] smobile:max-h-[40px] smobile:items-center smobile:justify-center smobile:z-40 smobile:rounded-[1000px] smobile:overflow-hidden smobile:border smobile:border-[#D1D1D1]'>
          <button
            type='button'
            title='Switch to MapView'
            onClick={() => onViewChange('Map')}
            className={mapViewResultsStyles}
          >
            Map View
          </button>
          <button
            type='button'
            title='Switch to ListView'
            onClick={() => onViewChange('List')}
            className={listViewResultsStyles}
          >
            List View
          </button>
        </div>
      )}
    </>
  )
}
