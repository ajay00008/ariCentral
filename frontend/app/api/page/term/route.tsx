import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { Codes } from '@/constants/code-errors'
import { fetchAPI } from '@/api/fetch-api'

export const dynamic = 'force-dynamic'

export async function GET (): Promise<NextResponse> {
  try {
    const response: Response = await fetchAPI(
      '/api/pages?filters[Slug][$eq]=terms&pagination[pageSize]=100&populate=deep',
      {
        method: 'GET',
        token: undefined
      },
      false,
      true
    )

    const data = await response.json()
    const pageData: ActionGetDynamicPageBySlug[] = data.data?.[0]?.attributes

    return NextResponse.json(pageData, { status: 200 })
  } catch (err) {
    Sentry.captureException(err)
    return NextResponse.json(
      {
        code: Codes.INTERNAL_SERVER_ERROR.code,
        err: Codes.INTERNAL_SERVER_ERROR.message
      },
      { status: 500 }
    )
  }
}
