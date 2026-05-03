import * as React from 'react'
import { Metadata } from 'next'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { UserMain } from '@/components/AdminMainComponents/UserMain'
import { Header } from '@/components/Header/Header'
import { AlertProvider } from '@/providers/AlertProvider'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export async function generateMetadata (): Promise<Metadata> {
  const session: SessionType | null = await getServerSession(authOptions)
  if (session === null) notFound()
  return {
    title: 'AriCentral Admin - Users',
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
      <main className='overflow-auto'>
        <AlertProvider>
          {session.user !== undefined && (
            <UserMain currentUserId={typeof session.user.id === 'number' ? session.user.id.toString() : session.user.id ?? ''} />
          )}
        </AlertProvider>
      </main>
    </>
  )
}
