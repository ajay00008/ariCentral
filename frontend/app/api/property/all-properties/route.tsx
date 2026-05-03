import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { Codes } from '@/constants/code-errors'
import { fetchAPI } from '@/api/fetch-api'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

export async function GET (request: NextRequest): Promise<NextResponse> {
  try {
    const session: SessionType | null = await getServerSession(authOptions)
    const sessionToken = session?.user?.access_token ?? ''
    if (sessionToken === '') return NextResponse.json({ message: 'Please, use our official application' }, { status: 503 })

    const searchParams = request.nextUrl.searchParams
    const pageParam = searchParams.get('page')
    const pageSizeParam = searchParams.get('pageSize')

    if (!z.string().min(1).safeParse(pageParam).success) {
      return NextResponse.json({ message: 'Page parameter is required' }, { status: 400 })
    }

    if (!z.string().min(1).safeParse(pageSizeParam).success) {
      return NextResponse.json({ message: 'Page size parameter is required' }, { status: 400 })
    }

    const page = pageParam as string
    const pageSize = pageSizeParam as string

    const response: Response = await fetchAPI(`/api/properties?populate[0]=floors.units,HeroImage,HeroImages,ApprovedUsers,AccessRequests.User,HeroImages.Image&pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort[0]=createdAt:desc`, {
      token: sessionToken
    }, false, true)

    const data = await response.json()
    const allProperties: FullProperty[] = data.data
    if (allProperties === undefined) return NextResponse.json({ message: 'Wasnt able to find any property, and fetch it.' }, { status: 400 })

    if (response.ok) {
      return NextResponse.json(allProperties, { status: 200 })
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
