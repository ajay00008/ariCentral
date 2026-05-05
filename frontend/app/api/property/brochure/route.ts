import { type NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { getServerSession } from 'next-auth'
import { Codes } from '@/constants/code-errors'
import { fetchAPI } from '@/api/fetch-api'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { z } from 'zod'
import { isPublicPropertiesEnabled } from '@/lib/public-properties'

export const dynamic = 'force-dynamic'

const schema = z.object({
  slug: z.string()
})

export async function GET (request: NextRequest): Promise<NextResponse> {
  try {
    const allowPublicProperties = isPublicPropertiesEnabled()
    const session: SessionType | null = await getServerSession(authOptions)
    const sessionToken = session?.user?.access_token ?? ''
    if (!allowPublicProperties && sessionToken === '') return NextResponse.json({ message: 'Please, use our official application' }, { status: 503 })

    const result = await schema.safeParseAsync(Object.fromEntries(request.nextUrl.searchParams))

    if (!result.success) {
      return NextResponse.json({ message: 'Schema validation failed' }, { status: 400 })
    }

    const response: Response = await fetchAPI(
      `/api/properties?filters[Slug][$eq]=${result.data.slug.trim()}&populate=*`,
      { token: allowPublicProperties ? undefined : sessionToken }
    )

    if (!response.ok) {
      return NextResponse.json({
        code: response.status,
        message: response.statusText
      }, { status: response.status })
    }

    const jsonData = await response.json()

    if (jsonData.data[0]?.attributes === undefined) {
      return NextResponse.json({ message: 'Property not found' }, { status: 400 })
    }

    const property: StrapiPropertyProperty = jsonData.data[0]
    const data = property.attributes

    if (data.Brochure.data === null) {
      return NextResponse.json({ message: 'Property brochure not found' }, { status: 400 })
    }

    const brochure = data.Brochure.data.attributes
    const brochureStream = await fetch(brochure.url)

    return new NextResponse(brochureStream.body, {
      status: 200,
      headers: {
        'Content-Disposition': 'attachment',
        'Content-Type': brochure.mime
      }
    })
  } catch (err) {
    Sentry.captureException(err)
    return NextResponse.json({
      code: Codes.INTERNAL_SERVER_ERROR.code,
      err: Codes.INTERNAL_SERVER_ERROR.message
    }, { status: 500 })
  }
}
