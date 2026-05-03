import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { Codes } from '@/constants/code-errors'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { fetchAPI } from '@/api/fetch-api'
import { z } from 'zod'

export async function POST (request: Request): Promise<NextResponse> {
  try {
    const data = await request.json()
    const { propertyId }: { propertyId: number } = data.data

    const propertyIdZodCheck = z.number()

    if (typeof propertyId === 'undefined') {
      return NextResponse.json({ message: 'propertyId body parameter is required.' }, { status: 400 })
    }

    if (!propertyIdZodCheck.safeParse(propertyId).success) {
      return NextResponse.json({ message: 'PropertyId body parameter should be number.' }, { status: 400 })
    }

    const session: SessionType | null = await getServerSession(authOptions)
    const sessionToken = session?.user?.access_token ?? ''
    if (sessionToken === '') return NextResponse.json({ message: 'Please, use our official application' }, { status: 503 })

    const response: Response = await fetchAPI(`/api/properties/${propertyId}?populate=deep`, {
      method: 'GET',
      token: sessionToken,
      fields: undefined
    }, false, true)

    if (!response.ok) {
      return NextResponse.json({
        code: response.status,
        message: response.statusText
      }, { status: response.status })
    }

    const serverData = await response.json()
    const propertyData = serverData.data
    const floors: number[] = []
    let floorsPromises: Array<Promise<void>> = []
    const units: number[] = []
    let unitsPromises: Array<Promise<void>> = []

    if (propertyData.attributes.floors.data.length !== 0) {
      propertyData.attributes.floors.data.forEach((item: Floor) => {
        floors.push(item.id)

        if (item.attributes.units.data.length !== 0) {
          item.attributes.units.data.forEach((unit: CustomUnit) => {
            units.push(unit.id)
          })
        }
      })
    }

    if (units.length !== 0) {
      const deleteUnitsPromises = units.map(async (element) => {
        await fetchAPI(`/api/units/${element}`, {
          method: 'DELETE',
          token: sessionToken
        }, false, true)
      })
      unitsPromises = deleteUnitsPromises
    }

    if (unitsPromises.length !== 0) {
      await Promise.all(floorsPromises)
    }

    if (floors.length !== 0) {
      const deleteFloorsPromises = floors.map(async (element) => {
        await fetchAPI(`/api/floors/${element}`, {
          method: 'DELETE',
          token: sessionToken
        }, false, true)
      })
      floorsPromises = deleteFloorsPromises
    }

    if (floorsPromises.length !== 0) {
      await Promise.all(floorsPromises)
    }

    const response2: Response = await fetchAPI(`/api/properties/${propertyId}?populate=deep`, {
      method: 'DELETE',
      token: sessionToken,
      fields: undefined
    }, false, true)

    if (!response2.ok) {
      return NextResponse.json({
        code: response2.status,
        message: response2.statusText
      }, { status: response2.status })
    }

    return NextResponse.json(propertyData, { status: 200 })
  } catch (err) {
    Sentry.captureException(err)
    return NextResponse.json({
      code: Codes.INTERNAL_SERVER_ERROR.code,
      err: Codes.INTERNAL_SERVER_ERROR.message
    }, { status: 500 })
  }
}
