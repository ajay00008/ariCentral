'use client'

import * as React from 'react'
import { CopyPlusIcon, GripIcon, TrashIcon } from 'lucide-react'
import Image from 'next/image'
import { Reorder, useDragControls } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ChangeUnitGalleryModal } from '@/components/Modals/ChangeUnitGalleryModal'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { generateId } from '@/lib/generator'
import { uploadAssets } from '@/app/actions'

interface UnitsListProps {
  data: StrapiUnitUnit[]
  disabled: boolean
  onChange: (val: StrapiUnitUnit[]) => unknown
  onLoading: (loading: boolean) => unknown
}

const columns = {
  Actions: '92px',
  Status: '120px',
  ID: '80px',
  Type: '150px',
  Aspect: '80px',
  Living: '80px',
  'Beds (+ Office)': '120px',
  Baths: '80px',
  Powder: '80px',
  Cars: '80px',
  Price: '120px',
  RentApp: '100px',
  BodyCorp: '100px',
  Rates: '100px',
  'Internal Size': '120px',
  'External Size': '120px',
  'Floor Plan': '250px',
  'Interior Images': '270px'
}

function sanitizeFloat (val: string): number {
  return isNaN(Number.parseFloat(val)) ? 0 : Number.parseFloat(val)
}

function sanitizeInt (val: string): number {
  return isNaN(Number.parseInt(val, 10)) ? 0 : Number.parseInt(val, 10)
}

export function UnitsList ({
  data,
  disabled,
  onChange,
  onLoading
}: UnitsListProps): React.ReactNode {
  const dragControls = useDragControls()

  async function handleAssetChange (id: number, name: StrapiUnitUnitMediaFields, files: FileList): Promise<void> {
    if (files.length !== 1) {
      return
    }

    onLoading(true)
    const [asset] = await uploadAssets(files[0])
    onLoading(false)

    const position = data.findIndex((unit) => unit.id === id)
    handleChange(id, name, { ...data[position].attributes[name], data: asset })
  }

  async function handleAssetDelete (id: number, name: StrapiUnitUnitMediaFields): Promise<void> {
    const position = data.findIndex((unit) => unit.id === id)
    handleChange(id, name, { ...data[position].attributes[name], data: null })
  }

  function handleChange<T extends keyof StrapiUnitUnit['attributes']> (
    id: number,
    name: T,
    val: StrapiUnitUnit['attributes'][T]
  ): void {
    const position = data.findIndex((unit) => unit.id === id)

    onChange([
      ...data.slice(0, position),
      {
        ...data[position],
        attributes: {
          ...data[position].attributes,
          [name]: val
        }
      },
      ...data.slice(position + 1)
    ])
  }

  function handleDelete (id: number): void {
    onChange(data.filter((unit) => unit.id !== id))
  }

  function handleDuplicate (id: number): void {
    const position = data.findIndex((unit) => unit.id === id)

    onChange([
      ...data.slice(0, position + 1),
      {
        ...data[position],
        id: generateId(),
        attributes: {
          ...data[position].attributes,
          identifier: '',
          order: (data[position].attributes.order ?? 0) + 1,
          unitPlan: {
            data: null
          },
          unitGallery: {
            data: null
          }
        }
      },
      ...data.slice(position + 1).map((unit) => ({
        ...unit,
        attributes: {
          ...unit.attributes,
          order: (unit.attributes.order ?? 0) + 1
        }
      }))
    ])
  }

  function handleReorder (val: StrapiUnitUnit[]): void {
    onChange([
      ...val.map((unit, idx) => ({
        ...unit,
        attributes: {
          ...unit.attributes,
          order: idx + 1
        }
      }))
    ])
  }

  const orderedData = data.sort((a, b) => (a.attributes.order ?? 999_999) - (b.attributes.order ?? 999_999))

  return (
    <Table className='admin-property-units-table'>
      <TableHeader>
        <TableRow className='flex hover:bg-color-none'>
          {Object.entries(columns).map(([columnName, width]) => (
            <TableHead key={columnName} className='flex py-1 px-2 text-center justify-center h-auto' style={{ width }}>
              {columnName !== 'Actions' ? columnName : ''}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <Reorder.Group
          as='tr'
          axis='y'
          onReorder={handleReorder}
          values={orderedData}
        >
          {orderedData.map((unit) => (
            <Reorder.Item
              key={unit.id}
              as='td'
              className='items-center flex'
              dragControls={dragControls}
              dragListener={!disabled}
              value={unit}
            >
              <div className='flex p-2 text-center justify-center gap-2' style={{ width: columns.Actions }}>
                <button
                  className='disabled:opacity-50 enabled:cursor-pointer'
                  disabled={disabled}
                  onPointerDown={(e) => dragControls.start(e)}
                >
                  <GripIcon size={20} />
                </button>
                <button
                  className='disabled:opacity-50 enabled:cursor-pointer'
                  disabled={disabled}
                  onClick={() => handleDuplicate(unit.id)}
                >
                  <CopyPlusIcon size={20} />
                </button>
                <button
                  className='disabled:opacity-50 enabled:cursor-pointer text-destructive'
                  disabled={disabled}
                  onClick={() => handleDelete(unit.id)}
                >
                  <TrashIcon size={20} />
                </button>
              </div>
              <div className='p-2 text-center justify-center' style={{ width: columns.Status }}>
                <Select
                  disabled={disabled}
                  onValueChange={(val) => handleChange(unit.id, 'status', val as StrapiUnitUnit['attributes']['status'])}
                  value={unit.attributes.status}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Unit Status' />
                  </SelectTrigger>
                  <SelectContent className='justify-between'>
                    <SelectGroup>
                      <SelectLabel>Status</SelectLabel>
                      <SelectItem value='AVAILABLE'>Available</SelectItem>
                      <SelectItem value='SOLD'>Sold</SelectItem>
                      <SelectItem value='RESERVED'>Reserved</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className='p-2 text-center justify-center' style={{ width: columns.ID }}>
                <Input
                  className='w-full'
                  disabled={disabled}
                  maxLength={24}
                  onChange={(e) => handleChange(unit.id, 'identifier', e.target.value)}
                  placeholder='ID'
                  type='text'
                  value={unit.attributes.identifier}
                />
              </div>
              <div className='p-2 text-center justify-center' style={{ width: columns.Type }}>
                <Select
                  disabled={disabled}
                  onValueChange={(val) => handleChange(unit.id, 'type', val as StrapiUnitUnit['attributes']['type'])}
                  value={unit.attributes.type}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Unit Type' />
                  </SelectTrigger>
                  <SelectContent className='justify-between'>
                    <SelectGroup>
                      <SelectLabel>Type</SelectLabel>
                      <SelectItem value='TOWNHOUSE'>Townhouse</SelectItem>
                      <SelectItem value='APARTMENT'>Apartment</SelectItem>
                      <SelectItem value='HOUSE'>House</SelectItem>
                      <SelectItem value='PENTHOUSE'>Penthouse</SelectItem>
                      <SelectItem value='LAND'>Land</SelectItem>
                      <SelectItem value='VILLA'>Villa</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className='p-2 text-center justify-center' style={{ width: columns.Aspect }}>
                <Select
                  disabled={disabled}
                  onValueChange={(val) => handleChange(unit.id, 'aspect', val as StrapiUnitUnit['attributes']['aspect'])}
                  value={unit.attributes.aspect}
                >
                  <SelectTrigger className='w-full'>
                    <SelectValue placeholder='Aspect Side' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Aspect</SelectLabel>
                      <SelectItem value='SOUTH'>S</SelectItem>
                      <SelectItem value='NORTH'>N</SelectItem>
                      <SelectItem value='WEST'>W</SelectItem>
                      <SelectItem value='EAST'>E</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className='p-2 text-center justify-center' style={{ width: columns.Living }}>
                <Input
                  className='w-full'
                  disabled={disabled}
                  onChange={(e) => handleChange(unit.id, 'living', sanitizeInt(e.target.value))}
                  placeholder='Living'
                  type='number'
                  value={unit.attributes.living?.toString() ?? '0'}
                />
              </div>
              <div className='p-2 text-center justify-center' style={{ width: columns['Beds (+ Office)'] }}>
                <div className='flex gap-[5px]'>
                  <Input
                    className='w-[80%]'
                    disabled={disabled}
                    onChange={(e) => {
                      const val = sanitizeInt(e.target.value)
                      const withOffice = unit.attributes.beds?.endsWith(' + Office') ?? false
                      handleChange(unit.id, 'beds', withOffice ? `${val} + Office` : val.toString())
                    }}
                    placeholder='Beds'
                    type='number'
                    value={unit.attributes.beds?.replace(/ \+ Office$/, '') ?? '0'}
                  />
                  <Input
                    checked={unit.attributes.beds?.endsWith(' + Office') ?? false}
                    disabled={disabled}
                    className='w-[20%]'
                    onChange={(e) => {
                      const val = unit.attributes.beds ?? ''
                      handleChange(unit.id, 'beds', e.target.checked ? `${val} + Office` : val.replace(/ \+ Office$/, ''))
                    }}
                    type='checkbox'
                  />
                </div>
              </div>
              <div className='p-2 text-center justify-center' style={{ width: columns.Baths }}>
                <Input
                  className='w-full'
                  disabled={disabled}
                  onChange={(e) => handleChange(unit.id, 'baths', sanitizeInt(e.target.value).toString())}
                  placeholder='Baths'
                  type='number'
                  value={unit.attributes.baths?.toString() ?? '0'}
                />
              </div>
              <div className='p-2 text-center justify-center' style={{ width: columns.Powder }}>
                <Input
                  className='w-full'
                  disabled={disabled}
                  onChange={(e) => handleChange(unit.id, 'powder', sanitizeInt(e.target.value))}
                  placeholder='Powder'
                  type='number'
                  value={unit.attributes.powder?.toString() ?? '0'}
                />
              </div>
              <div className='p-2 text-center justify-center' style={{ width: columns.Cars }}>
                <Input
                  className='w-full'
                  disabled={disabled}
                  onChange={(e) => handleChange(unit.id, 'cars', sanitizeInt(e.target.value))}
                  placeholder='Cars'
                  type='number'
                  value={unit.attributes.cars?.toString() ?? 0}
                />
              </div>
              <div className='p-2 text-center justify-center' style={{ width: columns.Price }}>
                <Input
                  className='w-full'
                  disabled={disabled}
                  onChange={(e) => handleChange(unit.id, 'price', sanitizeFloat(e.target.value))}
                  placeholder='price'
                  type='number'
                  value={unit.attributes.price?.toString() ?? 0}
                />
              </div>
              <div className='p-2 text-center justify-center' style={{ width: columns.RentApp }}>
                <Input
                  className='w-full'
                  disabled={disabled}
                  onChange={(e) => handleChange(unit.id, 'rentApp', sanitizeInt(e.target.value))}
                  placeholder='Rent App'
                  type='number'
                  value={unit.attributes.rentApp?.toString() ?? 0}
                />
              </div>
              <div className='p-2 text-center justify-center' style={{ width: columns.BodyCorp }}>
                <Input
                  className='w-full'
                  disabled={disabled}
                  onChange={(e) => handleChange(unit.id, 'bodyCorp', sanitizeInt(e.target.value))}
                  placeholder='Body Corp'
                  type='number'
                  value={unit.attributes.bodyCorp?.toString() ?? 0}
                />
              </div>
              <div className='p-2 text-center justify-center' style={{ width: columns.Rates }}>
                <Input
                  className='w-full'
                  disabled={disabled}
                  onChange={(e) => handleChange(unit.id, 'rates', sanitizeInt(e.target.value))}
                  placeholder='Rates'
                  type='number'
                  value={unit.attributes.rates?.toString() ?? 0}
                />
              </div>
              <div className='p-2 text-center justify-center' style={{ width: columns['Internal Size'] }}>
                <Input
                  className='w-full'
                  disabled={disabled}
                  onChange={(e) => handleChange(unit.id, 'internalSize', sanitizeFloat(e.target.value))}
                  placeholder='Internal Size'
                  type='number'
                  value={unit.attributes.internalSize?.toString() ?? 0}
                />
              </div>
              <div className='p-2 text-center justify-center' style={{ width: columns['External Size'] }}>
                <Input
                  className='w-full'
                  disabled={disabled}
                  onChange={(e) => handleChange(unit.id, 'externalSize', sanitizeFloat(e.target.value))}
                  placeholder='External Size'
                  type='number'
                  value={unit.attributes.externalSize?.toString() ?? 0}
                />
              </div>
              <div className='flex gap-1 p-2 text-center justify-center' style={{ width: columns['Floor Plan'] }}>
                <Input
                  accept='image/*'
                  className={`${unit.attributes.unitPlan.data !== null && unit.attributes.unitPlan !== null ? 'w-[108px]' : 'w-full'} border-zinc-200`}
                  disabled={disabled}
                  onChange={(e) => {
                    if (e.target.files !== null) {
                      void handleAssetChange(unit.id, 'unitPlan', e.target.files)
                    }
                  }}
                  type='file'
                />
                {unit.attributes.unitPlan?.data !== null && unit.attributes.unitPlan !== null && (
                  <Dialog>
                    <DialogTrigger className='h-[40px] overflow-hidden text-black underline-offset-4 hover:underline grow p-1 border border-zinc-200 rounded-[4px] relative'>
                      <Image
                        alt='Plan image'
                        className='w-full h-full object-cover'
                        fill
                        sizes='200px'
                        src={unit.attributes.unitPlan.data.attributes.url}
                      />
                    </DialogTrigger>
                    <DialogContent className='w-[750px] max-w-none'>
                      <DialogHeader>
                        <DialogTitle>Floor Plan</DialogTitle>
                        <DialogDescription>This is a preview of uploaded floor plan</DialogDescription>
                      </DialogHeader>
                      <div className='flex flex-col gap-2 items-center'>
                        <Image
                          alt='Plan image'
                          className='mx-auto rounded-[8px] w-full max-h-[70vh] object-cover object-center'
                          height={unit.attributes.unitPlan.data.attributes.height ?? undefined}
                          src={unit.attributes.unitPlan.data.attributes.url}
                          width={unit.attributes.unitPlan.data.attributes.width ?? undefined}
                        />
                        <Button
                          disabled={disabled}
                          onClick={() => { void handleAssetDelete(unit.id, 'unitPlan') }}
                          variant='destructive'
                        >
                          Unlink Floor Plan
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                )}
              </div>
              <div className='flex gap-1 p-2 text-center justify-center' style={{ width: columns['Interior Images'] }}>
                <p className='text-sm font-medium leading-[30px] h-[40px] text-black underline-offset-4 grow p-1 border border-zinc-200 rounded-[8px]'>
                  {unit.attributes.unitGallery.data !== null && unit.attributes.unitGallery.data.length !== 0 && (
                    `${unit.attributes.unitGallery.data.length} ${unit.attributes.unitGallery.data.length.toString().endsWith('1') ? 'image' : 'images'}`
                  )}
                  {(unit.attributes.unitGallery.data === null || unit.attributes.unitGallery.data.length === 0) && '0 images'}
                </p>
                <ChangeUnitGalleryModal
                  disabled={disabled}
                  onChange={(val) => handleChange(unit.id, 'unitGallery', { ...unit.attributes.unitGallery, data: val })}
                  onLoading={onLoading}
                  value={unit.attributes.unitGallery.data ?? []}
                />
              </div>
            </Reorder.Item>
          ))}
        </Reorder.Group>
      </TableBody>
    </Table>
  )
}
