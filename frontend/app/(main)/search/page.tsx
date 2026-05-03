import * as React from 'react'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { DynamicSearch } from '@/utils/DynamicSearch'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'

export const dynamic = 'force-dynamic'

export async function generateMetadata (): Promise<Metadata> {
  const session: SessionType | null = await getServerSession(authOptions)
  if (session === null) notFound()

  return {
    title: 'AriCentral - Search',
    robots: {
      index: false,
      follow: false
    }
  }
}

export default async function Page (): Promise<React.ReactNode> {
  const session: SessionType | null = await getServerSession(authOptions)
  if (session === null) notFound()
  return <DynamicSearch user={session} />
}
