import * as React from 'react'
import { Skeleton } from '@/components/ui/skeleton'

interface Props {
  className?: string
}

export function PropertyCardSkeleton ({ className = '' }: Props): React.ReactNode {
  return (
    <li className={`smobile:relative smobile:flex smobile:flex-col smobile:w-full smobile:max-w-none tablet:w-full tablet:max-w-[335px] laptop:max-w-[384px] desktop:w-[305px] bdesktop:w-[371px] bg-white ${className}`}>
      <Skeleton className='w-full min-h-[247px]' />
      <div className='smobile:flex smobile:flex-col smobile:w-full smobile:px-[16px] tablet:px-[24px] smobile:py-[16px]'>
        <div className='smobile:w-full smobile:mb-[16px]'>
          <Skeleton className='h-5 w-3/4 mb-2' />
          <Skeleton className='h-4 w-1/2' />
        </div>
        <div className='smobile:flex smobile:flex-col smobile:gap-[8px] smobile:w-full'>
          <div className='flex justify-between items-center'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-4 w-24' />
          </div>
          <div className='flex justify-between items-center'>
            <Skeleton className='h-4 w-24' />
            <Skeleton className='h-4 w-16' />
          </div>
        </div>
        <div className='w-full mt-4'>
          <Skeleton className='h-12 w-full' />
        </div>
      </div>
    </li>
  )
}
