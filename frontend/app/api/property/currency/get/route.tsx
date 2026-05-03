import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { Codes } from '@/constants/code-errors'
import { fetchAPI } from '@/api/fetch-api'

export const dynamic = 'force-dynamic'

export async function GET (): Promise<NextResponse> {
  try {
    const response: Response = await fetchAPI('/api/rate', {
      method: 'GET',
      token: undefined
    }, false, true)
    const data = await response.json()
    const currentCurrency = data.data.attributes

    if (response.ok) {
      return NextResponse.json(currentCurrency, { status: 200 })
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
