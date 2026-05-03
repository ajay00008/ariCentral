'use client'

import * as React from 'react'
import { CircleXIcon, TrashIcon } from 'lucide-react'
import Image from 'next/image'
import { Reorder } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ImageFrame } from '@/components/Custom/ImageFrame'
import { Input } from '@/components/ui/input'
import { Label } from '../ui/label'
import { uploadAssets } from '@/app/actions'
import { useAlertProvider } from '@/providers/AlertProvider'

interface GalleryCardProps {
  disabled: boolean
  onChange: (val: StrapiSharedSubGallery) => unknown
  onDelete: () => unknown
  onLoading: (loading: boolean) => unknown
  value: StrapiSharedSubGallery
}

export function GalleryCard ({ disabled, onChange, onDelete, onLoading, value }: GalleryCardProps): React.ReactNode {
  const { setAlertMessage } = useAlertProvider()
  async function handleCreate (files: FileList): Promise<void> {
    const maxSize = 10 * 1024 * 1024

    for (let i = 0; i < files.length; i++) {
      if (files[i].size > maxSize) {
        setAlertMessage(`Image ${files[i].name} exceeds the maximum size of 10MB.`, false)
        return
      }
    }

    if ((value.Media.data?.length ?? 0) + files.length > 20) {
      setAlertMessage('You can only add up to 20 images per section.', false)
      return
    }

    onLoading(true)
    const assets = await uploadAssets(files)
    onLoading(false)

    const items = value.Media.data ?? []

    onChange({
      ...value,
      Media: {
        ...value.Media,
        data: [
          ...items,
          ...assets
        ]
      }
    })
  }

  function handleChange<T extends keyof StrapiSharedSubGallery> (
    name: T,
    val: StrapiSharedSubGallery[T]
  ): void {
    onChange({ ...value, [name]: val })
  }

  function handleDelete (id: number): void {
    const items = value.Media.data ?? []
    const position = items.findIndex((item) => item.id === id)

    onChange({
      ...value,
      Media: {
        ...value.Media,
        data: [
          ...items.slice(0, position),
          ...items.slice(position + 1)
        ]
      }
    })
  }

  function handleReorder (val: StrapiMedia[]): void {
    onChange({
      ...value,
      Media: {
        ...value.Media,
        data: val
      }
    })
  }

  const items = value.Media.data ?? []

  return (
    <div className='flex flex-col gap-6 first:border-0 border-t border-zinc-200 py-5 first:pt-0 last:pb-0'>
      <div className='flex justify-between'>
        <div className='flex gap-6'>
          <div className='flex flex-col gap-2'>
            <Label className='text-sm/none font-medium text-black'>Section Name</Label>
            <div className='flex gap-3'>
              <div className='grid gap-2'>
                <Input
                  className='disabled:cursor-not-allowed'
                  disabled={disabled}
                  name='name'
                  onChange={(e) => handleChange('Name', e.target.value)}
                  placeholder='Enter section name'
                  required
                  type='text'
                  value={value.Name}
                />
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <Label className='text-sm/none font-medium text-black'>Add Section Images</Label>
            <Input
              accept='image/*'
              className='w-full disabled:cursor-not-allowed'
              disabled={disabled}
              id='image'
              multiple
              name='image'
              onChange={(e) => {
                if (e.target.files !== null) {
                  void handleCreate(e.target.files)
                }
              }}
              required
              type='file'
              title='Upload images (max 20 images, 10MB each)'
            />
            <p className='text-sm text-gray-500'>Maximum of 20 images per section, each image should not exceed 10MB.</p>
          </div>
        </div>
        <Button
          disabled={disabled}
          onClick={() => onDelete()}
          size='icon'
          variant='destructive'
        >
          <TrashIcon size={20} />
        </Button>
      </div>
      {items.length > 0 && (
        <div className='flex flex-col gap-2'>
          <p className='text-sm/none font-medium text-black'>Section Preview</p>
          <div className='w-full overflow-x-scroll'>
            <Reorder.Group
              axis='x'
              className='flex gap-6'
              onReorder={handleReorder}
              values={items}
            >
              {items.map((image) => (
                <Reorder.Item key={image.id} dragListener={!disabled} value={image}>
                  <div className='relative'>
                    <ImageFrame>
                      <Image
                        alt='Uploaded image'
                        className='select-none pointer-events-none border border-zinc-200 rounded-md object-cover'
                        fill
                        sizes='250px'
                        src={image.attributes.url}
                      />
                    </ImageFrame>
                    <Button
                      className='absolute rounded-full top-1 right-1 bg-[#FFF] enabled:hover:bg-[#FFF] p-0 h-auto disabled:cursor-not-allowed text-[#FF0000]'
                      disabled={disabled}
                      onClick={() => handleDelete(image.id)}
                    >
                      <CircleXIcon size={20} />
                    </Button>
                  </div>
                </Reorder.Item>
              ))}
            </Reorder.Group>
          </div>
        </div>
      )}
    </div>
  )
}
