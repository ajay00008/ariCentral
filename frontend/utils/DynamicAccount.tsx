'use client'

import * as React from 'react'
import { BackToTopButton } from '@/components/Custom/BackToTopButton'
import { Footer } from '@/components/Footer/Footer'
import { ClientHeader } from '@/components/Header/ClientHeader/ClientHeader'
import { BurgerModal } from '@/components/Modals/Client/BurgerModal'
import { useCurrencyProvider } from '@/providers/CurrencyProvider'
import { useSession } from 'next-auth/react'
import { ProfileSection } from '@/components/DynamicMainComponents/ProfileSection'

export function DynamicAccount (): React.ReactNode {
  const { currency, handleChangeCurrency } = useCurrencyProvider()
  const { data: session } = useSession()
  const user = session as SessionType | null

  return (
    <>
      <header id='header' className='sticky flex h-auto items-center bg-transparent mx-auto z-50'>
        <ClientHeader
          currency={currency}
          userData={user}
          changeCurrency={handleChangeCurrency}
          isPropertyHeader={false}
        />
        <BurgerModal />
      </header>
      <main id='main'>
        <ProfileSection />
        <BackToTopButton />
      </main>
      <footer id='footer' className='mx-auto laptop:max-w-[1280px] desktop:max-w-[1440px] bdesktop:max-w-[1728px]'>
        <Footer isJustify />
      </footer>
    </>
  )
}
