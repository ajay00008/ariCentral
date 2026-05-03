'use client'

import * as React from 'react'
import { CircleXIcon, TrashIcon } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ImageFrame } from '@/components/Custom/ImageFrame'
import { Input } from '@/components/ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { uploadAssets } from '@/app/actions'

interface DownloadsCardProps {
  disabled: boolean
  onChange: (val: StrapiSharedDownload) => unknown
  onDelete: () => unknown
  onLoading: (loading: boolean) => unknown
  value: StrapiSharedDownload
}

export function DownloadsCard ({
  disabled,
  onChange,
  onDelete,
  onLoading,
  value
}: DownloadsCardProps): React.ReactNode {
  const mimeType = value.downloadFile.data?.attributes.mime ?? ''
  const notSupportedMimeType = !mimeType.startsWith('image/') && mimeType !== 'application/pdf'

  async function handleCreate (files: FileList): Promise<void> {
    onLoading(true)
    const [asset] = await uploadAssets(files[0])
    onLoading(false)

    onChange({
      ...value,
      downloadFile: {
        ...value.downloadFile,
        data: asset
      }
    })
  }

  function handleChange<T extends keyof StrapiSharedDownload> (
    name: T,
    val: StrapiSharedDownload[T]
  ): void {
    onChange({ ...value, [name]: val })
  }

  function handleDelete (): void {
    onChange({
      ...value,
      downloadFile: {
        ...value.downloadFile,
        data: null
      }
    })
  }

  return (
    <div className='flex flex-col gap-6 first:border-0 border-t border-zinc-200 py-5 first:pt-0 last:pb-0'>
      <div className='flex flex-col gap-6'>
        <div className='flex justify-between'>
          <div className='flex gap-2'>
            <div className='flex flex-col gap-2'>
              <Label className='text-sm/none font-medium text-black'>Download Name</Label>
              <Input
                className='w-fit disabled:cursor-not-allowed'
                disabled={disabled}
                onChange={(e) => handleChange('downloadName', e.target.value)}
                placeholder='Enter download name'
                type='text'
                value={value.downloadName ?? ''}
              />
            </div>
            <div className='flex flex-col gap-2 w-[182px]'>
              <Label className='text-sm/none font-medium text-black'>Download Icon</Label>
              <Select
                disabled={disabled}
                onValueChange={(val) => handleChange('Icon', val as StrapiSharedDownload['Icon'])}
                value={value.Icon}
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select an icon type' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Image'>Image</SelectItem>
                  <SelectItem value='FloorPlan'>Floor Plan</SelectItem>
                  <SelectItem value='Chart'>Chart</SelectItem>
                  <SelectItem value='Building'>Building</SelectItem>
                </SelectContent>
              </Select>
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
        {value.downloadFile.data === null && (
          <div className='flex flex-col gap-2'>
            <Label className='text-sm/none font-medium text-black'>Add Download File</Label>
            <Input
              className='w-fit disabled:cursor-not-allowed'
              disabled={disabled}
              onChange={(e) => {
                if (e.target.files !== null) {
                  void handleCreate(e.target.files)
                }
              }}
              type='file'
            />
          </div>
        )}
      </div>
      {value.downloadFile.data !== null && (
        <div className='flex flex-col gap-2 w-fit'>
          <div className='flex gap-2 items-center'>
            <Label className='text-sm/none font-medium text-black'>
              Download Preview ({value.downloadFile.data.attributes.mime})
            </Label>
            <Button
              className='rounded-full hover:bg-[#FFF] bg-[#FFF] p-0 h-auto disabled:cursor-not-allowed text-[#F00]'
              disabled={disabled}
              onClick={() => handleDelete()}
            >
              <CircleXIcon size={20} />
            </Button>
          </div>
          {value.downloadFile.data.attributes.mime.startsWith('image/') && (
            <ImageFrame>
              <Image
                alt='Uploaded image'
                className='select-none pointer-events-none border border-zinc-200 rounded-md object-cover'
                fill
                sizes='250px'
                src={value.downloadFile.data.attributes.url}
              />
            </ImageFrame>
          )}
          {value.downloadFile.data.attributes.mime === 'application/pdf' && (
            <embed
              height='250px'
              src={value.downloadFile.data.attributes.url}
              width='300px'
            />
          )}
          {notSupportedMimeType && (
            <p className='text-sm/tight text-zinc-500'>This file type can't be previewed</p>
          )}
        </div>
      )}
    </div>
  )
}
