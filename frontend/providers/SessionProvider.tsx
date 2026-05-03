'use client'

import { Session } from 'next-auth'
import { SessionProvider } from 'next-auth/react'

interface Props {
  children: React.ReactNode
  session: SessionType | null
}

export default function SessionProviderWrapper ({ children, session }: Props): React.ReactNode {
  return <SessionProvider session={session as Session | null}>{children}</SessionProvider>
}
