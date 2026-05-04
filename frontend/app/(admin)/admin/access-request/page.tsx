import * as React from 'react'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { Header } from '@/components/Header/Header'
import { AlertProvider } from '@/providers/AlertProvider'
import { notFound } from 'next/navigation'
import { AccessRequestMain } from '@/components/AdminMainComponents/AccessRequestMain'

export const dynamic = 'force-dynamic'

export async function generateMetadata (): Promise<Metadata> {
  const session: SessionType | null = await getServerSession(authOptions)
  if (session === null) notFound()
  return {
    title: 'walkerwholesale Admin - Access Request',
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
        <AlertProvider>
          {session.user !== undefined && (
            <AccessRequestMain />
          )}
        </AlertProvider>
      </main>
    </>
  )
}
