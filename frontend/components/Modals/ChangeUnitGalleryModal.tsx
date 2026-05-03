'use client'

import * as React from 'react'
import { CircleXIcon } from 'lucide-react'
import Image from 'next/image'
import { Reorder } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { ImageFrame } from '@/components/Custom/ImageFrame'
import { Input } from '@/components/ui/input'
import { Label } from '../ui/label'
import { uploadAssets } from '@/app/actions'
import { useAlertProvider } from '@/providers/AlertProvider'

interface ChangeUnitGalleryModalProps {
  disabled: boolean
  onChange: (val: StrapiMedia[]) => unknown
  onLoading: (loading: boolean) => unknown
  value: StrapiMedia[]
}

export function ChangeUnitGalleryModal ({
  disabled,
  onChange,
  onLoading,
  value
}: ChangeUnitGalleryModalProps): React.ReactNode {
  const { setAlertMessage } = useAlertProvider()
  async function handleCreate (files: FileList): Promise<void> {
    const maxSize = 10 * 1024 * 1024

    for (let i = 0; i < files.length; i++) {
      if (files[i].size > maxSize) {
        setAlertMessage(`Image ${files[i].name} exceeds the maximum size of 10MB.`, false)
        return
      }
    }

    if (value.length + files.length > 20) {
      setAlertMessage('You can only add up to 20 images per section.', false)
      return
    }

    onLoading(true)
    const assets = await uploadAssets(files)
    onLoading(false)
    onChange([...value, ...assets])
  }

  async function handleDelete (id: number): Promise<void> {
    const idx = value.findIndex((item) => item.id === id)

    onChange([
      ...value.slice(0, idx),
      ...value.slice(idx + 1)
    ])
  }

  function handleReorder (val: StrapiMedia[]): void {
    onChange([...val])
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className='text-sm h-10 bg-transparent text-black hover:bg-transparent underline-offset-4 hover:underline py-1 px-2 border border-zinc-200 rounded-[8px]'
          disabled={disabled}
          size='sm'
        >
          Open Gallery
        </Button>
      </DialogTrigger>
      <DialogContent className='max-w-none p-10 flex flex-col'>
        <DialogHeader>
          <DialogTitle>Interior Gallery</DialogTitle>
          <DialogDescription>This is a preview of uploaded interior gallery</DialogDescription>
        </DialogHeader>
        <div className='flex flex-col gap-6'>
          <div className='flex flex-col gap-2 w-fit'>
            <Label className='text-sm/none font-medium text-black' htmlFor='gallery-images'>Add Images</Label>
            <Input
              accept='image/*'
              className='w-fit'
              disabled={disabled}
              id='gallery-images'
              multiple
              onChange={(e) => {
                if (e.target.files !== null) {
                  void handleCreate(e.target.files)
                }
              }}
              required
              type='file'
            />
          </div>
          {value.length !== 0 && (
            <div className='flex flex-col gap-2 relative'>
              <p className='text-sm/none font-medium text-black'>Preview</p>
              <div className='w-full overflow-x-scroll'>
                <Reorder.Group
                  axis='x'
                  className='flex gap-6'
                  onReorder={handleReorder}
                  values={value}
                >
                  {value.map((item) => (
                    <Reorder.Item key={item.id} dragListener={!disabled} value={item}>
                      <ImageFrame>
                        <Image
                          alt='Uploaded image'
                          className='select-none pointer-events-none object-cover border border-zinc-200 overflow-hidden rounded-[6px]'
                          fill
                          sizes='250px'
                          src={item.attributes.url}
                        />
                        <Button
                          className='bg-[#FFF] absolute top-[5px] right-[5px] enabled:hover:bg-[#FFF] p-0 h-auto rounded-full text-[#FF0000]'
                          disabled={disabled}
                          onClick={() => { void handleDelete(item.id) }}
                        >
                          <CircleXIcon size={20} />
                        </Button>
                      </ImageFrame>
                    </Reorder.Item>
                  ))}
                </Reorder.Group>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
