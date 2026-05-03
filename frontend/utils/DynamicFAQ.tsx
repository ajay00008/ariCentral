'use client'

import * as React from 'react'
import { BackToTopButton } from '@/components/Custom/BackToTopButton'
import { Footer } from '@/components/Footer/Footer'
import { ClientHeader } from '@/components/Header/ClientHeader/ClientHeader'
import { BurgerModal } from '@/components/Modals/Client/BurgerModal'
import { Faq } from '@/components/Faq/Faq'
import { useSession } from 'next-auth/react'

interface Props {
  data: FAQCollectionElement[]
}

export function DynamicFAQ ({ data }: Props): React.ReactNode {
  const { data: session } = useSession()
  const user = session as SessionType | null

  return (
    <>
      <header id='header' className='sticky flex h-auto items-center bg-transparent mx-auto z-50'>
        <ClientHeader
          isFAQ
          collectionData={data}
          userData={user}
          isPropertyHeader={false}
        />
        <BurgerModal />
      </header>
      <main id='main'>
        <Faq collectionData={data} />
        <BackToTopButton />
      </main>
      <footer id='footer'>
        <Footer />
      </footer>
    </>
  )
}
