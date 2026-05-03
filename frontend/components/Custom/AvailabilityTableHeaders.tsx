'use client'

interface Props {
  shouldHide: ShouldHide
}

interface ShouldHide {
  powder: boolean
  cars: boolean
}

export function AvailabilityTableHeaders ({ shouldHide }: Props): React.ReactNode {
  return (
    <div className='flex'>
      <div className='flex items-center justify-center flex-1 text-center max-w-[100px] laptop:text-[12px] laptop:leading-[1] bdesktop:text-[16px] font-mundialLight'>Unit</div>
      <div className='flex items-center justify-center flex-1 text-center max-w-[120px] laptop:text-[12px] laptop:leading-[1] bdesktop:text-[16px] font-mundialLight'>Status</div>
      <div className='flex items-center justify-center flex-1 min-w-[110px] text-center laptop:text-[12px] laptop:leading-[1] bdesktop:text-[16px] font-mundialLight'>Price</div>
      <div className='flex items-center justify-center flex-1 text-center laptop:text-[12px] laptop:leading-[1] bdesktop:text-[16px] font-mundialLight'>Size</div>
      <div className='flex items-center justify-center flex-1 text-center max-w-[120px] laptop:text-[12px] laptop:leading-[1] bdesktop:text-[16px] font-mundialLight'>Bed</div>
      <div className='flex items-center justify-center flex-1 text-center smobile:max-w-[50px] bdesktop:max-w-[80px] laptop:text-[12px] laptop:leading-[1] bdesktop:text-[16px] font-mundialLight'>Bath</div>
      {!shouldHide.powder && <div className='flex flex-1 text-center justify-center smobile:max-w-[50px] bdesktop:max-w-[80px] laptop:text-[12px] laptop:leading-[1] bdesktop:text-[16px] font-mundialLight'>Powder</div>}
      <div className='flex items-center justify-center flex-1 text-center smobile:max-w-[50px] bdesktop:max-w-[80px] laptop:text-[12px] laptop:leading-[1] bdesktop:text-[16px] font-mundialLight'>Living</div>
      {!shouldHide.cars && <div className='flex-1 text-center smobile:max-w-[50px] bdesktop:max-w-[80px] laptop:text-[12px] laptop:leading-[1] bdesktop:text-[16px] font-mundialLight'>Car</div>}
      <div className='flex items-center justify-center flex-1 text-center smobile:max-w-[50px] bdesktop:max-w-[80px] laptop:text-[12px] laptop:leading-[1] bdesktop:text-[16px] font-mundialLight'>Level</div>
      <div className='flex items-center justify-center flex-1 text-center bdesktop:max-w-[100px] laptop:text-[12px] laptop:leading-[1] bdesktop:text-[16px] font-mundialLight'>Orientation</div>
      <div className='flex items-center justify-center flex-1 text-center laptop:text-[12px] laptop:leading-[1] bdesktop:text-[16px] font-mundialLight'>Rent App</div>
      <div className='flex items-center justify-center flex-1 text-center laptop:text-[12px] laptop:leading-[1] bdesktop:text-[16px] font-mundialLight'>Body Corp</div>
      <div className='flex items-center justify-center flex-1 text-center laptop:text-[12px] laptop:leading-[1] bdesktop:text-[16px] font-mundialLight'>Rates</div>
    </div>
  )
}
