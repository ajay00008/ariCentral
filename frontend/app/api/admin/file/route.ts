import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { getServerSession } from 'next-auth'
import { Codes } from '@/constants/code-errors'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { fetchAPI } from '@/api/fetch-api'

export async function POST (request: Request): Promise<NextResponse> {
  try {
    const session = await getServerSession<{}, SessionType>(authOptions)
    const token = session?.user?.access_token ?? ''

    if (session === null || token === '') {
      return NextResponse.json({
        message: 'You are not authorized'
      }, { status: 503 })
    }

    const formData = await request.formData()
    const files = formData.getAll('files')

    if (files.length === 0) {
      return NextResponse.json({
        message: 'Files are not specified'
      }, { status: 400 })
    }

    const reqFormData = new FormData()

    for (let i = 0; i < files.length; i++) {
      reqFormData.append('files', files[i])
    }

    const response = await fetchAPI<Response>('/api/upload', {
      method: 'POST',
      token,
      fields: reqFormData
    }, false, true)

    if (!response.ok) {
      return NextResponse.json({
        code: response.status,
        message: response.statusText
      }, { status: response.status })
    }

    const data: Array<Record<string, any>> = await response.json()

    const result = data.map((item) => ({
      id: item.id,
      attributes: item
    }))

    return NextResponse.json(result)
  } catch (err) {
    Sentry.captureException(err)

    return NextResponse.json({
      code: Codes.INTERNAL_SERVER_ERROR.code,
      err: Codes.INTERNAL_SERVER_ERROR.message
    }, { status: 500 })
  }
}
