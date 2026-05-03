import * as React from 'react'
import { UnitModalProvider } from '@/providers/UnitModalProvider'
import { BurgerProvider } from '@/providers/BurgerProvider'
import { FormModalProvider } from '@/providers/FormModalProvider'
import {
  poppins,
  rubik,
  mundialB,
  mundialThin,
  mundialLight,
  mundialRegular,
  mundialDemibold,
  mundialBold
} from '../fonts'
import { getServerSession } from 'next-auth'
import { authOptions } from '../api/auth/[...nextauth]/options'
import { UserTypeBanner } from '@/components/Custom/UserTypeBanner'
import SessionProviderWrapper from '@/providers/SessionProvider'
import { SwiperProvider } from '@/providers/SwiperProvider'
import { SearchFiltersProvider } from '@/providers/SearchFiltersProvider'
import { AlertProvider } from '@/providers/AlertProvider'
import { CurrencyProvider } from '@/providers/CurrencyProvider'
import './dynamic.css'
// import { AuthLayout } from '@/components/Layouts/AuthLayout'
// import { ElementsProvider } from '@/providers/ElementsProvider'
// import { StripeForm } from '@/components/Forms/StripeForm'
// import { getLastProperty } from '../actions'

interface LayoutProps {
  children: React.ReactNode
}

export default async function Layout ({
  children
}: LayoutProps): Promise<React.ReactNode> {
  const session: SessionType | null = await getServerSession(authOptions)
  // const fontClassName = `${poppins.variable}
  //   ${rubik.variable}
  //   ${mundialB.variable}
  //   ${mundialThin.variable}
  //   ${mundialLight.variable}
  //   ${mundialRegular.variable}
  //   ${mundialDemibold.variable}
  //   ${mundialBold.variable}`

  if (session?.user?.blocked === true) {
    return (
      <html
        lang='en'
        className={`
    ${String(poppins.variable)}
    ${String(rubik.variable)}
    ${String(mundialB.variable)}
    ${String(mundialThin.variable)}
    ${String(mundialLight.variable)}
    ${String(mundialRegular.variable)}
    ${String(mundialDemibold.variable)}
    ${String(mundialBold.variable)}
    `}
      >
        <body className='bg-black'>
          <header />
          <main>
            <SessionProviderWrapper session={session}>
              <UserTypeBanner renderType={1} />
            </SessionProviderWrapper>
          </main>
          <footer />
        </body>
      </html>
    )
    // } else if (session?.user?.stripeSetupIntentSuccessful === false) {
    //   const lastProperty = await getLastProperty();

    //   return (
    //     <html lang="en" className={fontClassName}>
    //       <body className="bg-grey">
    //         <header className="hidden" />
    //         <main className="relative">
    //           <SessionProviderWrapper session={session}>
    //             <AlertProvider>
    //               <ElementsProvider>
    //                 <AuthLayout lastProperty={lastProperty}>
    //                   <StripeForm publicUrl={process.env.PUBLIC_URL} />
    //                 </AuthLayout>
    //               </ElementsProvider>
    //             </AlertProvider>
    //           </SessionProviderWrapper>
    //         </main>
    //         <footer className="hidden" />
    //       </body>
    //     </html>
    //   );
  } else if (session?.user?.confirmed === false) {
    return (
      <html
        lang='en'
        className={`
    ${String(poppins.variable)}
    ${String(rubik.variable)}
    ${String(mundialB.variable)}
    ${String(mundialThin.variable)}
    ${String(mundialLight.variable)}
    ${String(mundialRegular.variable)}
    ${String(mundialDemibold.variable)}
    ${String(mundialBold.variable)}
    `}
      >
        <body className='bg-black'>
          <header />
          <main>
            <SessionProviderWrapper session={session}>
              <UserTypeBanner renderType={2} />
            </SessionProviderWrapper>
          </main>
          <footer />
        </body>
      </html>
    )
  }
  return (
    <html
      lang='en'
      className={`
    ${String(poppins.variable)}
    ${String(rubik.variable)}
    ${String(mundialB.variable)}
    ${String(mundialThin.variable)}
    ${String(mundialLight.variable)}
    ${String(mundialRegular.variable)}
    ${String(mundialDemibold.variable)}
    ${String(mundialBold.variable)}
    `}
    >
      <body className='bg-grey'>
        <SwiperProvider>
          <SessionProviderWrapper session={session}>
            <CurrencyProvider>
              <AlertProvider>
                <SearchFiltersProvider>
                  <FormModalProvider>
                    <BurgerProvider>
                      <UnitModalProvider>{children}</UnitModalProvider>
                    </BurgerProvider>
                  </FormModalProvider>
                </SearchFiltersProvider>
              </AlertProvider>
            </CurrencyProvider>
          </SessionProviderWrapper>
        </SwiperProvider>
      </body>
    </html>
  )
}
