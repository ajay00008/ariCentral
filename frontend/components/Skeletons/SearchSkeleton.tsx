'use client'

import { Skeleton } from '../ui/skeleton'

export function SearchSkeleton (): React.ReactNode {
  return (
    <div className='flex p-5 items-center justify-center w-full'>
      <div className='flex flex-wrap gap-5 justify-center'>
        <div className='flex flex-col gap-3'>
          <Skeleton className='h-[200px] w-[300px]' />
          <div className='grid gap-2'>
            <Skeleton className='h-4 w-[300px]' />
            <Skeleton className='h-4 w-[250px]' />
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <Skeleton className='h-[200px] w-[300px]' />
          <div className='grid gap-2'>
            <Skeleton className='h-4 w-[300px]' />
            <Skeleton className='h-4 w-[250px]' />
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <Skeleton className='h-[200px] w-[300px]' />
          <div className='grid gap-2'>
            <Skeleton className='h-4 w-[300px]' />
            <Skeleton className='h-4 w-[250px]' />
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <Skeleton className='h-[200px] w-[300px]' />
          <div className='grid gap-2'>
            <Skeleton className='h-4 w-[300px]' />
            <Skeleton className='h-4 w-[250px]' />
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <Skeleton className='h-[200px] w-[300px]' />
          <div className='grid gap-2'>
            <Skeleton className='h-4 w-[300px]' />
            <Skeleton className='h-4 w-[250px]' />
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <Skeleton className='h-[200px] w-[300px]' />
          <div className='grid gap-2'>
            <Skeleton className='h-4 w-[300px]' />
            <Skeleton className='h-4 w-[250px]' />
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <Skeleton className='h-[200px] w-[300px]' />
          <div className='grid gap-2'>
            <Skeleton className='h-4 w-[300px]' />
            <Skeleton className='h-4 w-[250px]' />
          </div>
        </div>
        <div className='flex flex-col gap-3'>
          <Skeleton className='h-[200px] w-[300px]' />
          <div className='grid gap-2'>
            <Skeleton className='h-4 w-[300px]' />
            <Skeleton className='h-4 w-[250px]' />
          </div>
        </div>

      </div>
    </div>
  )
}
