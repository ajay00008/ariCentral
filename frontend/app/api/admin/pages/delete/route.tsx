import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { z } from 'zod'
import { Codes } from '@/constants/code-errors'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { fetchAPI } from '@/api/fetch-api'

export async function POST (request: Request): Promise<NextResponse<ActionCreateUser | APIError>> {
  try {
    const { data } = await request.json()
    const { pageId }: { pageId: string } = data
    const pageIdCheck = z.string()

    if (typeof pageIdCheck === 'undefined') {
      return NextResponse.json({ message: 'pageId body parameter is required.' }, { status: 400 })
    }

    if (!pageIdCheck.safeParse(pageId).success) {
      return NextResponse.json({ message: 'Page ID should be a string.' }, { status: 400 })
    }

    const session: SessionType | null = await getServerSession(authOptions)
    const sessionToken = session?.user?.access_token ?? ''
    if (sessionToken === '') return NextResponse.json({ message: 'Please, use our official application' }, { status: 503 })

    const response: Response = await fetchAPI(`/api/pages/${pageId}`, {
      method: 'DELETE',
      token: sessionToken,
      fields: undefined
    }, false, true)

    const deletedPage = await response.json()

    if (response.ok) {
      return NextResponse.json(deletedPage.data, { status: 200 })
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
