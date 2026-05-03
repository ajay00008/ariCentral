import * as React from 'react'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
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
import { UserTypeBanner } from '@/components/Custom/UserTypeBanner'
import { authOptions } from '../api/auth/[...nextauth]/options'
import '../globals.css'

interface RootLayoutProps {
  children: React.ReactNode
}

export function generateMetadata (): Metadata {
  return {
    robots: {
      index: false,
      follow: false
    }
  }
}

export default async function RootLayout ({ children }: RootLayoutProps): Promise<React.ReactNode> {
  const session: SessionType | null = await getServerSession(authOptions)
  if (session?.user?.role !== 'Admin') {
    redirect('/search')
  } else if (session?.user?.blocked === true) {
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
            <UserTypeBanner renderType={1} />
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
      <body>
        {children}
      </body>
    </html>
  )
}
