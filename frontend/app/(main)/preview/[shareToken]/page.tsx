import * as React from 'react'
import { Metadata } from 'next'
import { notFound, redirect } from 'next/navigation'
import { DynamicView } from '@/utils/DynamicView'
import { getPropertyByShareToken } from '@/app/actions'

export const dynamic = 'force-dynamic'

export async function generateMetadata ({ params }: { params: { shareToken: string } }): Promise<Metadata> {
  const data2 = await getPropertyByShareToken(params.shareToken)

  if (data2 !== null) {
    return {
      title: data2.Name,
      description: data2.Summary,
      robots: {
        index: false,
        follow: false
      }
    }
  }

  notFound()
}

export default async function Page ({ params }: { params: { shareToken: string } }): Promise<React.ReactNode> {
  const serverData2 = await getPropertyByShareToken(params.shareToken)

  if (serverData2 !== null) {
    return <DynamicView data={serverData2} isPreview />
  }

  redirect('/login')
}
