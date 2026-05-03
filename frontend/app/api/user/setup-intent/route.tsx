import { Stripe } from 'stripe'
import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { getServerSession } from 'next-auth'
import { Codes } from '@/constants/code-errors'
import { authOptions } from '../../auth/[...nextauth]/options'
import { fetchAPI } from '@/api/fetch-api'
import { stripe } from '@/lib/stripe'
import { z } from 'zod'

export async function POST (request: Request): Promise<NextResponse> {
  try {
    const session: SessionType | null = await getServerSession(authOptions)
    const sessionUser = session?.user ?? null
    const sessionToken = sessionUser?.access_token ?? null

    if (sessionUser === null || sessionToken === null) {
      return NextResponse.json({ message: 'Session does not exist' }, { status: 503 })
    }

    let customerId = sessionUser.stripeCustomerId ?? ''

    if (customerId === '') {
      const params: Stripe.CustomerCreateParams = {
        address: {
          country: sessionUser.country ?? undefined
        },
        email: sessionUser.email ?? undefined,
        name: `${String(sessionUser.firstName)} ${String(sessionUser.surname)}`.trim(),
        phone: String(sessionUser.phone ?? '')
      }

      const customer = await stripe.customers.create(params)
      customerId = customer.id

      await fetchAPI(`/api/users/${String(sessionUser.id)}`, {
        method: 'PUT',
        token: sessionToken,
        fields: JSON.stringify({
          stripeCustomerId: customer.id
        })
      })
    }

    const setupIntent = await stripe.setupIntents.create({
      automatic_payment_methods: {
        enabled: true
      },
      customer: customerId
    })

    const { data } = await request.json()
    const { subscriptionType }: { subscriptionType: string } = data

    if (typeof subscriptionType === 'undefined') {
      return NextResponse.json({ message: 'subscriptionType body parameter is required.' }, { status: 400 })
    }

    const subscriptionTypeCheck = z.enum(['annual', 'monthly'])
    if (!subscriptionTypeCheck.safeParse(subscriptionType).success) {
      return NextResponse.json({ message: 'subscriptionType must be either "annual" or "monthly".' }, { status: 400 })
    }

    const productId = subscriptionType === 'monthly'
      ? process.env.STRIPE_MONTHLY_PRODUCT_ID
      : process.env.STRIPE_ANNUAL_PRODUCT_ID

    const prices = await stripe.prices.list({
      product: productId,
      active: true,
      limit: 1
    })

    if (prices?.data === null || prices.data.length === 0) {
      throw new Error(`No active prices found for product: ${String(productId)}`)
    }

    const priceId = prices.data[0].id

    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [
        {
          price: priceId
        }
      ],
      trial_period_days: 90
    })

    return NextResponse.json({
      clientSecret: setupIntent.client_secret,
      subscriptionId: subscription.id
    }, { status: 200 })
  } catch (err) {
    Sentry.captureException(err)
    return NextResponse.json({
      code: Codes.INTERNAL_SERVER_ERROR.code,
      message: Codes.INTERNAL_SERVER_ERROR.message
    }, { status: 500 })
  }
}
