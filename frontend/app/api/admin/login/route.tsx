import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { z } from 'zod'
import isEmail from 'validator/lib/isEmail'
import { Codes } from '@/constants/code-errors'
import { fetchAPI } from '@/api/fetch-api'

export async function POST (request: Request): Promise<NextResponse<APIAdminLoginResult>> {
  try {
    const { identifier, password }: { identifier: string, password: string } = await request.json()

    const emailCheck = z.string().refine(isEmail)
    const passwordCheck = z.string().min(6).max(255)

    if (typeof identifier === 'undefined') {
      return NextResponse.json({ message: 'identifier body parameter is required.' }, { status: 400 })
    } else if (typeof password === 'undefined') {
      return NextResponse.json({ message: 'password body parameter is required.' }, { status: 400 })
    }

    if (!emailCheck.safeParse(identifier).success) {
      return NextResponse.json({ message: 'Identifier should be valid string email.' }, { status: 400 })
    } else if (!passwordCheck.safeParse(password).success) {
      return NextResponse.json({ message: 'Password should be string. Minimum length should be 6 chars.' }, { status: 400 })
    }

    const response: Response = await fetchAPI('/api/auth/local', {
      method: 'POST',
      fields: JSON.stringify({
        identifier,
        password
      })
    }, false, true)
    const basicUser: APIAdminLoginResult['newUser'] = await response.json()
    console.log(basicUser , 'basicUser')
    if (basicUser?.error?.message === 'Your account has been blocked by an administrator') {
      return NextResponse.json({
        code: basicUser.error.status,
        message: basicUser.error.message
      }, { status: basicUser.error.status })
    } else if (basicUser?.error?.message === 'Invalid identifier or password') {
      return NextResponse.json({
        code: basicUser.error.status,
        message: basicUser.error.message
      }, { status: basicUser.error.status })
    }

    const userJWT = (basicUser as Authentication).jwt
    const userID = (basicUser as Authentication).user.id.toString()

    const response2: Response = await fetchAPI(`/api/users/${userID}?populate=deep`, {
      method: 'GET',
      token: userJWT
    }, false, true)
    const res2 = await response2.json()
    console.log(res2 , 'res2',response2.ok)

    if (!response2.ok) {
      return NextResponse.json({
        code: response2.status,
        message: response2.statusText
      }, { status: response2.status })
    }

    
    const newUser: APIAdminLoginResult['newUser'] = {
      ...(basicUser as Authentication),
      user: {
        ...(basicUser as Authentication).user,
        role: res2.role.name
      }
    }
    return NextResponse.json({ newUser }, { status: 200 })
  } catch (err:any) {
    console.log(err.message , 'err.message')
    Sentry.captureException(err)
    return NextResponse.json({
      code: Codes.INTERNAL_SERVER_ERROR.code,
      message: Codes.INTERNAL_SERVER_ERROR.message
    }, { status: 500 })
  }
}
