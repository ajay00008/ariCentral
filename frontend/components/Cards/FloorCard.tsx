'use client'

import * as React from 'react'
import { PlusIcon, TrashIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { UnitsList } from '@/components/Lists/UnitsList'
import { generateUnit } from '@/lib/generator'

interface FloorCardProps {
  disabled: boolean
  onChange: <T extends keyof StrapiFloorFloor['attributes']> (name: T, val: StrapiFloorFloor['attributes'][T]) => unknown
  onDelete: () => unknown
  onLoading: (loading: boolean) => unknown
  value: StrapiFloorFloor
}

export function FloorCard ({
  disabled,
  onChange,
  onDelete,
  onLoading,
  value
}: FloorCardProps): React.ReactNode {
  function handleCreateUnit (): void {
    onChange('units', {
      ...value.attributes.units,
      data: [
        ...value.attributes.units.data,
        generateUnit((value.attributes.units.data[0]?.attributes.order ?? 0) + 1)
      ]
    })
  }

  function handleChangeUnits (val: StrapiUnitUnit[]): void {
    onChange('units', {
      ...value.attributes.units,
      data: val
    })
  }

  return (
    <div className='flex flex-col gap-6'>
      <div className='flex justify-between'>
        <div className='flex flex-col gap-1'>
          <Label className='text-sm'>Floor</Label>
          <div className='flex gap-2'>
            <Input
              className='w-fit'
              disabled={disabled}
              onChange={(e) => onChange('identifier', e.target.value)}
              placeholder='Enter floor id'
              type='text'
              value={value.attributes.identifier}
            />
            <Button
              className='w-fit text-black gap-2'
              disabled={disabled}
              onClick={handleCreateUnit}
              variant='secondary'
            >
              Unit
              <PlusIcon size={16} />
            </Button>
          </div>
        </div>
        <Button
          disabled={disabled}
          onClick={onDelete}
          size='icon'
          variant='destructive'
        >
          <TrashIcon size={20} />
        </Button>
      </div>
      <UnitsList
        data={value.attributes.units.data}
        disabled={disabled}
        onChange={handleChangeUnits}
        onLoading={onLoading}
      />
    </div>
  )
}
