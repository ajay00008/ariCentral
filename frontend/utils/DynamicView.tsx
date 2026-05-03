'use client'

import * as React from 'react'
import dynamic from 'next/dynamic'
import { BackToTopButton } from '@/components/Custom/BackToTopButton'
import { Map } from '@/components/Custom/GoogleMap'
import { AboutUsSection } from '@/components/DynamicMainComponents/AboutUsSection'
import { AvailabilitySection } from '@/components/DynamicMainComponents/AvailabilitySection'
import { HeroSection } from '@/components/DynamicMainComponents/HeroSection'
import { ImageGallerySection2 } from '@/components/DynamicMainComponents/ImageGallerySection2'
import { SummarySection } from '@/components/DynamicMainComponents/SummarySection'
import { Footer } from '@/components/Footer/Footer'
import { ClientHeader } from '@/components/Header/ClientHeader/ClientHeader'
import { FloorPlansList } from '@/components/Lists/FloorPlansList'
import { BurgerModal } from '@/components/Modals/Client/BurgerModal'
import { FormModal } from '@/components/Modals/Client/FormModal'
import { SectionSeparator } from '@/components/Separators/SectionSeparator'
import { useCurrencyProvider } from '@/providers/CurrencyProvider'
import { useSession } from 'next-auth/react'
import { trackEvent } from '@/app/actions'
import { EventType } from '@/constants/event-type'

const UnitDetailsModal = dynamic(async () => {
  const UnitDetailsModalImport = await import('@/components/Modals/Client/UnitDetailsModal')
  return UnitDetailsModalImport.UnitDetailsModal
}, { ssr: false })

interface Props {
  data: ActionGetPropertyBySlug
  isPreview?: boolean
}

export function DynamicView ({ data, isPreview }: Props): React.ReactNode {
  const { currency, handleChangeCurrency } = useCurrencyProvider()
  const { data: session } = useSession()
  const user = session as SessionType | null
  const fakeFloor = undefined
  function fakeUnitChange (): void { }
  const isInitialLoad = React.useRef(true)

  React.useEffect(() => {
    if (isInitialLoad.current && isPreview !== true) {
      trackEvent(data.Slug, EventType.PAGE_VIEW)
      isInitialLoad.current = false
    }
  }, [data.Slug])

  return (
    <>
      <header id='header' className='sticky flex h-auto items-center bg-transparent z-50'>
        <ClientHeader
          data={data}
          currency={currency}
          changeCurrency={handleChangeCurrency}
          userData={user}
          isPreview={isPreview}
        />
        {isPreview !== true && (
          <BurgerModal />
        )}
      </header>
      <main id='main'>
        <HeroSection data={data} isCommissionEnabled={user?.user?.showCommission ?? false} isPreview={isPreview} />
        <SectionSeparator />
        <SummarySection data={data} />
        <SectionSeparator />
        <ImageGallerySection2 data={data} views={false} currentFloorData={fakeFloor} onUnitIdChange={fakeUnitChange} unitId='' />
        <SectionSeparator />
        <AvailabilitySection data={data} currency={currency} />
        <SectionSeparator />
        <FloorPlansList data={data} currency={currency} isCommissionEnabled={user?.user?.showCommission ?? false} />
        <SectionSeparator />
        <ImageGallerySection2 data={data} views currentFloorData={fakeFloor} onUnitIdChange={fakeUnitChange} unitId='' />
        <SectionSeparator />
        <Map address={data.Address} isBrochure={false} />
        <SectionSeparator />
        <AboutUsSection data={data} currency={currency} isPreview={isPreview} />
        <UnitDetailsModal data={data} currency={currency} isPreview={isPreview} />
        <FormModal />
        <BackToTopButton />
      </main>
      <footer id='footer'>
        <Footer />
      </footer>
    </>
  )
}
