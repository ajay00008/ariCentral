import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import omit from 'lodash.omit'
import { z } from 'zod'
import isEmail from 'validator/lib/isEmail'
import { Codes } from '@/constants/code-errors'
import { fetchAPI } from '@/api/fetch-api'

export async function POST (request: Request): Promise<NextResponse<APIAdminLoginResult>> {
  try {
    const {
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
      marketsOfInterest
    }: {
      email: string
      password: string
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
      marketsOfInterest: string[]
    } = await request.json()

    const emailCheck = z.string().refine(isEmail)
    const passwordCheck = z.string().min(6).max(255)
    const firstNameCheck = z.string().max(255)
    const surnameCheck = z.string().max(255)
    const phoneCheck = z.string().max(255)
    const addressCheck = z.string().max(255)
    const companyNameCheck = z.string().max(255)
    const countryCheck = z.string()
    const howDidYouHearCheck = z.string()
    const bestDescribeCheck = z.string()
    const marketsOfInterestCheck = z.array(z.object({ Item: z.string() }))

    if (typeof email === 'undefined') {
      return NextResponse.json({ message: 'email body parameter is required.' }, { status: 400 })
    } else if (typeof password === 'undefined') {
      return NextResponse.json({ message: 'password body parameter is required.' }, { status: 400 })
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
    } else if (typeof marketsOfInterest === 'undefined') {
      return NextResponse.json({ message: 'marketsOfInterest body parameter is required.' }, { status: 400 })
    }

    if (!emailCheck.safeParse(email).success) {
      return NextResponse.json({ message: 'Email should be valid string email.' }, { status: 400 })
    } else if (!passwordCheck.safeParse(password).success) {
      return NextResponse.json({ message: 'Password should be string, and must contain min 6 characters in it.' }, { status: 400 })
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
    } else if (!marketsOfInterestCheck.safeParse(marketsOfInterest).success) {
      return NextResponse.json({ message: 'Markets Of Interest should be an array of strings.' }, { status: 400 })
    }

    if (!z.string().safeParse(avgSalesPrice).success) {
      return NextResponse.json({ message: 'avgSalesPrice is required and should be a string.' }, { status: 400 })
    }

    if (!z.string().safeParse(introduced).success) {
      return NextResponse.json({ message: 'introduced is required and should be a string.' }, { status: 400 })
    }

    const customResponse: Response = await fetchAPI('/api/users-permissions/roles', {
      method: 'GET',
      token: undefined
    }, false, true)

    const allRoles: StrapiRolesArray = await customResponse.json()
    const userRoleID = allRoles.roles.find(it => it.name === 'Authenticated')?.id
    const usernameText = `${firstName} ${surname}`.slice(0, 250)
    const usernameId = Math.floor(Math.random() * 9001) + 1000

    const authLocalRegisterPayload = {
      username: `${usernameText} ${usernameId}`,
      confirmed: false,
      email,
      password,
      surname,
      phone,
      address,
      companyName,
      firstName,
      country,
      howDidYouHear,
      bestDescribe,
      avgSalesPrice,
      introduced,
      subscriptionId: '',
      stripeCustomerId: '',
      subscriptionStatus: false,
      stripeSetupIntentSuccessful: false,
      marketsOfInterest
    }

    const response: Response = await fetchAPI('/api/auth/local/register', {
      method: 'POST',
      token: undefined,
      fields: JSON.stringify(authLocalRegisterPayload)
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

    const userData: Authentication = await response.json()
    const userJWT = userData.jwt
    const userID = userData.user.id

    const response2: Response = await fetchAPI(`/api/users/${userID}`, {
      method: 'PUT',
      token: userJWT,
      fields: JSON.stringify({
        confirmed: true,
        role: {
          connect: [{ id: userRoleID }],
          disconnect: []
        }
      })
    }, false, true)

    if (!response2.ok) {
      return NextResponse.json({
        code: response2.status,
        message: response2.statusText
      }, { status: response2.status })
    }

    // const response3: Response = await fetchAPI('/api/send-pending', {
    //   method: 'POST',
    //   token: undefined,
    //   fields: JSON.stringify({
    //     userName: firstName,
    //     email
    //   })
    // }, false, true)

    // if (!response3.ok) {
    //   return NextResponse.json({
    //     code: 404,
    //     message: 'Email sender has thrown error. Please, set permissions or adjust route.'
    //   }, { status: 404 })
    // }

    if (typeof process.env.WEBHOOK_SIGNUP_URL === 'string') {
      const webhookData = omit(authLocalRegisterPayload, [
        'confirmed',
        'stripeCustomerId',
        'stripeSetupIntentSuccessful',
        'password',
        'username',
        'subscriptionStatus',
        'subscriptionId'
      ])

      void fetch(process.env.WEBHOOK_SIGNUP_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(webhookData)
      })
    }

    const newUser = await response2.json()
    return NextResponse.json({ newUser }, { status: 200 })
  } catch (err) {
    Sentry.captureException(err)
    return NextResponse.json({
      code: Codes.INTERNAL_SERVER_ERROR.code,
      message: Codes.INTERNAL_SERVER_ERROR.message
    }, { status: 500 })
  }
}
