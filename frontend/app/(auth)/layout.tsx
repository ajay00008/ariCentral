import * as React from 'react'
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
import { AlertProvider } from '@/providers/AlertProvider'
import '../globals.css'

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout ({ children }: RootLayoutProps): React.ReactNode {
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
        <AlertProvider>
          {children}
        </AlertProvider>
      </body>
    </html>
  )
}
