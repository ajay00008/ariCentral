import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { Codes } from '@/constants/code-errors'
import { fetchAPI } from '@/api/fetch-api'
import { z } from 'zod'

export async function POST (request: Request): Promise<NextResponse> {
  try {
    const { data } = await request.json()
    const { token }: { token: string } = data

    const tokenZodCheck = z.string()

    if (typeof token === 'undefined') {
      return NextResponse.json({ message: 'token body parameter is required.' }, { status: 400 })
    }

    if (!tokenZodCheck.safeParse(token).success) {
      return NextResponse.json({ message: 'Token body parameter should be string.' }, { status: 400 })
    }

    const response: Response = await fetchAPI('/api/check-token', {
      method: 'POST',
      token: undefined,
      fields: JSON.stringify({
        resToken: token
      })
    }, false, true)

    if (response.ok) {
      const resAnswer = await response.json()
      return NextResponse.json(resAnswer, { status: 200 })
    } else {
      const resAnswer = await response.json()
      return NextResponse.json({
        code: resAnswer.code,
        message: resAnswer.message
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
