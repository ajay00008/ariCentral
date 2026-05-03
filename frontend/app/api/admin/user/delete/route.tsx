import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { Codes } from '@/constants/code-errors'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { fetchAPI } from '@/api/fetch-api'
import { z } from 'zod'

export async function POST (request: Request): Promise<NextResponse> {
  try {
    const { data } = await request.json()
    const { userId }: { userId: number } = data

    const userIdZodCheck = z.number()

    if (typeof userId === 'undefined') {
      return NextResponse.json({ message: 'userId body parameter is required.' }, { status: 400 })
    }

    if (!userIdZodCheck.safeParse(userId).success) {
      return NextResponse.json({ message: 'UserId body parameter should be number.' }, { status: 400 })
    }

    const session: SessionType | null = await getServerSession(authOptions)
    const sessionToken = session?.user?.access_token ?? ''
    if (sessionToken === '') return NextResponse.json({ message: 'Please, use our official application' }, { status: 503 })

    const response: Response = await fetchAPI(`/api/users/${userId}`, {
      method: 'DELETE',
      token: sessionToken,
      fields: undefined
    }, false, true)

    if (!response.ok) {
      return NextResponse.json({
        code: response.status,
        message: response.statusText
      }, { status: response.status })
    }

    const changedUser = await response.json()
    return NextResponse.json(changedUser, { status: 200 })
  } catch (err) {
    Sentry.captureException(err)
    return NextResponse.json({
      code: Codes.INTERNAL_SERVER_ERROR.code,
      err: Codes.INTERNAL_SERVER_ERROR.message
    }, { status: 500 })
  }
}
