import * as React from 'react'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { DynamicSearch } from '@/utils/DynamicSearch'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { isPublicPropertiesEnabled } from '@/lib/public-properties'

export const dynamic = 'force-dynamic'

export async function generateMetadata (): Promise<Metadata> {
  return {
    title: 'walkerwholesale - Properties',
    robots: {
      index: true,
      follow: true
    }
  }
}

export default async function Page (): Promise<React.ReactNode> {
  // if (!isPublicPropertiesEnabled()) {
  //   redirect('/login')
  // }

  const session: SessionType | null = await getServerSession(authOptions)
  return <DynamicSearch user={session} />
}
