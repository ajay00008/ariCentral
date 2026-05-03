'use client'

import * as React from 'react'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { LoaderSpinner } from '../Spinners/LoaderSpinner'
import { ProgressBar } from '@/components/ProgressBar/ProgressBar'
import { stripeConfirmSetupIntent, stripeSetupIntent } from '@/app/actions'
import { useAlertProvider } from '@/providers/AlertProvider'

interface StripeFormProps {
  publicUrl: string
}

export function StripeForm ({ publicUrl }: StripeFormProps): React.ReactNode {
  const searchParams = useSearchParams()
  const { setAlertMessage } = useAlertProvider()
  const stripe = useStripe()
  const elements = useElements()
  const [loading, setLoading] = React.useState(false)
  const setupIntent = searchParams.get('setup_intent')
  const subscriptionId = searchParams.get('subscription_id')
  const redirectStatus = searchParams.get('redirect_status')
  const [verifying, setVerifying] = React.useState(false)
  const [subscriptionType, setSubscriptionType] = React.useState<'monthly' | 'annual'>('monthly')

  async function handleSubmit (e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    setLoading(true)
    if (stripe === null || elements === null) {
      throw new Error('Stripe Elements are not initialized')
    }

    const { error: submitError } = await elements.submit()

    if (submitError !== undefined) {
      if (submitError.message !== undefined) {
        setAlertMessage(submitError.message, false)
        setLoading(false)
      }
      return
    }

    const data = await stripeSetupIntent(subscriptionType)
    const { error: confirmError } = await stripe.confirmSetup({
      elements,
      clientSecret: data.clientSecret,
      confirmParams: {
        return_url: `${publicUrl}/search?subscription_id=${data.subscriptionId}`
      },
      redirect: 'always'
    })

    if (confirmError !== undefined) {
      if (confirmError.message !== undefined) {
        setAlertMessage(confirmError.message, false)
        setLoading(false)
      }
    }
  }

  React.useEffect(() => {
    async function verifySetupIntent (): Promise<void> {
      setVerifying(true)
      if (subscriptionId === null) {
        setVerifying(false)
        setAlertMessage('Invalid setup intent or subscription ID.', false)
        setLoading(false)
        return
      }

      const response = await stripeConfirmSetupIntent(setupIntent, subscriptionId)

      if (!response.success) {
        setVerifying(false)
        setAlertMessage('Unable to verify Stripe setup intent. Please try again.', false)
        setLoading(false)
        return
      }

      window.location.href = '/search'
    }

    if (!verifying && redirectStatus === 'succeeded') {
      void verifySetupIntent()
    }
  }, [verifying, setupIntent, redirectStatus])

  return (
    <div className='w-auto  rounded-lg'>
      <div className='smobile:block smobile:h-auto tablet:hidden tablet:h-0'>
        <ProgressBar percentage={100} />
      </div>
      <Card className='smobile:w-full smobile:py-[40px] z-50 smobile:px-[16px] tablet:px-[32px] mb-10 smobile:bg-white smobile:border-0 tablet:relative top-0 tablet:top-[50%] tablet:left-[50%] tablet:translate-center tablet:max-w-[445px] tablet:overflow-hidden'>
        <div className='smobile:hidden smobile:h-0 tablet:block tablet:h-auto'>
          <ProgressBar percentage={100} isAuth />
        </div>
        <CardHeader className='smobile:p-0 smobile:mb-[23px] tablet:mb-[42px] smobile:w-full smobile:text-center'>
          <CardTitle className='smobile:font-mundialRegular smobile:leading-[1] smobile:text-[28px] smobile:font-normal desktop:text-[32px] smobile:margin-0'>
            Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className='p-0'>
          <form
            className='smobile:grid smobile:gap-[24px]'
            onSubmit={(e) => {
              void handleSubmit(e)
            }}
          >
            {!verifying && (
              <>
                <div className='flex flex-col gap-4'>
                  <label className='flex items-center gap-2'>
                    <input
                      type='radio'
                      name='subscription'
                      value='monthly'
                      checked={subscriptionType === 'monthly'}
                      onChange={() => setSubscriptionType('monthly')}
                    />
                    <span>Ari Monthly Subscription - $99 USD</span>
                  </label>
                  <label className='flex items-center gap-2'>
                    <input
                      type='radio'
                      name='subscription'
                      value='annual'
                      checked={subscriptionType === 'annual'}
                      onChange={() => setSubscriptionType('annual')}
                    />
                    <span>Ari Annual Subscription - $990 USD (10 months @ $99/mth)</span>
                  </label>
                </div>
                <p className='text-md text-orange'>*Free for the first 90 days, cancel anytime.</p>
                <PaymentElement />
              </>
            )}
            {verifying && <LoaderSpinner width={40} height={40} />}
            {!verifying && (
              <Button
                disabled={loading}
                type='submit'
                className='w-full h-auto py-[17px] min-h-[56px] bg-orange font-mundialRegular text-customWhite font-normal text-[20px] leading-[1] disabled:opacity-50'
              >
                Start Free Trial
              </Button>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
