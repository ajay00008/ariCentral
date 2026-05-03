import * as React from 'react'
import { Metadata } from 'next'
import { Header } from '@/components/Header/Header'
import { AlertProvider } from '@/providers/AlertProvider'
import { ReportMain } from '@/components/AdminMainComponents/ReportMain'

export const dynamic = 'force-dynamic'

export function generateMetadata (): Metadata {
  return {
    title: 'AriCentral Admin - Properties',
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
          <ReportMain />
        </AlertProvider>
      </main>
    </>
  )
}
