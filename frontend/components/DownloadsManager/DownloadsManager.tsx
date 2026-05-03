'use client'

import * as React from 'react'
import { PlusIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DownloadsCard } from '../Cards/DownloadsCard'
import { generateDownload } from '@/lib/generator'

interface DownloadsManagerProps {
  disabled: boolean
  onChange: (val: StrapiSharedDownload[]) => unknown
  onLoading: (loading: boolean) => unknown
  value: StrapiSharedDownload[]
}

export function DownloadsManager ({
  disabled,
  onChange,
  onLoading,
  value
}: DownloadsManagerProps): React.ReactNode {
  function handleCreate (): void {
    onChange([
      ...value,
      generateDownload()
    ])
  }

  function handleChange (id: number, val: StrapiSharedDownload): void {
    const position = value.findIndex((it) => it.id === id)

    onChange([
      ...value.slice(0, position),
      val,
      ...value.slice(position + 1)
    ])
  }

  function handleDelete (id: number): void {
    const position = value.findIndex((it) => it.id === id)

    onChange([
      ...value.slice(0, position),
      ...value.slice(position + 1)
    ])
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex gap-6 items-center'>
        <p className='text-2xl text-black'>Downloads</p>
        <Button
          className='flex gap-2 w-fit'
          disabled={disabled}
          onClick={handleCreate}
          variant='secondary'
        >
          Download
          <PlusIcon size={16} />
        </Button>
      </div>
      {value.length !== 0 && (
        <div className='border border-zinc-200 rounded-lg p-5'>
          {value.map((download) => (
            <DownloadsCard
              key={download.id}
              disabled={disabled}
              onChange={(val) => handleChange(download.id, val)}
              onDelete={() => handleDelete(download.id)}
              onLoading={onLoading}
              value={download}
            />
          ))}
        </div>
      )}
    </div>
  )
}
