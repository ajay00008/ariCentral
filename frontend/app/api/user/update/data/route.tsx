import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { z } from 'zod'
import isEmail from 'validator/lib/isEmail'
import { Codes } from '@/constants/code-errors'
import { fetchAPI } from '@/api/fetch-api'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'

export async function POST (request: Request): Promise<NextResponse<APIAdminLoginResult>> {
  try {
    const {
      email,
      firstName,
      surname,
      phone,
      companyName
    }: {
      email: string
      firstName: string
      surname: string
      phone: string
      companyName: string
    } = await request.json()

    const emailCheck = z.string().refine(isEmail)
    const firstNameCheck = z.string().max(255)
    const surnameCheck = z.string().max(255)
    const phoneCheck = z.string().max(255)
    const companyNameCheck = z.string().max(255)

    if (typeof email === 'undefined') {
      return NextResponse.json({ message: 'email body parameter is required.' }, { status: 400 })
    } else if (typeof firstName === 'undefined') {
      return NextResponse.json({ message: 'firstName body parameter is required.' }, { status: 400 })
    } else if (typeof surname === 'undefined') {
      return NextResponse.json({ message: 'surname body parameter is required.' }, { status: 400 })
    } else if (typeof phone === 'undefined') {
      return NextResponse.json({ message: 'phone body parameter is required.' }, { status: 400 })
    } else if (typeof companyName === 'undefined') {
      return NextResponse.json({ message: 'companyName body parameter is required.' }, { status: 400 })
    }

    if (!emailCheck.safeParse(email).success) {
      return NextResponse.json({ message: 'Email should be valid string email.' }, { status: 400 })
    } else if (!firstNameCheck.safeParse(firstName).success) {
      return NextResponse.json({ message: 'FirstName should be string.' }, { status: 400 })
    } else if (!surnameCheck.safeParse(surname).success) {
      return NextResponse.json({ message: 'Surname should be string.' }, { status: 400 })
    } else if (!phoneCheck.safeParse(phone).success) {
      return NextResponse.json({ message: 'Phone should be string.' }, { status: 400 })
    } else if (!companyNameCheck.safeParse(companyName).success) {
      return NextResponse.json({ message: 'CompanyName should be string.' }, { status: 400 })
    }

    const session: SessionType | null = await getServerSession(authOptions)
    const userId = session?.user?.id ?? ''
    const sessionToken = session?.user?.access_token ?? ''
    if (userId === '' || sessionToken === '') return NextResponse.json({ message: 'Please, use our official application' }, { status: 503 })

    const response: Response = await fetchAPI(`/api/users/${userId}`, {
      method: 'PUT',
      token: sessionToken,
      fields: JSON.stringify({
        email,
        surname,
        phone,
        companyName,
        firstName
      })
    }, false, true)

    const updatedUser = await response.json()
    return NextResponse.json(updatedUser, { status: 200 })
  } catch (err) {
    Sentry.captureException(err)
    return NextResponse.json({
      code: Codes.INTERNAL_SERVER_ERROR.code,
      message: Codes.INTERNAL_SERVER_ERROR.message
    }, { status: 500 })
  }
}
