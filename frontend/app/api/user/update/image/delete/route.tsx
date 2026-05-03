import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { Codes } from '@/constants/code-errors'
import { fetchAPI } from '@/api/fetch-api'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { z } from 'zod'

export async function POST (request: Request): Promise<NextResponse> {
  try {
    const json = await request.json()
    const { imageId }: { imageId: number } = json.data

    const imageIdZodCheck = z.number()

    if (typeof imageIdZodCheck === 'undefined') {
      return NextResponse.json({ message: 'imageId body parameter is required.' }, { status: 400 })
    }

    if (!imageIdZodCheck.safeParse(imageId).success) {
      return NextResponse.json({ message: 'ImageId body parameter should be number.' }, { status: 400 })
    }

    const session: SessionType | null = await getServerSession(authOptions)
    const sessionToken = session?.user?.access_token ?? ''
    if (sessionToken === '') return NextResponse.json({ message: 'Please, use our official application' }, { status: 503 })

    const response: Response = await fetchAPI(`/api/upload/files/${imageId}`, {
      method: 'DELETE',
      token: sessionToken
    }, false, true)

    if (response.ok) {
      const newGalleryData = await response.json()
      return NextResponse.json(newGalleryData, { status: 200 })
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
