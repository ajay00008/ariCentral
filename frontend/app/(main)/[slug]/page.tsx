import * as React from 'react'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { notFound, redirect } from 'next/navigation'
import { DynamicPage } from '@/utils/DynamicPage'
import { DynamicView } from '@/utils/DynamicView'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { getDynamicPageFromCollectionById, getStaticPageById } from '@/app/actions'

export const dynamic = 'force-dynamic'

export async function generateMetadata ({ params }: { params: { slug: string } }): Promise<Metadata> {
  const data2 = await getDynamicPageFromCollectionById(params.slug)

  if (data2 !== null) {
    return {
      title: data2.Name,
      description: data2.Description,
      robots: {
        index: false,
        follow: false
      }
    }
  }

  const session: SessionType | null = await getServerSession(authOptions)
  const sessionToken = session?.user?.access_token ?? ''

  if (sessionToken === '') {
    notFound()
  }

  const data = await getStaticPageById(params.slug, sessionToken)

  if (data !== null) {
    return {
      title: data.Name,
      description: data.Summary,
      robots: {
        index: false,
        follow: false
      }
    }
  }

  notFound()
}

export default async function Page ({ params }: { params: { slug: string } }): Promise<React.ReactNode> {
  const serverData2 = await getDynamicPageFromCollectionById(params.slug)

  if (serverData2 !== null) {
    return <DynamicPage data={serverData2} />
  }

  const session: SessionType | null = await getServerSession(authOptions)
  const sessionToken = session?.user?.access_token ?? ''

  if (sessionToken === '') {
    redirect('/login')
  }

  const serverData = await getStaticPageById(params.slug, sessionToken)

  if (serverData !== null) {
    return <DynamicView data={serverData} />
  }

  redirect('/login')
}
