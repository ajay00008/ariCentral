import * as React from 'react'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { DynamicSearch } from '@/utils/DynamicSearch'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'

export const dynamic = 'force-dynamic'
const allowPublicProperties = process.env.NEXT_PUBLIC_ALLOW_PUBLIC_PROPERTIES === 'true'

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
  if (!allowPublicProperties) {
    redirect('/login')
  }

  const session: SessionType | null = await getServerSession(authOptions)
  return <DynamicSearch user={session} />
}
