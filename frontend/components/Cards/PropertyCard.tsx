'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ExternalLink, ClipboardCopy } from 'lucide-react'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { deletePropertyById, generateShareToken, updatePropertyFeaturedStatus } from '@/app/actions'
import { useAlertProvider } from '@/providers/AlertProvider'

interface PropertyCardProps {
  data: {
    attributes: {
      Name: string
      Slug: string
      Featured: boolean
      createdAt?: string
      publishedAt?: string
      updatedAt?: string
      shareToken?: string
    }
    id: number
  }
  onDelete: (id: number) => void
}

export function PropertyCard ({ data, onDelete }: PropertyCardProps): React.ReactNode {
  const { setAlertMessage } = useAlertProvider()
  const [isFeatured, setIsFeatured] = React.useState(data.attributes.Featured === null ? false : data.attributes.Featured)
  const [sharedToken, setSharedToken] = React.useState<string | null>(data?.attributes?.shareToken ?? null)
  const [copied, setCopied] = React.useState(false)
  const [isShareLinkLoading, setIsShareLinkLoading] = React.useState(false)

  const handleCopy = async (): Promise<void> => {
    if (sharedToken !== null) {
      await navigator.clipboard.writeText(`${location.origin}/preview/${sharedToken}`)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  function handleFeatureChange (value: boolean): void {
    setIsFeatured(value)
  }

  async function handleDeleteProperty (id: number): Promise<void> {
    await deletePropertyById(id)
    onDelete(id)
  }

  async function handleFeaturedStatusUpdate (e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const booleanValue = e.target.checked
    const res = await updatePropertyFeaturedStatus(data.id, booleanValue)

    if (res.message !== undefined && res.message === 'Featured properties has reached its max 4 value.') {
      return setAlertMessage('You already selected 4 featured properties.', false)
    } else {
      handleFeatureChange(booleanValue)
    }
  }

  async function handleCreateShareableLink (): Promise<void> {
    setIsShareLinkLoading(true)
    const res = await generateShareToken(data.attributes.Slug)
    setSharedToken(res.shareToken)
    if (res.success) {
      setAlertMessage('Shareable link created successfully.', true)
      setIsShareLinkLoading(false)
    } else {
      setAlertMessage('Failed to create shareable link.', false)
      setIsShareLinkLoading(false)
    }
  }

  return (
    <div className='flex justify-between items-center rounded-[8px] border-zinc-400 border-2 p-[30px] opacity-50 hover:opacity-100 hover:cursor-pointer'>
      <div className='grid gap-2'>
        <div className='flex gap-4'>
          <h3 className='text-lg text-black'>Property Name: {data.attributes.Name}</h3>
          <div className='flex items-center'>
            <span className='text-lg text-gray-400'>|</span>
          </div>
          <p className='text-lg text-black'>Property Slug: {data.attributes.Slug}</p>
        </div>
        {sharedToken !== null && (
          <div className='flex items-center gap-4 p-3 border border-gray-300 rounded-lg bg-gray-100'>
            <p className='text-lg text-black break-all'>{location.origin}/preview/{sharedToken}</p>
            <button onClick={() => { void handleCopy() }} className='p-2 rounded-md bg-gray-200 hover:bg-gray-300 transition'>
              <ClipboardCopy className='w-5 h-5 text-gray-700' />
            </button>
            {copied && <span className='text-green-600 text-sm'>Copied!</span>}
          </div>
        )}
      </div>
      <div className='flex gap-4 items-center'>
        {sharedToken === null && (
          <div>
            <Button disabled={isShareLinkLoading} onClick={() => { void handleCreateShareableLink() }}>Create Shareable Link</Button>
          </div>)}
        <div className='w-fit flex items-center justify-center flex-col gap-[5px]'>
          <Label className='text-red font-bold'>Featured</Label>
          <Input
            type='checkbox'
            checked={isFeatured !== null ? isFeatured : false}
            onChange={(e) => {
              void handleFeaturedStatusUpdate(e)
            }}
            className='w-[20px] h-[20px]'
          />
        </div>
        <Button asChild size='sm' className='w-[70px] h-[45px] justify-center gap-1 bg-zinc-400'>
          <Link href={`/admin/properties/${data.attributes.Slug}?${(new Date().getTime())}`} prefetch={false}>Edit</Link>
        </Button>
        <Button
          size='sm'
          className='w-[70px] h-[45px] bg-zinc-400'
        >
          <Link
            href={`/${data.attributes.Slug}`}
            className='flex p-[10px] flex-row-reverse items-center gap-1'
            prefetch={false}
            rel='noopener noreferrer'
            target='_blank'
          >
            <ExternalLink className='h-3.5 w-3.5 flex flex-shrink-0' />
            <p>Open</p>
          </Link>
        </Button>
        <Button
          variant='destructive'
          className='w-fit h-[45px] justify-center gap-1 disabled:opacity-5'
          onClick={() => {
            const confirmDelete = window.confirm('Are you sure you want to delete this property? It will delete all its floor, units, and images')
            if (confirmDelete) {
              void handleDeleteProperty(data.id)
            }
          }}
        >
          Delete
        </Button>
      </div>
    </div>
  )
}
