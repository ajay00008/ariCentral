import * as React from 'react'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { getFAQCollection } from '@/app/actions'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { FAQMain } from '@/components/AdminMainComponents/FAQMain'
import { Header } from '@/components/Header/Header'
import { AlertProvider } from '@/providers/AlertProvider'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

export async function generateMetadata (): Promise<Metadata> {
  const session: SessionType | null = await getServerSession(authOptions)
  const faq = await getFAQCollection()
  if (session === null || faq === null) notFound()
  return {
    title: 'AriCentral Admin - FAQ',
    robots: {
      index: false,
      follow: false
    }
  }
}

export default async function Page (): Promise<React.ReactNode> {
  const session: SessionType | null = await getServerSession(authOptions)
  const faq = await getFAQCollection()
  if (session === null || faq === null) notFound()
  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <AlertProvider>
          {session.user !== undefined && (
            <FAQMain faqCollection={faq} />
          )}
        </AlertProvider>
      </main>
    </>
  )
}
