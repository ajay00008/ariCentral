'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'

const populateAmount = Array.from({ length: 10 }, (_, index) => index + 1)

interface PopulateProps {
  disabled: boolean
  onPopulate: (floors: number, units: number) => unknown
}

export function Populate ({ disabled, onPopulate }: PopulateProps): React.ReactNode {
  const [floors, setFloors] = React.useState(1)
  const [units, setUnits] = React.useState(1)

  function handleFloorsChange (amount: string): void {
    setFloors(Number.parseInt(amount, 10))
  }

  function handleUnitsChange (amount: string): void {
    setUnits(Number.parseInt(amount, 10))
  }

  function handlePopulate (): void {
    onPopulate(floors, units)
  }

  return (
    <div className='flex flex-col gap-2 bg-gray-600 p-3 rounded-xl'>
      <h3 className='text-xl text-white'>Populate Widget</h3>
      <div className='flex gap-4 items-center'>
        <div className='flex flex-col gap-[5px]'>
          <p className='text-white'>Floors</p>
          <Select disabled={disabled} onValueChange={handleFloorsChange}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Floors' />
            </SelectTrigger>
            <SelectContent>
              {populateAmount.map(item => (
                <SelectItem key={item} value={item.toString()}>{item}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex flex-col gap-[5px]'>
          <p className='text-white'>Units</p>
          <Select disabled={disabled} onValueChange={handleUnitsChange}>
            <SelectTrigger className='w-[180px]'>
              <SelectValue placeholder='Units' />
            </SelectTrigger>
            <SelectContent>
              {populateAmount.map(item => (
                <SelectItem key={item} value={item.toString()}>{item}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className='mt-auto mb-0' disabled={disabled} onClick={handlePopulate}>
          Populate
        </Button>
      </div>
    </div>
  )
}
