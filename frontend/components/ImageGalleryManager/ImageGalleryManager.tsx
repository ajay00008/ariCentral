'use client'

import * as React from 'react'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { GalleryCard } from '@/components/Cards/GalleryCard'
import { generateSubGallery } from '@/lib/generator'
import { useAlertProvider } from '@/providers/AlertProvider'

interface ImageGalleryManagerProps {
  disabled: boolean
  label: string
  onChange: (val: StrapiSharedGallery) => unknown
  onLoading: (loading: boolean) => unknown
  value: StrapiSharedGallery
}

export function ImageGalleryManager ({
  disabled,
  label,
  onChange,
  onLoading,
  value
}: ImageGalleryManagerProps): React.ReactNode {
  const { setAlertMessage } = useAlertProvider()
  function handleCreate (): void {
    if (value.SubGallery.length >= 7) {
      setAlertMessage('You can only add up to 7 sections.', false)
      return
    }

    onChange({
      ...value,
      SubGallery: [
        ...value.SubGallery,
        generateSubGallery()
      ]
    })
  }

  function handleChange (id: number, val: StrapiSharedSubGallery): void {
    const position = value.SubGallery.findIndex((subGallery) => subGallery.id === id)

    onChange({
      ...value,
      SubGallery: [
        ...value.SubGallery.slice(0, position),
        val,
        ...value.SubGallery.slice(position + 1)
      ]
    })
  }

  function handleDelete (id: number): void {
    const position = value.SubGallery.findIndex((subGallery) => subGallery.id === id)

    onChange({
      ...value,
      SubGallery: [
        ...value.SubGallery.slice(0, position),
        ...value.SubGallery.slice(position + 1)
      ]
    })
  }

  return (
    <div className='flex flex-col'>
      <div className='flex gap-2 flex-col'>
        <div className='flex gap-6 items-center'>
          <p className='text-2xl text-black'>{label}</p>
          <Button
            className='flex gap-2 rounded-md'
            disabled={disabled}
            onClick={handleCreate}
            variant='secondary'
          >
            Section
            <PlusIcon className='mr-2 h-4 w-4' />
          </Button>
        </div>
        {value.SubGallery.length > 0 && (
          <div className='border border-zinc-200 rounded-lg p-5'>
            {value.SubGallery.map((subGallery) => (
              <GalleryCard
                key={subGallery.id}
                disabled={disabled}
                onChange={(val) => handleChange(subGallery.id, val)}
                onDelete={() => handleDelete(subGallery.id)}
                onLoading={onLoading}
                value={subGallery}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
