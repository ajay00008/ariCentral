import { type NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { getServerSession } from 'next-auth'
import { Codes } from '@/constants/code-errors'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { fetchAPI } from '@/api/fetch-api'
import { z } from 'zod'

export const dynamic = 'force-dynamic'

export async function GET (request: NextRequest): Promise<NextResponse> {
  try {
    const session = await getServerSession<{}, SessionType>(authOptions)
    const token = session?.user?.access_token ?? ''

    if (session === null || token === '') {
      return NextResponse.json({
        message: 'You are not authorized'
      }, { status: 503 })
    }

    const searchParams = request.nextUrl.searchParams
    const pageParam = searchParams.get('page')
    const pageSizeParam = searchParams.get('pageSize')

    const validStrNum = z.string().min(1)
    if (!validStrNum.safeParse(pageParam).success) {
      return NextResponse.json({ message: 'Invalid page parameter' }, { status: 400 })
    }
    if (!validStrNum.safeParse(pageSizeParam).success) {
      return NextResponse.json({ message: 'Invalid pageSize parameter' }, { status: 400 })
    }

    const page = pageParam as string
    const pageSize = pageSizeParam as string
    const response = await fetchAPI<Response>(`/api/access-requests?populate[Property]=true&populate[User]=true&sort[0]=createdAt:desc&pagination[page]=${page}&pagination[pageSize]=${pageSize}&pagination[withCount]=true`, {
      method: 'GET',
      token
    }, false, true)

    if (!response.ok) {
      return NextResponse.json({
        code: response.status,
        message: response.statusText
      }, { status: response.status })
    }

    const data = await response.json()

    return NextResponse.json(data)
  } catch (err) {
    Sentry.captureException(err)
    return NextResponse.json({
      code: Codes.INTERNAL_SERVER_ERROR.code,
      err: Codes.INTERNAL_SERVER_ERROR.message
    }, { status: 500 })
  }
}

export async function POST (request: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession<{}, SessionType>(authOptions)
    const token = session?.user?.access_token ?? ''

    if (session === null || token === '') {
      return NextResponse.json({
        message: 'You are not authorized'
      }, { status: 503 })
    }

    const { data } = await request.json()
    const { id, action }: { id: number, action: 'approve' | 'reject' | 'revoke' } = data

    const response = await fetchAPI<Response>(`/api/access-requests/${id}/${action}`, {
      method: 'POST',
      token
    }, false, true)

    if (!response.ok) {
      return NextResponse.json({
        code: response.status,
        message: response.statusText
      }, { status: response.status })
    }

    return NextResponse.json({
      message: `Request ${action}d successfully`,
      success: true
    })
  } catch (err) {
    Sentry.captureException(err)
    return NextResponse.json({
      code: Codes.INTERNAL_SERVER_ERROR.code,
      err: Codes.INTERNAL_SERVER_ERROR.message
    }, { status: 500 })
  }
}
