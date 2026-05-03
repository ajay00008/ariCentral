'use client'

import * as React from 'react'
import * as Sentry from '@sentry/nextjs'
import NextError from 'next/error'

interface GlobalErrorProps {
  error: Error & {
    digest?: string
  }
}

export default function GlobalError ({ error }: Readonly<GlobalErrorProps>): React.ReactNode {
  React.useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html>
      <body>
        <NextError statusCode={0} />
      </body>
    </html>
  )
}
