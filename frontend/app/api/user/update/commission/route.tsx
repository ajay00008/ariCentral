import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { z } from 'zod'
import { Codes } from '@/constants/code-errors'
import { fetchAPI } from '@/api/fetch-api'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'

export async function POST (request: Request): Promise<NextResponse<APIAdminLoginResult>> {
  try {
    const { isShow }: { isShow: boolean } = await request.json()
    const isShowCheck = z.boolean()

    if (typeof isShow === 'undefined') {
      return NextResponse.json({ message: 'isShow body parameter is required.' }, { status: 400 })
    }

    if (!isShowCheck.safeParse(isShow).success) {
      return NextResponse.json({ message: 'IsShow should be boolean.' }, { status: 400 })
    }

    const session: SessionType | null = await getServerSession(authOptions)
    const userId = session?.user?.id ?? ''
    const sessionToken = session?.user?.access_token ?? ''
    if (userId === '' || sessionToken === '') return NextResponse.json({ message: 'Please, use our official application' }, { status: 503 })

    const response: Response = await fetchAPI(`/api/users/${userId}`, {
      method: 'PUT',
      token: sessionToken,
      fields: JSON.stringify({
        showCommission: isShow
      })
    }, false, true)

    const updatedUser = await response.json()
    return NextResponse.json(updatedUser, { status: 200 })
  } catch (err) {
    Sentry.captureException(err)
    return NextResponse.json({
      code: Codes.INTERNAL_SERVER_ERROR.code,
      message: Codes.INTERNAL_SERVER_ERROR.message
    }, { status: 500 })
  }
}
