import * as React from 'react'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { DynamicSearch } from '@/utils/DynamicSearch'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { isPublicPropertiesEnabled } from '@/lib/public-properties'

export const dynamic = 'force-dynamic'

export async function generateMetadata (): Promise<Metadata> {
  const allowPublicProperties = isPublicPropertiesEnabled()

  if (!allowPublicProperties) {
    const session: SessionType | null = await getServerSession(authOptions)
    if (session === null) notFound()
  }

  return {
    title: allowPublicProperties ? 'walkerwholesale - Properties' : 'walkerwholesale - Search',
    robots: {
      index: allowPublicProperties,
      follow: allowPublicProperties
    }
  }
}

export default async function Page (): Promise<React.ReactNode> {
  const allowPublicProperties = isPublicPropertiesEnabled()
  const session: SessionType | null = await getServerSession(authOptions)
  if (!allowPublicProperties && session === null) notFound()
  return <DynamicSearch user={session} />
}
