import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { z } from 'zod'
import isEmail from 'validator/lib/isEmail'
import { Codes } from '@/constants/code-errors'
import { fetchAPI } from '@/api/fetch-api'

export async function POST (request: Request): Promise<NextResponse> {
  try {
    const { email }: { email: string } = await request.json()

    const emailCheck = z.string().refine(isEmail)

    if (typeof email === 'undefined') {
      return NextResponse.json({ message: 'email body parameter is required.' }, { status: 400 })
    }

    if (!emailCheck.safeParse(email).success) {
      return NextResponse.json({ message: 'Email should be valid string email.' }, { status: 400 })
    }

    const response: Response = await fetchAPI('/api/email-exist', {
      method: 'POST',
      token: undefined,
      fields: JSON.stringify({
        email
      })
    }, false, true)

    if (response.ok) {
      const res = await response.json()
      return NextResponse.json(res, { status: 200 })
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
      message: Codes.INTERNAL_SERVER_ERROR.message
    }, { status: 500 })
  }
}
