import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { Codes } from '@/constants/code-errors'
import { authOptions } from '../../auth/[...nextauth]/options'
import { fetchAPI } from '@/api/fetch-api'
import { stripe } from '@/lib/stripe'

export async function POST (request: NextRequest): Promise<NextResponse> {
  try {
    const session: SessionType | null = await getServerSession(authOptions)
    const sessionUser = session?.user ?? null
    const sessionToken = sessionUser?.access_token ?? null

    if (sessionUser === null || sessionToken === null) {
      return NextResponse.json({ message: 'Session does not exist' }, { status: 503 })
    }

    const { setupIntent: setupIntentId, subscriptionId } = await request.json()

    if (!z.string().safeParse(setupIntentId).success) {
      return NextResponse.json({ message: 'setupIntent is required and should be a string.' }, { status: 400 })
    }

    if (!z.string().safeParse(subscriptionId).success) {
      return NextResponse.json({ message: 'subscriptionId is required and should be a string.' }, { status: 400 })
    }

    const customerId = sessionUser.stripeCustomerId ?? ''

    if (customerId === '') {
      return NextResponse.json({
        message: 'User has no customer setup.',
        success: false
      }, { status: 400 })
    }

    const setupIntent = await stripe.setupIntents.retrieve(setupIntentId)
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    if (setupIntent.status !== 'succeeded' || setupIntent.customer !== customerId) {
      return NextResponse.json({
        message: 'Invalid setup intent.',
        success: false
      }, { status: 400 })
    }

    if (subscription.customer !== customerId) {
      return NextResponse.json({ message: 'Invalid subscription.', success: false }, { status: 400 })
    }

    if (subscription.status !== 'active' && subscription.status !== 'trialing') {
      return NextResponse.json({ message: 'Subscription is not active.', success: false }, { status: 400 })
    }

    await fetchAPI(`/api/users/${String(sessionUser.id)}`, {
      method: 'PUT',
      token: sessionToken,
      fields: {
        stripeSetupIntentSuccessful: true,
        subscriptionStatus: true,
        subscriptionId
      }
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    Sentry.captureException(err)

    return NextResponse.json({
      code: Codes.INTERNAL_SERVER_ERROR.code,
      message: Codes.INTERNAL_SERVER_ERROR.message
    }, { status: 500 })
  }
}
