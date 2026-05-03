'use client'

import * as React from 'react'
import { XIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CreatePropertyListItemModal } from '@/components/Modals/CreatePropertyListItemModal'
import { generateListItem } from '@/lib/generator'

interface PropertyTextListProps {
  disabled: boolean
  label: string
  onChange: (val: StrapiSharedList) => unknown
  value: StrapiSharedList
}

export function PropertyTextList ({
  disabled,
  label,
  onChange,
  value
}: PropertyTextListProps): React.ReactNode {
  function handleCreate (val: string): void {
    onChange({
      ...value,
      Items: [
        ...(value.Items ?? []),
        generateListItem(val)
      ]
    })
  }

  function handleDelete (id: number): void {
    onChange({
      ...value,
      Items: [
        ...(value.Items ?? [])
          .filter((item) => item.id !== id)
          .map((item) => ({ ...item }))
      ]
    })
  }

  return (
    <div className='flex flex-col gap-2'>
      <p className='text-sm/none font-medium text-black'>{label}</p>
      <ul className='flex flex-col gap-2 border border-zinc-200 rounded-[8px] py-2 px-3'>
        {value.Items?.map((item) => (
          <li className='flex items-center justify-between gap-2' key={item.id}>
            <p className='text-sm text-black'>{item.Item}</p>
            <Button
              className='h-6 w-6'
              disabled={disabled}
              onClick={() => handleDelete(item.id)}
              size='icon'
              type='button'
              variant='destructive'
            >
              <XIcon size={16} />
            </Button>
          </li>
        ))}
        <CreatePropertyListItemModal
          disabled={disabled}
          onCreate={handleCreate}
        />
      </ul>
    </div>
  )
}
