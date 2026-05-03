'use client'

import * as React from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { Stripe, StripeElementsOptions, loadStripe } from '@stripe/stripe-js'

const stripeOptions: StripeElementsOptions = {
  mode: 'setup',
  setupFutureUsage: 'off_session',
  currency: 'aud'
}

interface ElementsProviderProps {
  children: React.ReactNode
}

export function ElementsProvider ({ children }: Readonly<ElementsProviderProps>): React.ReactNode {
  const [stripePromise, setStripePromise] = React.useState<Promise<Stripe | null> | null>(null)

  React.useEffect(() => {
    const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
    setStripePromise(stripePromise)
  }, [])

  return (
    <Elements stripe={stripePromise} options={stripeOptions}>
      {children}
    </Elements>
  )
}
