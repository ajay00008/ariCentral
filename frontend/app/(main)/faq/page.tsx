import * as React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { DynamicFAQ } from '@/utils/DynamicFAQ'
import { getFAQ } from '@/app/actions'

export const dynamic = 'force-dynamic'

export async function generateMetadata (): Promise<Metadata> {
  const data = await getFAQ()
  if (data === null) {
    notFound()
  }
  return {
    title: 'AriCentral - FAQ',
    robots: {
      index: false,
      follow: false
    }
  }
}

export default async function Page (): Promise<React.ReactNode> {
  const data = await getFAQ()
  if (data === null) {
    notFound()
  }
  return <DynamicFAQ data={data} />
}
