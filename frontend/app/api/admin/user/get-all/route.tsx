import { type NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { Codes } from '@/constants/code-errors'
import { fetchAPI } from '@/api/fetch-api'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

export async function GET (request: NextRequest): Promise<NextResponse<ActionUserSearchParams | APIError>> {
  try {
    const session: SessionType | null = await getServerSession(authOptions)
    const sessionToken = session?.user?.access_token ?? ''
    if (sessionToken === '') return NextResponse.json({ message: 'Please, use our official application' }, { status: 503 })

    const { searchParams } = new URL(request.url)
    const page = searchParams.get('page')
    const pageSize = '50'

    if (page === null || !z.string().min(1).safeParse(page).success) {
      return NextResponse.json({ message: 'Invalid page parameter' }, { status: 400 })
    }

    const response: Response = await fetchAPI(`/api/users?populate=role&pagination[page]=${page}&pagination[pageSize]=${pageSize}&pagination[withCount]=true`, { token: sessionToken }, false, true)

    if (response.ok) {
      const paginatedUsers = await response.json()
      return NextResponse.json(paginatedUsers, { status: 200 })
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
