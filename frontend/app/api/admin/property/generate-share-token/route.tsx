import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { Codes } from '@/constants/code-errors'
import { fetchAPI } from '@/api/fetch-api'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

export async function POST (request: NextRequest): Promise<NextResponse> {
  try {
    const { data } = await request.json()
    const { slug }: { slug: string } = data

    if (!z.string().min(1).safeParse(slug).success) {
      return NextResponse.json({ message: 'Slug is required and should be a string.' }, { status: 400 })
    }

    const session: SessionType | null = await getServerSession(authOptions)
    const sessionToken = session?.user?.access_token ?? ''
    if (sessionToken === '') return NextResponse.json({ message: 'Please, use our official application' }, { status: 503 })

    const response: Response = await fetchAPI(`/api/property/${slug}/share`, {
      method: 'POST',
      token: sessionToken
    }, false, true)

    const res = await response.json()

    if (!response.ok) {
      return NextResponse.json({
        code: response.status,
        message: response.statusText
      }, { status: response.status })
    }

    return NextResponse.json({ success: true, shareToken: res?.shareToken }, { status: 200 })
  } catch (err) {
    Sentry.captureException(err)
    return NextResponse.json({
      code: Codes.INTERNAL_SERVER_ERROR.code,
      err: Codes.INTERNAL_SERVER_ERROR.message
    }, { status: 500 })
  }
}
