import * as React from 'react'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { AuthLayout } from '@/components/Layouts/AuthLayout'
import { ResetPasswordForm } from '@/components/Forms/ResetPasswordForm'
import { getLastProperty } from '@/app/actions'

export function generateMetadata (): Metadata {
  return {
    title: 'AriCentral - Reset Password',
    robots: {
      index: false,
      follow: false
    }
  }
}

export default async function Page (): Promise<React.ReactNode> {
  const session: SessionType | null = await getServerSession(authOptions)

  if (session !== null) {
    redirect('/admin/properties')
  }

  const lastProperty = await getLastProperty()

  return (
    <>
      <header className='hidden' />
      <main className='relative'>
        <AuthLayout lastProperty={lastProperty}>
          <ResetPasswordForm />
        </AuthLayout>
      </main>
      <footer className='hidden' />
    </>
  )
}
