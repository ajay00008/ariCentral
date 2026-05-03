import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { Codes } from '@/constants/code-errors'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { fetchAPI } from '@/api/fetch-api'
import { z } from 'zod'

export async function POST (request: Request): Promise<NextResponse<ActionDeleteSingleFloor>> {
  try {
    const data = await request.json()
    const { collectionId }: { collectionId: number } = data.data

    const collectionIdIdZodCheck = z.number()

    if (typeof collectionId === 'undefined') {
      return NextResponse.json({ message: 'collectionId body parameter is required.' }, { status: 400 })
    }

    if (!collectionIdIdZodCheck.safeParse(collectionId).success) {
      return NextResponse.json({ message: 'CollectionId body parameter should be number.' }, { status: 400 })
    }

    const session: SessionType | null = await getServerSession(authOptions)
    const sessionToken = session?.user?.access_token ?? ''
    if (sessionToken === '') return NextResponse.json({ message: 'Please, use our official application' }, { status: 503 })

    const response: Response = await fetchAPI(`/api/faqs/${collectionId}`, {
      method: 'DELETE',
      fields: undefined,
      token: sessionToken
    }, false, true)

    if (response.ok) {
      const serverData = await response.json()
      return NextResponse.json({ serverData }, { status: 200 })
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
