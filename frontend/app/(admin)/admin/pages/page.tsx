import * as React from 'react'
import { Metadata } from 'next'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { PagesMain } from '@/components/AdminMainComponents/PagesMain'
import { Header } from '@/components/Header/Header'
import { AlertProvider } from '@/providers/AlertProvider'
import { PageProvider } from '@/providers/PageProvider'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export async function generateMetadata (): Promise<Metadata> {
  const session: SessionType | null = await getServerSession(authOptions)
  if (session === null) notFound()
  return {
    title: 'AriCentral Admin - Pages',
    robots: {
      index: false,
      follow: false
    }
  }
}

export default async function Page (): Promise<React.ReactNode> {
  const session: SessionType | null = await getServerSession(authOptions)
  if (session === null) notFound()
  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <PageProvider>
          <AlertProvider>
            {session.user !== undefined && (
              <PagesMain />
            )}
          </AlertProvider>
        </PageProvider>
      </main>
    </>
  )
}
