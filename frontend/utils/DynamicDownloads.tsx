'use client'

import * as React from 'react'
import { BackToTopButton } from '@/components/Custom/BackToTopButton'
import { Footer } from '@/components/Footer/Footer'
import { ClientHeader } from '@/components/Header/ClientHeader/ClientHeader'
import { BurgerModal } from '@/components/Modals/Client/BurgerModal'
import { useCurrencyProvider } from '@/providers/CurrencyProvider'
import { useSession } from 'next-auth/react'
import { DownloadsSection } from '@/components/DynamicMainComponents/DownloadsSection'

interface Props {
  data: ActionGetPropertyBySlug
}

export function DynamicDownloads ({ data }: Props): React.ReactNode {
  const { currency, handleChangeCurrency } = useCurrencyProvider()
  const { data: session } = useSession()
  const user = session as SessionType | null

  return (
    <>
      <header id='header' className='sticky flex h-auto items-center bg-transparent z-50'>
        <ClientHeader
          data={data}
          currency={currency}
          changeCurrency={handleChangeCurrency}
          userData={user}
          isPropertyHeader={false}
        />
        <BurgerModal />
      </header>
      <main id='main'>
        <DownloadsSection data={data} />
        <BackToTopButton />
      </main>
      <footer id='footer'>
        <Footer />
      </footer>
    </>
  )
}
