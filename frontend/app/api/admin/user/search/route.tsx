import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { Codes } from '@/constants/code-errors'
import { fetchAPI } from '@/api/fetch-api'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import z from 'zod'

export const dynamic = 'force-dynamic'

function buildUserQueryString (filterParams: FilterParamsUserSearch): string {
  const urlParams = new URLSearchParams()

  for (const [key, value] of Object.entries(filterParams)) {
    if (
      value !== undefined &&
      value !== null &&
      value !== '' &&
      value !== 'Any'
    ) {
      if (key === 'mainQ') {
        const tokens = String(value).trim().split(/\s+/).filter(Boolean)
        if (tokens.length > 1) {
          tokens.forEach((token, idx) => {
            urlParams.append(`filters[$and][${idx}][$or][0][firstName][$containsi]`, token)
            urlParams.append(`filters[$and][${idx}][$or][1][surname][$containsi]`, token)
          })
        } else {
          urlParams.append('filters[$or][0][firstName][$containsi]', String(value))
          urlParams.append('filters[$or][1][surname][$containsi]', String(value))
          urlParams.append('filters[$or][2][email][$containsi]', String(value))
          urlParams.append('filters[$or][3][firstName][$startsWith]', String(value))
          urlParams.append('filters[$or][4][surname][$endsWith]', String(value))
        }
      } else if (key === 'roleId') {
        urlParams.append('filters[role][id][$eq]', String(value))
      } else {
        urlParams.append(`filters[${key}][$eq]`, String(value))
      }
    }
  }

  urlParams.append('populate', 'role')
  return urlParams.toString()
}

export async function POST (request: Request): Promise<NextResponse> {
  try {
    const { data } = await request.json()
    const {
      filterParams,
      page
    }: { filterParams: FilterParamsUserSearch, page: string } = data
    const session: SessionType | null = await getServerSession(authOptions)
    const sessionToken = session?.user?.access_token ?? ''
    if (sessionToken === '') {
      return NextResponse.json(
        { message: 'Please, use our official application' },
        { status: 503 }
      )
    }
    const queryString = buildUserQueryString(filterParams)
    const pageSize = '50'
    const params = new URLSearchParams(queryString)

    if (!z.string().min(1).safeParse(page).success) {
      return NextResponse.json(
        { message: 'Invalid page parameter' },
        { status: 400 }
      )
    }

    params.set('pagination[page]', page)
    params.set('pagination[pageSize]', pageSize)
    params.set('pagination[withCount]', 'true')
    const url = `/api/users?${params.toString()}`
    const response: Response = await fetchAPI(
      url,
      { token: sessionToken },
      false,
      true
    )

    if (response.ok) {
      const users = await response.json()
      return NextResponse.json(users, { status: 200 })
    } else {
      return NextResponse.json(
        {
          code: response.status,
          message: response.statusText
        },
        { status: response.status }
      )
    }
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
