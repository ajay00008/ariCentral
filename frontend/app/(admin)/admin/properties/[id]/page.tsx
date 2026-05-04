import * as React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header } from '@/components/Header/Header'
import { PropertyItemMain } from '@/components/AdminMainComponents/PropertyItemMain'
import { getPropertyBySlug } from '@/app/actions'
import { AlertProvider } from '@/providers/AlertProvider'

export interface AdminPropertyPageProps {
  params: {
    id: string
  }
}

export const dynamic = 'force-dynamic'

export async function generateMetadata ({ params }: AdminPropertyPageProps): Promise<Metadata> {
  const data = await getPropertyBySlug(params.id)

  if (data === null) {
    notFound()
  }

  return {
    title: `walkerwholesale Admin - ${data.attributes.Name}`,
    robots: {
      index: false,
      follow: false
    }
  }
}

export default async function AdminPropertyPage ({ params }: AdminPropertyPageProps): Promise<React.ReactNode> {
  const data = await getPropertyBySlug(params.id)

  if (data === null) {
    notFound()
  }

  return (
    <>
      <header>
        <Header />
      </header>
      <main>
        <AlertProvider>
          <PropertyItemMain data={data} />
        </AlertProvider>
      </main>
    </>
  )
}
