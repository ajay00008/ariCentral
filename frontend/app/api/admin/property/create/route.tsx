import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { Codes } from '@/constants/code-errors'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { z } from 'zod'
import { fetchAPI } from '@/api/fetch-api'

export async function POST (request: Request): Promise<NextResponse<APIEmpty>> {
  try {
    const json = await request.json()
    const { name, slug }: { name: string, slug: string } = json.data
    const nameZodCheck = z.string()
    const slugZodCheck = z.string()

    if (typeof name === 'undefined') {
      return NextResponse.json({ message: 'Name body parameter is required.' }, { status: 400 })
    } else if (typeof slug === 'undefined') {
      return NextResponse.json({ message: 'Slug body parameter is required.' }, { status: 400 })
    }

    if (!nameZodCheck.safeParse(name).success) {
      return NextResponse.json({ message: 'Name body parameter should be string.' }, { status: 400 })
    } else if (!slugZodCheck.safeParse(slug).success) {
      return NextResponse.json({ message: 'Slug body parameter should be string.' }, { status: 400 })
    }

    const session: SessionType | null = await getServerSession(authOptions)
    const sessionToken = session?.user?.access_token ?? ''
    if (sessionToken === '') return NextResponse.json({ message: 'Please, use our official application' }, { status: 503 })

    const response: Response = await fetchAPI('/api/properties', {
      method: 'POST',
      token: sessionToken,
      fields: JSON.stringify({
        data: {
          Name: name,
          Slug: slug,
          HeroImages: []
        }
      })
    }, false, true)

    const serverData = await response.json()
    const propertyId: string = serverData.data.id

    const response2: Response = await fetchAPI(`/api/properties/${propertyId}`, {
      method: 'PUT',
      token: sessionToken,
      fields: JSON.stringify({
        data: {
          floors: {
            disconnect: [],
            connect: []
          },
          InteriorGallery: {
            name: 'InteriorGallery'
          },
          ViewsGallery: {
            name: 'ViewsGallery'
          },
          Gallery: {
            name: 'Exterior'
          },
          AmenitiesGallery: {
            name: 'AmenitiesGallery'
          },
          Facilities: {
            Identifier: 'Facilities List'
          },
          Details: {
            Identifier: 'Details List'
          },
          Dates: {
            Identifier: 'Key Dates'
          },
          Architect: ' disabled',
          Builder: ' disabled',
          Developer: ' disabled',
          BookACallLink: ' disabled',
          MakeAnOfferLink: ' disabled',
          ProjectWebsiteLink: ' disabled',
          RegisterForUpdatesCode: ' disabled'
        }
      })
    }, false, true)

    if (response2.ok) {
      return NextResponse.json({}, { status: 200 })
    } else {
      return NextResponse.json({
        code: response.status,
        message: response.statusText
      }, { status: response.status })
    }
  } catch (err) {
    Sentry.captureException(err)
    return NextResponse.json({
      code: Codes.INTERNAL_SERVER_ERROR.code,
      err: Codes.INTERNAL_SERVER_ERROR.message
    }, { status: 500 })
  }
}
