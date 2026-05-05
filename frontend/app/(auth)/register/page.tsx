import * as React from 'react'
import { Metadata } from 'next'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/app/api/auth/[...nextauth]/options'
import { AuthLayout } from '@/components/Layouts/AuthLayout'
import { SignUpForm } from '@/components/Forms/SignUpForm'
import { getLastProperty } from '@/app/actions'

const allowPublicProperties = process.env.NEXT_PUBLIC_ALLOW_PUBLIC_PROPERTIES === 'true'

export function generateMetadata (): Metadata {
  return {
    title: 'walkerwholesale - Register',
    robots: {
      index: false,
      follow: false
    }
  }
}

export default async function Page (): Promise<React.ReactNode> {
  if (allowPublicProperties) {
    redirect('/')
  }

  const session: SessionType | null = await getServerSession(authOptions)

  if (session !== null) {
    redirect('/admin/properties')
  }

  const lastProperty = await getLastProperty()

  return (
    <>
      <header className='hidden' />
      <main className='relative bg-grey overflow-y-auto'>
        <AuthLayout lastProperty={lastProperty}>
          <SignUpForm />
        </AuthLayout>
      </main>
      <footer className='hidden' />
    </>
  )
}
