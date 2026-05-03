'use client'

import * as React from 'react'
import { PlusIcon } from 'lucide-react'
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

interface CreatePropertyListItemModalProps {
  disabled: boolean
  onCreate: (val: string) => unknown
}

const defaultData = { item: '' }

export function CreatePropertyListItemModal ({
  disabled,
  onCreate
}: CreatePropertyListItemModalProps): React.ReactNode {
  const [data, setData] = React.useState({ ...defaultData })
  const [open, setOpen] = React.useState(false)

  function handleOpenChange (val: boolean): void {
    setOpen(val)

    if (!val) {
      setData({ ...defaultData })
    }
  }

  function handleChange (val: string): void {
    setData((prev) => ({ ...prev, item: val }))
  }

  function handleSubmit (e: React.FormEvent<HTMLFormElement>): void {
    e.preventDefault()
    onCreate(data.item)
    setData({ ...defaultData })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className='flex w-full gap-2 text-sm'
          disabled={disabled}
          size='sm'
          variant='secondary'
        >
          Add
          <PlusIcon size={16} />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Create List Item</DialogTitle>
          <DialogDescription>Here you can create a list item</DialogDescription>
        </DialogHeader>
        <form className='grid gap-4' onSubmit={handleSubmit}>
          <div className='grid items-center gap-4'>
            <Input
              className='col-span-3'
              disabled={disabled}
              onChange={(e) => handleChange(e.target.value)}
              placeholder='Enter item text'
              required
              value={data.item}
            />
          </div>
          <div className='flex justify-end'>
            <Button disabled={disabled}>Create</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
