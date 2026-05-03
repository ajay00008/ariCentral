'use client'

import * as React from 'react'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { FloorCard } from '@/components/Cards/FloorCard'
import { SetUnitsPositionModal } from '@/components/Modals/SetUnitsPositionModal'
import { generateFloor } from '@/lib/generator'

interface FloorsManagerProps {
  data: StrapiPropertyProperty
  disabled: boolean
  onChange: (val: StrapiFloorFloor[]) => unknown
  onLoading: (loading: boolean) => unknown
}

export function FloorsManager ({ data, disabled, onChange, onLoading }: FloorsManagerProps): React.ReactNode {
  const items = data.attributes.floors.data

  function handleCreate (): void {
    onChange([
      ...items,
      generateFloor()
    ])
  }

  function handleChange<T extends keyof StrapiFloorFloor['attributes']> (
    id: number,
    name: T,
    val: StrapiFloorFloor['attributes'][T]
  ): void {
    const position = items.findIndex((floor) => floor.id === id)

    onChange([
      ...items.slice(0, position),
      {
        ...items[position],
        attributes: {
          ...items[position].attributes,
          [name]: val
        }
      },
      ...items.slice(position + 1)
    ])
  }

  function handleDelete (id: number): void {
    onChange(items.filter((floor) => floor.id !== id))
  }

  React.useEffect(() => {
    const unitsTables = document.querySelectorAll('.admin-property-units-table')
    const unitsTablesParents: HTMLElement[] = []

    unitsTables.forEach((unitsTable) => {
      if (unitsTable.parentElement !== null) {
        unitsTablesParents.push(unitsTable.parentElement)
      }
    })

    function handleSyncScroll (this: HTMLElement): void {
      unitsTablesParents.forEach((unitsTableParent) => {
        unitsTableParent.scrollLeft = this.scrollLeft
      })
    }

    unitsTablesParents.forEach((unitsTableParent) => {
      unitsTableParent.addEventListener('scroll', handleSyncScroll)
    })

    return () => {
      unitsTablesParents.forEach((unitsTableParent) => {
        unitsTableParent.removeEventListener('scroll', handleSyncScroll)
      })
    }
  }, [])

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex gap-6 items-center'>
        <p className='text-2xl text-black'>Floors</p>
        <Button
          className='flex gap-2 w-fit'
          disabled={disabled}
          onClick={handleCreate}
          variant='secondary'
        >
          Floor
          <PlusIcon className='h-4 w-4' />
        </Button>
        <SetUnitsPositionModal
          data={data}
          disabled={disabled}
          onChange={onChange}
        />
      </div>
      <div className='flex flex-col gap-4'>
        {items.map((floor) => (
          <FloorCard
            key={floor.id}
            disabled={disabled}
            onChange={(name, val) => handleChange(floor.id, name, val)}
            onDelete={() => handleDelete(floor.id)}
            onLoading={onLoading}
            value={floor}
          />
        ))}
      </div>
    </div>
  )
}
