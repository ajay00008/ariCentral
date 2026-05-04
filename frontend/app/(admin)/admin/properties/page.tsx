import * as React from 'react'
import { Metadata } from 'next'
import { Header } from '@/components/Header/Header'
import { PropertyMain } from '@/components/AdminMainComponents/PropertyMain'
import { AlertProvider } from '@/providers/AlertProvider'

export const dynamic = 'force-dynamic'

export function generateMetadata (): Metadata {
  return {
    title: 'walkerwholesale Admin - Properties',
    robots: {
      index: false,
      follow: false
    }
  }
}

export default function Page (): React.ReactNode {
  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <AlertProvider>
          <PropertyMain />
        </AlertProvider>
      </main>
    </>
  )
}
