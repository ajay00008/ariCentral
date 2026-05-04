import * as React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Header } from '@/components/Header/Header'
import { getDynamicPageById } from '@/app/actions'
import { PagesItemMain } from '@/components/AdminMainComponents/PagesItemMain'
import { AlertProvider } from '@/providers/AlertProvider'

export const dynamic = 'force-dynamic'

export async function generateMetadata ({ params }: { params: { id: string } }): Promise<Metadata> {
  const data = await getDynamicPageById(params.id)

  if (data === null) {
    notFound()
  }

  const pageData = data.dynamicData

  return {
    title: `walkerwholesale Admin - ${pageData.Name ?? ''}`,
    robots: {
      index: false,
      follow: false
    }
  }
}

export default async function Page ({ params }: { params: { id: string } }): Promise<React.ReactNode> {
  const data = await getDynamicPageById(params.id)

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
          <PagesItemMain
            id={data.id}
            pageData={data.dynamicData}
          />
        </AlertProvider>
      </main>
    </>
  )
}
