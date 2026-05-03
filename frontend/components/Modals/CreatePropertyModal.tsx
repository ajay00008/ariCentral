'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAlertProvider } from '@/providers/AlertProvider'
import { fetchAPI } from '@/api/fetch-api'

interface Props {
  data: Array<{
    attributes: {
      Name: string
      Slug: string
      Featured: boolean
      createdAt: string
      publishedAt: string
      updatedAt: string
    }
    id: number
  }>
}

const defaultFormData = {
  name: '',
  slug: ''
}

export function CreatePropertyModal ({ data }: Props): React.ReactNode {
  const { setAlertMessage } = useAlertProvider()
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const [formData, setFormData] = React.useState({ ...defaultFormData })

  function handleOpenChange (val: boolean): void {
    setIsOpen(val)

    if (!val) {
      setFormData({ ...defaultFormData })
    }
  }

  function onChange (e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  async function handleSubmit (e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    setLoading(true)

    const existPropertyName = data.find(it => it.attributes.Name === formData.name)
    const existPropertySlug = data.find(it => it.attributes.Slug === formData.slug)
    if ((existPropertyName !== null && existPropertyName !== undefined) && (existPropertySlug !== null && existPropertySlug !== undefined)) {
      setLoading(false)
      return setAlertMessage('Property Name and Slug that you entered already exist in DB. Pick another', false)
    } else if (existPropertyName !== null && existPropertyName !== undefined) {
      setLoading(false)
      return setAlertMessage('Property Name that you entered already exist in DB. Pick another', false)
    } else if (existPropertySlug !== null && existPropertySlug !== undefined) {
      setLoading(false)
      return setAlertMessage('Property Slug that you entered already exist in DB. Pick another', false)
    }

    const trimmedSlug = formData.slug.trim()
    const validSlugPattern = /^[a-zA-Z0-9\s]+$/
    if (!validSlugPattern.test(trimmedSlug)) {
      setLoading(false)
      return setAlertMessage('The slug can contain only letters, numbers, and spaces.', false)
    }

    const response = await fetchAPI('/api/admin/property/create', {
      method: 'POST',
      token: undefined,
      fields: { data: { name: formData.name, slug: formData.slug.trim() } }
    }, true, false)

    if ((response as APIError).err === null || (response as APIError).err === undefined) {
      router.push(`/admin/properties/${formData.slug.trim()}`, { scroll: false })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size='sm' className='w-fit ml-auto mr-[50px] h-[50px] gap-1 bg-zinc-400'>
          <PlusCircledIcon className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
            Add Property
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create Property</DialogTitle>
          <DialogDescription>
            You need to enter Property Name and Property Slug here.
          </DialogDescription>
        </DialogHeader>
        <form
          className='grid gap-4 py-4'
          onSubmit={(e) => {
            void handleSubmit(e)
          }}
        >
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='name' className='text-right'>
              Name
            </Label>
            <Input
              id='name'
              name='name'
              placeholder='COTE'
              value={formData.name}
              onChange={(e) => onChange(e)}
              className='col-span-3'
              required
              maxLength={24}
            />
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='username' className='text-right'>
              Slug
            </Label>
            <Input
              id='slug'
              name='slug'
              placeholder='property-1'
              value={formData.slug}
              onChange={(e) => onChange(e)}
              className='col-span-3'
              required
              maxLength={24}
            />
          </div>
          <div className='flex justify-end'>
            <Button disabled={loading}>Save changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
