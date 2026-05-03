import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { getServerSession } from 'next-auth'
import { Codes } from '@/constants/code-errors'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { fetchAPI } from '@/api/fetch-api'
import { propertySchema } from '@/schemas/property'

const createdId = 2_000_000_000

export async function PUT (request: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession<{}, SessionType>(authOptions)
    const token = session?.user?.access_token ?? ''

    if (session === null || token === '') {
      return NextResponse.json({
        message: 'You are not authorized'
      }, { status: 400 })
    }

    const requestData = await request.json()
    const dataResult = await propertySchema.safeParseAsync(requestData)

    if (!dataResult.success) {
      return NextResponse.json({
        message: 'Input data is invalid'
      }, { status: 400 })
    }

    const { data } = dataResult
    const propertyResponse = await fetchAPI<Response>(`/api/properties/${data.id}?populate=deep`, { token }, false, true)
    const propertyData = await propertyResponse.json()
    const propertyResult = await propertySchema.safeParseAsync(propertyData.data)

    if (!propertyResult.success) {
      return NextResponse.json({
        message: 'Property not found'
      }, { status: 404 })
    }

    const property = propertyResult.data
    const dataFloors = data.attributes.floors.data
    const propertyFloors = property.attributes.floors.data
    const dataUnits = dataFloors.map((floor) => floor.attributes.units.data).flat()
    const propertyUnits = propertyFloors.map((floor) => floor.attributes.units.data).flat()

    const floorsToDelete = propertyFloors.filter((floor) => dataFloors.findIndex((it) => it.id === floor.id) === -1)
    const unitsToDelete = propertyUnits.filter((unit) => dataUnits.findIndex((it) => it.id === unit.id) === -1)

    const deletePromises: Array<Promise<void>> = []

    deletePromises.push(
      ...unitsToDelete.map(async (unit) => {
        await fetchAPI(`/api/units/${unit.id}`, {
          method: 'DELETE',
          token
        })
      })
    )

    deletePromises.push(
      ...floorsToDelete.map(async (floor) => {
        await fetchAPI(`/api/floors/${floor.id}`, {
          method: 'DELETE',
          token
        })
      })
    )

    await Promise.all(deletePromises)
    const unitsMap = new Map<number, number>()

    await Promise.all(
      dataUnits.map(async (unit) => {
        const isNew = unit.id >= createdId

        const data = {
          ...unit.attributes,
          unitPlan: {
            set: unit.attributes.unitPlan.data === null ? [] : [unit.attributes.unitPlan.data.id]
          },
          unitGallery: {
            set: (unit.attributes.unitGallery.data ?? []).map((it) => it.id)
          },
          positions: unit.attributes.positions.map((unitPosition) => ({
            ...unitPosition,
            id: unitPosition.id >= createdId ? undefined : unitPosition.id
          }))
        }

        const res = await fetchAPI<Response>(isNew ? '/api/units' : `/api/units/${unit.id}`, {
          method: isNew ? 'POST' : 'PUT',
          token,
          fields: { data }
        })

        if (isNew) {
          const data = await res.json()
          unitsMap.set(unit.id, data.data.id)
        }
      })
    )

    const floorsMap = new Map<number, number>()

    await Promise.all(
      dataFloors.map(async (floor) => {
        const isNew = floor.id >= createdId

        const data = {
          ...floor.attributes,
          units: {
            set: floor.attributes.units.data.map((unit) => (unitsMap.get(unit.id) ?? unit.id))
          }
        }

        const res = await fetchAPI<Response>(isNew ? '/api/floors' : `/api/floors/${floor.id}`, {
          method: isNew ? 'POST' : 'PUT',
          token,
          fields: { data }
        })

        if (isNew) {
          const data = await res.json()
          floorsMap.set(floor.id, data.data.id)
        }
      })
    )

    const galleries = ['ViewsGallery', 'InteriorGallery', 'AmenitiesGallery', 'Gallery'] as const
    const lists = ['Dates', 'Facilities'] as const

    const updatedData = {
      ...data.attributes,
      PDFImages: undefined,
      HeroImage: {
        set: (data.attributes.HeroImage.data ?? []).map((it) => it.id)
      },
      HeroImages: data.attributes.HeroImages.map((heroImage) => ({
        ...heroImage,
        id: heroImage.id >= createdId ? undefined : heroImage.id,
        Name: heroImage.Name.slice(0, 255),
        Image: {
          set: heroImage.Image.data === null ? [] : [heroImage.Image.data.id]
        }
      })),
      Brochure: {
        set: data.attributes.Brochure.data === null ? [] : [data.attributes.Brochure.data.id]
      },
      ...galleries.reduce((arr, galleryKey) => {
        const gallery = data.attributes[galleryKey]

        if (gallery === null) {
          return arr
        }

        return {
          ...arr,
          [galleryKey]: {
            ...gallery,
            id: gallery.id >= createdId ? undefined : gallery.id,
            SubGallery: gallery.SubGallery.map((subGallery) => ({
              ...subGallery,
              id: subGallery.id >= createdId ? undefined : subGallery.id,
              Media: {
                set: (subGallery.Media.data ?? []).map((it) => it.id)
              }
            }))
          }
        }
      }, {}),
      ...lists.reduce((arr, listKey) => {
        const list = data.attributes[listKey]

        if (list === null) {
          return arr
        }

        return {
          ...arr,
          [listKey]: {
            ...list,
            id: list.id >= createdId ? undefined : list.id,
            Items: (list.Items ?? []).map((item) => ({
              ...item,
              id: item.id >= createdId ? undefined : item.id
            }))
          }
        }
      }, {}),
      floors: {
        set: data.attributes.floors.data.map((floor) => (floorsMap.get(floor.id) ?? floor.id))
      },
      Downloads: data.attributes.Downloads.map((download) => ({
        ...download,
        id: download.id >= createdId ? undefined : download.id,
        downloadFile: {
          set: download.downloadFile.data === null ? [] : [download.downloadFile.data.id]
        }
      }))
    }

    const propertyUpdateRes = await fetchAPI<Response>(`/api/properties/${property.id}?populate=deep`, {
      method: 'PUT',
      token,
      fields: {
        data: updatedData
      }
    })

    const propertyUpdateData = await propertyUpdateRes.json()
    return NextResponse.json(propertyUpdateData.data, { status: 200 })
  } catch (err) {
    Sentry.captureException(err)

    return NextResponse.json({
      message: Codes.INTERNAL_SERVER_ERROR.message
    }, { status: 500 })
  }
}
