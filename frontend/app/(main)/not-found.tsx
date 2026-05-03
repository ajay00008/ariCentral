import * as React from 'react'
import { Metadata } from 'next'
import { NotFoundComponent } from '@/components/NotFoundComponent/NotFoundComponent'

export function generateMetadata (): Metadata {
  return {
    title: '404 Not Found',
    robots: {
      index: false,
      follow: false
    }
  }
}

export default function NotFound (): React.ReactNode {
  return (
    <>
      <header />
      <main>
        <NotFoundComponent />
      </main>
      <footer />
    </>
  )
}
