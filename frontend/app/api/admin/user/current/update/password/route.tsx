import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { Codes } from '@/constants/code-errors'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { fetchAPI } from '@/api/fetch-api'
import { z } from 'zod'

export async function POST (request: Request): Promise<NextResponse<CreatedUser | APIError>> {
  try {
    const { data } = await request.json()
    const {
      oldPassword,
      newPassword,
      newPasswordConfirmed
    }: {
      oldPassword: string
      newPassword: string
      newPasswordConfirmed: string
    } = data
    const oldPasswordZodCheck = z.string()
    const newPasswordZodCheck = z.string()
    const newPasswordConfirmedZodCheck = z.string()

    if (typeof oldPassword === 'undefined') {
      return NextResponse.json({ message: 'oldPassword body parameter is required.' }, { status: 400 })
    } else if (typeof newPassword === 'undefined') {
      return NextResponse.json({ message: 'newPassword body parameter is required.' }, { status: 400 })
    } else if (typeof newPasswordConfirmed === 'undefined') {
      return NextResponse.json({ message: 'newPasswordConfirmed body parameter is required.' }, { status: 400 })
    }

    if (!oldPasswordZodCheck.safeParse(oldPassword).success) {
      return NextResponse.json({ message: 'OldPassword body parameter should be string.' }, { status: 400 })
    } else if (!newPasswordZodCheck.safeParse(newPassword).success) {
      return NextResponse.json({ message: 'NewPassword body parameter should be string.' }, { status: 400 })
    } else if (!newPasswordConfirmedZodCheck.safeParse(newPasswordConfirmed).success) {
      return NextResponse.json({ message: 'NewPasswordConfirmed body parameter should be string.' }, { status: 400 })
    }

    const session: SessionType | null = await getServerSession(authOptions)
    const sessionToken = session?.user?.access_token ?? ''
    if (sessionToken === '') return NextResponse.json({ message: 'Please, use our official application' }, { status: 503 })

    const response: Response = await fetchAPI('/api/auth/change-password', {
      method: 'POST',
      token: sessionToken,
      fields: JSON.stringify({
        currentPassword: oldPassword,
        password: newPassword,
        passwordConfirmation: newPasswordConfirmed
      })
    }, false, true)

    if (response.ok) {
      const updatedUser = await response.json()
      return NextResponse.json(updatedUser, { status: 200 })
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
