'use client'

import * as React from 'react'
import { Button } from '../ui/button'
import { DownloadsManager } from '@/components//DownloadsManager/DownloadsManager'
import { FloorsManager } from '@/components/FloorsManager/FloorsManager'
import { ImageGalleryManager } from '@/components/ImageGalleryManager/ImageGalleryManager'
import { Populate } from '@/components/Populate/Populate'
import { PropertySlugForm } from '@/components/Forms/PropertySlugForm'
import { generateFloor, generateUnit } from '@/lib/generator'
import { updatePropertyById } from '@/app/actions'

interface PropertyItemMainProps {
  data: StrapiPropertyProperty
}

export function PropertyItemMain ({ data: initialData }: PropertyItemMainProps): React.ReactNode {
  const [changed, setChanged] = React.useState(false)
  const [data, setData] = React.useState(initialData)
  const [loading, setLoading] = React.useState(false)

  function handleChange<T extends StrapiPropertyPropertyFields> (
    name: T,
    val: StrapiPropertyProperty['attributes'][T]
  ): void {
    setData((prev) => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [name]: val
      }
    }))

    setChanged(true)
  }

  function handleLoading (loading: boolean): void {
    setLoading(loading)
  }

  function handlePopulate (floors: number, units: number): void {
    const floorsAmount = Array(floors).fill(undefined)
    const unitsAmount = Array(units).fill(undefined)

    setData(
      (prev) => ({
        ...prev,
        attributes: {
          ...prev.attributes,
          floors: {
            data: floorsAmount.map(() => generateFloor(unitsAmount.map((_, idx) => generateUnit(idx + 1))))
          }
        }
      })
    )

    setChanged(true)
  }

  async function handleSave (): Promise<void> {
    setLoading(true)
    await updatePropertyById(data)
    setLoading(false)
    setChanged(false)
  }

  return (
    <div className='flex flex-col p-16 gap-[50px] w-full'>
      <PropertySlugForm
        data={data}
        disabled={loading}
        onChange={handleChange}
        onLoading={handleLoading}
      />
      {data.attributes.floors.data.length === 0 && (
        <Populate disabled={loading} onPopulate={handlePopulate} />
      )}
      {data.attributes.floors.data.length !== 0 && (
        <FloorsManager
          data={data}
          disabled={loading}
          onChange={(val) => handleChange('floors', { ...data.attributes.floors, data: val })}
          onLoading={handleLoading}
        />
      )}
      {data.attributes.Gallery !== null && (
        <ImageGalleryManager
          disabled={loading}
          label='Exterior'
          onChange={(val) => handleChange('Gallery', val)}
          onLoading={handleLoading}
          value={data.attributes.Gallery}
        />
      )}
      {data.attributes.InteriorGallery !== null && (
        <ImageGalleryManager
          disabled={loading}
          label='Interior'
          onChange={(val) => handleChange('InteriorGallery', val)}
          onLoading={handleLoading}
          value={data.attributes.InteriorGallery}
        />
      )}
      {data.attributes.AmenitiesGallery !== null && (
        <ImageGalleryManager
          disabled={loading}
          label='Facilities'
          onChange={(val) => handleChange('AmenitiesGallery', val)}
          onLoading={handleLoading}
          value={data.attributes.AmenitiesGallery}
        />
      )}
      {data.attributes.ViewsGallery !== null && (
        <ImageGalleryManager
          disabled={loading}
          label='Views'
          onChange={(val) => handleChange('ViewsGallery', val)}
          onLoading={handleLoading}
          value={data.attributes.ViewsGallery}
        />
      )}
      <DownloadsManager
        disabled={loading}
        onChange={(val) => handleChange('Downloads', val)}
        onLoading={handleLoading}
        value={data.attributes.Downloads}
      />
      {changed && (
        <Button
          className='fixed rounded-full min-w-[100px] right-16 bottom-3 z-[40]'
          disabled={loading}
          onClick={() => { void handleSave() }}
        >
          {loading ? 'Saving...' : 'Save'}
        </Button>
      )}
    </div>
  )
}
