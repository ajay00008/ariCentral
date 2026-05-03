import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { Codes } from '@/constants/code-errors'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { z } from 'zod'
import { updateUserRegisteredUpdates } from '@/app/actions'

export async function POST (request: NextRequest): Promise<NextResponse> {
  try {
    const { data } = await request.json()
    const { slug, name }: { slug: string, name: string } = data

    if (!z.string().min(1).safeParse(slug).success) {
      return NextResponse.json({ message: 'Slug is required and should be a string.' }, { status: 400 })
    }

    if (!z.string().min(1).safeParse(name).success) {
      return NextResponse.json({ message: 'Name is required and should be a string.' }, { status: 400 })
    }

    const session: SessionType | null = await getServerSession(authOptions)
    if (session === null) return NextResponse.json({ message: 'You are not authenticated' }, { status: 503 })

    if (typeof process.env.WEBHOOK_REGISTER_FOR_UPDATES !== 'string') {
      return NextResponse.json({ message: 'Webhook address is missing', success: false }, { status: 400 })
    }

    const webhookData = {
      property_id: slug,
      property_name: name,
      property_slug: slug,
      user_email: session?.user?.email,
      user_first_name: session?.user?.firstName,
      user_last_name: session?.user?.surname
    }

    const response = await fetch(process.env.WEBHOOK_REGISTER_FOR_UPDATES, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(webhookData)
    })

    if (response.status < 200 || response.status >= 300) {
      return NextResponse.json({ message: 'Failed to communicate with webhook service', success: false }, { status: 400 })
    }

    const updateResult = await updateUserRegisteredUpdates(slug)
    if (updateResult === null) {
      return NextResponse.json({ message: 'Failed to update user registered updates', success: false }, { status: 400 })
    }

    return NextResponse.json({ message: 'Registered successfully for updates', success: true }, { status: 200 })
  } catch (err) {
    Sentry.captureException(err)

    return NextResponse.json({
      code: Codes.INTERNAL_SERVER_ERROR.code,
      message: Codes.INTERNAL_SERVER_ERROR.message
    }, { status: 500 })
  }
}
