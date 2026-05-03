'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { signOut } from 'next-auth/react'
import Link from 'next/link'

type RenderType = 1 | 2 | 3 | 4

interface Props {
  renderType: RenderType
}

export function UserTypeBanner ({ renderType }: Props): React.ReactNode {
  let content

  switch (renderType) {
    case 1:
      content = (
        <>
          <h1 className='text-white font-mundialRegular text-center text-[24px] text-leading-[1]'>
            You are blocked and can`t access any page on this website anymore.
          </h1>
          <Button
            type='button'
            onClick={() => {
              void signOut({ callbackUrl: '/login' })
            }}
            className='w-[300px] h-auto max-h-[75px] lg:h-[75px] mx-auto bg-orange font-mundialLight text-customWhite font-light text-2xl disabled:opacity-50'
          >
            RELOGIN
          </Button>
        </>
      )
      break
    case 2:
      content = (
        <>
          <h1 className='text-white font-mundialRegular text-center whitespace-pre-line text-[24px] text-leading-[1]'>
            Your account is pending approval,
            <br />
            we will be in touch shortly to activate it.
          </h1>
          <Button
            type='button'
            onClick={() => {
              void signOut()
            }}
            className='w-[300px] h-auto max-h-[75px] lg:h-[75px] mx-auto bg-orange font-mundialLight text-customWhite font-light text-2xl disabled:opacity-50'
          >
            RELOGIN
          </Button>
        </>
      )
      break
    case 3:
      content = (
        <>
          <h1 className='text-white font-mundialRegular text-center text-[24px] text-leading-[1]'>
            You don`t have rights to see content from this page.
          </h1>
          <Button
            type='button'
            onClick={() => {
              void signOut()
            }}
            className='w-[300px] h-auto max-h-[75px] lg:h-[75px] mx-auto bg-orange font-mundialLight text-customWhite font-light text-2xl disabled:opacity-50'
          >
            RELOGIN
          </Button>
        </>
      )
      break
    case 4:
      content = (
        <Link
          href='/login'
          className='flex items-center text-white text-[2em] py-2 px-4 h-10 bg-transparent hover:underline rounded-md whitespace-nowrap justify-center transition duration-200 font-mundialLight'
        >
          You can`t see content without authorization in the system. Please, login in first.
        </Link>
      )
      break
    default:
      content = 'Invalid render type'
  }

  return (
    <div className='flex flex-col gap-3 justify-center items-center w-auto h-screen text-center'>
      {content}
    </div>
  )
}
