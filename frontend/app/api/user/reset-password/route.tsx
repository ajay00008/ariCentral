import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { Codes } from '@/constants/code-errors'
import { fetchAPI } from '@/api/fetch-api'
import { z } from 'zod'

export async function POST (request: Request): Promise<NextResponse> {
  try {
    const { data } = await request.json()
    const { token, password }: { token: string, password: string } = data

    const tokenZodCheck = z.string()
    const newPasswordZodCheck = z.string().min(6).max(255)

    if (typeof token === 'undefined') {
      return NextResponse.json({ message: 'token body parameter is required.' }, { status: 400 })
    } else if (typeof password === 'undefined') {
      return NextResponse.json({ message: 'password body parameter is required.' }, { status: 400 })
    }

    if (!tokenZodCheck.safeParse(token).success) {
      return NextResponse.json({ message: 'Token body parameter should be string.' }, { status: 400 })
    } else if (!newPasswordZodCheck.safeParse(password).success) {
      return NextResponse.json({ message: 'Password body parameter should be string. Minimum length should be 6 chars.' }, { status: 400 })
    }

    const response: Response = await fetchAPI('/api/reset-password', {
      method: 'POST',
      token: undefined,
      fields: JSON.stringify({
        resToken: token,
        password
      })
    }, false, true)

    if (response.ok) {
      const resAnswer = await response.json()
      return NextResponse.json(resAnswer, { status: 200 })
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
