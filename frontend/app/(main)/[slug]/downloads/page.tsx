import * as React from 'react'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { notFound } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { getStaticPageById } from '@/app/actions'
import { DynamicDownloads } from '@/utils/DynamicDownloads'

export const dynamic = 'force-dynamic'

export async function generateMetadata ({ params }: { params: { slug: string } }): Promise<Metadata> {
  const session: SessionType | null = await getServerSession(authOptions)
  const sessionToken = session?.user?.access_token ?? ''
  if (sessionToken === '') notFound()
  const data = await getStaticPageById(params.slug, sessionToken)
  if (data === null) notFound()

  return {
    title: `AriCentral - ${data.Name} Downloads`,
    robots: {
      index: false,
      follow: false
    }
  }
}

export default async function Page ({ params }: { params: { slug: string } }): Promise<React.ReactNode> {
  const session: SessionType | null = await getServerSession(authOptions)
  const sessionToken = session?.user?.access_token ?? ''
  if (sessionToken === '') notFound()
  const serverData = await getStaticPageById(params.slug, sessionToken)
  if (serverData === null) notFound()

  return <DynamicDownloads data={serverData} />
}
