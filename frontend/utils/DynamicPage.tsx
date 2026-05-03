'use client'

import * as React from 'react'
import { BackToTopButton } from '@/components/Custom/BackToTopButton'
import { Footer } from '@/components/Footer/Footer'
import { ClientHeader } from '@/components/Header/ClientHeader/ClientHeader'
import { BurgerModal } from '@/components/Modals/Client/BurgerModal'
import { DynamicSection } from './DynamicSection'
import { useSession } from 'next-auth/react'
import '../app/(main)/faq/markdown-updated.css'

interface DynamicPageProps {
  data: ActionGetDynamicPageBySlug
}

export function DynamicPage ({ data }: DynamicPageProps): React.ReactNode {
  const { data: session } = useSession()
  const user = session as SessionType | null

  return (
    <>
      <header id='header' className='sticky flex h-auto items-center bg-transparent mx-auto z-50'>
        <ClientHeader userData={user} />
        <BurgerModal />
      </header>
      <main id='main'>
        <DynamicSection data={data} />
        <BackToTopButton />
      </main>
      <footer id='footer'>
        <Footer />
      </footer>
    </>
  )
}
