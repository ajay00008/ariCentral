import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { z } from 'zod'
import isEmail from 'validator/lib/isEmail'
import { Codes } from '@/constants/code-errors'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { fetchAPI } from '@/api/fetch-api'

export async function POST (request: Request): Promise<NextResponse<ActionCreateUser | APIError>> {
  try {
    const { data } = await request.json()
    const {
      email,
      password,
      role,
      firstName,
      surname,
      phone,
      address,
      companyName,
      country,
      howDidYouHear,
      bestDescribe,
      avgSalesPrice,
      introduced
    }: {
      email: string
      password: string
      role: string
      firstName: string
      surname: string
      phone: string
      address: string
      companyName: string
      country: string
      howDidYouHear: string
      bestDescribe: string
      avgSalesPrice: string
      introduced: string
    } = data
    const emailCheck = z.string().refine(isEmail)
    const passwordCheck = z.string().min(6)
    const roleCheck = z.string()
    const firstNameCheck = z.string().max(255)
    const surnameCheck = z.string().max(255)
    const phoneCheck = z.string().max(255)
    const addressCheck = z.string().max(255)
    const companyNameCheck = z.string().max(255)
    const countryCheck = z.string()
    const howDidYouHearCheck = z.string()
    const bestDescribeCheck = z.string()

    if (typeof email === 'undefined') {
      return NextResponse.json({ message: 'email body parameter is required.' }, { status: 400 })
    } else if (typeof password === 'undefined') {
      return NextResponse.json({ message: 'password body parameter is required.' }, { status: 400 })
    } else if (typeof role === 'undefined') {
      return NextResponse.json({ message: 'role body parameter is required.' }, { status: 400 })
    } else if (typeof firstName === 'undefined') {
      return NextResponse.json({ message: 'firstName body parameter is required.' }, { status: 400 })
    } else if (typeof surname === 'undefined') {
      return NextResponse.json({ message: 'surname body parameter is required.' }, { status: 400 })
    } else if (typeof phone === 'undefined') {
      return NextResponse.json({ message: 'phone body parameter is required.' }, { status: 400 })
    } else if (typeof address === 'undefined') {
      return NextResponse.json({ message: 'address body parameter is required.' }, { status: 400 })
    } else if (typeof companyName === 'undefined') {
      return NextResponse.json({ message: 'companyName body parameter is required.' }, { status: 400 })
    } else if (typeof country === 'undefined') {
      return NextResponse.json({ message: 'country body parameter is required.' }, { status: 400 })
    } else if (typeof howDidYouHear === 'undefined') {
      return NextResponse.json({ message: 'howDidYouHear body parameter is required.' }, { status: 400 })
    } else if (typeof bestDescribe === 'undefined') {
      return NextResponse.json({ message: 'bestDescribe body parameter is required.' }, { status: 400 })
    }

    if (!emailCheck.safeParse(email).success) {
      return NextResponse.json({ message: 'Email is incorrect.' }, { status: 400 })
    } else if (!passwordCheck.safeParse(password).success) {
      return NextResponse.json({ message: 'Password body parameter should be string and contain min 6 characters.' }, { status: 400 })
    } else if (!roleCheck.safeParse(role).success) {
      return NextResponse.json({ message: 'Role should be string.' }, { status: 400 })
    } else if (!firstNameCheck.safeParse(firstName).success) {
      return NextResponse.json({ message: 'FirstName should be string.' }, { status: 400 })
    } else if (!surnameCheck.safeParse(surname).success) {
      return NextResponse.json({ message: 'Surname should be string.' }, { status: 400 })
    } else if (!phoneCheck.safeParse(phone).success) {
      return NextResponse.json({ message: 'Phone should be string.' }, { status: 400 })
    } else if (!addressCheck.safeParse(address).success) {
      return NextResponse.json({ message: 'Address should be string.' }, { status: 400 })
    } else if (!companyNameCheck.safeParse(companyName).success) {
      return NextResponse.json({ message: 'CompanyName should be string.' }, { status: 400 })
    } else if (!countryCheck.safeParse(country).success) {
      return NextResponse.json({ message: 'Country should be string.' }, { status: 400 })
    } else if (!howDidYouHearCheck.safeParse(howDidYouHear).success) {
      return NextResponse.json({ message: 'How Did You Hear should be string.' }, { status: 400 })
    } else if (!bestDescribeCheck.safeParse(bestDescribe).success) {
      return NextResponse.json({ message: 'Best Describe should be string.' }, { status: 400 })
    }

    if (!z.string().safeParse(avgSalesPrice).success) {
      return NextResponse.json({ message: 'avgSalesPrice is required and should be a string.' }, { status: 400 })
    }

    if (!z.string().safeParse(introduced).success) {
      return NextResponse.json({ message: 'introduced is required and should be a string.' }, { status: 400 })
    }

    const session: SessionType | null = await getServerSession(authOptions)
    const sessionToken = session?.user?.access_token ?? ''
    if (sessionToken === '') return NextResponse.json({ message: 'Please, use our official application' }, { status: 503 })

    const response: Response = await fetchAPI('/api/auth/local/register', {
      method: 'POST',
      token: sessionToken,
      fields: JSON.stringify({
        username: email.split('@')[0],
        email,
        password,
        firstName,
        surname,
        phone,
        address,
        companyName,
        country,
        howDidYouHear,
        bestDescribe,
        avgSalesPrice,
        introduced,
        confirmed: true,
        blocked: false,
        approved: true,
        subscriptionId: '',
        stripeCustomerId: '',
        subscriptionStatus: false,
        stripeSetupIntentSuccessful: false
      })
    }, false, true, true)

    if (!response.ok) {
      try {
        const data = await response.json()

        if (data?.error?.message === 'Email or Username are already taken') {
          return NextResponse.json({
            code: response.status,
            message: data.error.message
          }, { status: response.status })
        }
      } catch {
      }

      return NextResponse.json({
        code: response.status,
        message: response.statusText
      }, { status: response.status })
    }

    const newUser = await response.json()
    const newUserId = newUser.user.id

    const customResponse: Response = await fetchAPI('/api/users-permissions/roles', {
      method: 'GET',
      token: undefined
    }, false, true)

    const allRoles: StrapiRolesArray = await customResponse.json()
    const adminID = allRoles.roles.find(it => it.name === 'Admin')?.id
    const userRoleID = allRoles.roles.find(it => it.name === 'Authenticated')?.id
    const choosedRoleId = role === 'Admin' ? adminID : userRoleID

    await fetchAPI(`/api/users/${newUserId as string}`, {
      method: 'PUT',
      token: sessionToken,
      fields: JSON.stringify({
        role: {
          connect: [{ id: choosedRoleId }],
          disconnect: []
        }
      })
    }, false, true)

    const finished = true

    if (finished) {
      return NextResponse.json(newUser, { status: 200 })
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
