import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { Codes } from '@/constants/code-errors'
import { fetchAPI } from '@/api/fetch-api'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { isPublicPropertiesEnabled } from '@/lib/public-properties'

export const dynamic = 'force-dynamic'

export async function GET (): Promise<NextResponse> {
  try {
    const allowPublicProperties = isPublicPropertiesEnabled()
    const session: SessionType | null = await getServerSession(authOptions)
    const sessionToken = session?.user?.access_token ?? ''
    if (!allowPublicProperties && sessionToken === '') return NextResponse.json({ message: 'Please, use our official application' }, { status: 503 })

    const response: Response = await fetchAPI('/api/properties?filters[Featured]=true&populate[0]=floors.units,ApprovedUsers,AccessRequests.User,HeroImage,HeroImages,HeroImages.Image', {
      token: allowPublicProperties ? undefined : sessionToken
    }, false, true)
    const data = await response.json()
    const allProperties: PropertyMain[] = data.data

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
