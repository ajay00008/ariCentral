import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { Codes } from '@/constants/code-errors'
import { fetchAPI } from '@/api/fetch-api'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'

export const dynamic = 'force-dynamic'

export async function GET (): Promise<NextResponse> {
  try {
    const session: SessionType | null = await getServerSession(authOptions)
    const sessionToken = session?.user?.access_token ?? ''
    if (sessionToken === '') return NextResponse.json({ message: 'Please, use our official application' }, { status: 503 })

    const response: Response = await fetchAPI('/api/faqs?populate=deep', {
      method: 'POST',
      token: sessionToken,
      fields: JSON.stringify({
        data: {
          collectionName: '',
          collectionItems: {}
        }
      })
    }, false, true)

    if (response.ok) {
      const faqCreatedElement = await response.json()
      return NextResponse.json(faqCreatedElement.data, { status: 200 })
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
