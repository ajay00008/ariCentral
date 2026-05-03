import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { Codes } from '@/constants/code-errors'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { fetchAPI } from '@/api/fetch-api'
import { z } from 'zod'

export async function POST (request: Request): Promise<NextResponse> {
  try {
    const json = await request.json()
    const { id, fieldValue }: { id: number, fieldValue: boolean } = json.data

    const idZodCheck = z.number()
    const fieldValueCheck = z.boolean()

    if (typeof id === 'undefined') {
      return NextResponse.json({ message: 'id body parameter is required.' }, { status: 400 })
    } else
      if (typeof fieldValue === 'undefined') {
        return NextResponse.json({ message: 'fieldValue body parameter is required.' }, { status: 400 })
      }

    if (!idZodCheck.safeParse(id).success) {
      return NextResponse.json({ message: 'Id body parameter should be number.' }, { status: 400 })
    } else if (!fieldValueCheck.safeParse(fieldValue).success) {
      return NextResponse.json({ message: 'FieldValue body parameter should be booleans.' }, { status: 400 })
    }

    const session: SessionType | null = await getServerSession(authOptions)
    const sessionToken = session?.user?.access_token ?? ''
    if (sessionToken === '') return NextResponse.json({ message: 'Please, use our official application' }, { status: 503 })

    const checkAmountResponse: Response = await fetchAPI('/api/properties?populate=deep&filters[Featured]=true', {
      method: 'GET',
      token: sessionToken,
      fields: undefined
    }, false, true)

    const amountResponse = await checkAmountResponse.json()
    if (amountResponse.data !== null && amountResponse.data !== undefined && amountResponse.data.length !== 0 && fieldValue) {
      if (amountResponse.data.length >= 4) {
        return NextResponse.json({ message: 'Featured properties has reached its max 4 value.' }, { status: 200 })
      }
    }

    const response: Response = await fetchAPI(`/api/properties/${id}`, {
      method: 'PUT',
      token: sessionToken,
      fields: JSON.stringify({
        data: {
          Featured: fieldValue
        }
      })
    }, false, true)

    if (response.ok) {
      const serverRes = await response.json()
      return NextResponse.json(serverRes, { status: 200 })
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
