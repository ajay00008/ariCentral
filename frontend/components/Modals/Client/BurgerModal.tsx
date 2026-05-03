'use client'

import * as React from 'react'
import Link from 'next/link'
import { closeModalWithAnimation, openModal } from './UnitDetailsModal'
import { useBurgerProvider } from '@/providers/BurgerProvider'
import { signOut, useSession } from 'next-auth/react'
import { ArrowRightToLine } from 'lucide-react'

export function BurgerModal (): React.ReactNode {
  const { closeModal, isModalOpen } = useBurgerProvider()
  const { data: session } = useSession()
  const userSession = session as SessionType | null
  const containerRef = React.useRef<HTMLDivElement | null>(null)

  function handleCloseModal (): void {
    closeModalWithAnimation('burger')
    closeModal()
  }

  function handleBackdropClick (e: React.MouseEvent<HTMLDivElement>): void {
    if (e.target === e.currentTarget) {
      handleCloseModal()
    }
  }

  function handleEscape (e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      handleCloseModal()
    }
  }

  React.useEffect(() => {
    if (isModalOpen) {
      openModal('burger')
    } else {
      handleCloseModal()
    }
  }, [isModalOpen])

  React.useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('keydown', (e) => handleEscape(e))

      return () => {
        document.removeEventListener('keydown', (e) => handleEscape(e))
      }
    }
  }, [isModalOpen])

  React.useEffect(() => {
    function adjustContainerPosition (): void {
      const header = document.getElementById('header-body')
      const container = containerRef.current

      if ((header !== null) && (container !== null)) {
        const headerWidth = header.clientWidth
        const screenWidth = window.innerWidth
        const sideMargins = (screenWidth - headerWidth) / 2

        container.style.right = `${sideMargins + 64}px`
      }
    }

    adjustContainerPosition()
    window.addEventListener('resize', adjustContainerPosition)

    return () => window.removeEventListener('resize', adjustContainerPosition)
  }, [])

  return (
    <div
      id='burger'
      className='smobile:fixed smobile:inset-0 smobile:top-[64px] smobile:z-50 smobile:bg-black smobile:bg-opacity-30 tablet:bg-opacity-0 tablet:top-0 hidden'
      onClick={handleBackdropClick}
    >
      <div ref={containerRef} className='smobile:bg-white smobile:h-fit smobile:w-full smobile:px-[15px] mobile:px-[24px] smobile:border-t smobile:border-[#C8C8C8] tablet:border tablet:max-w-[200px] tablet:h-fit tablet:fixed tablet:top-[60px] tablet:right-[32px] tablet:rounded-[6px] laptop:top-[73px] desktop:right-[64px] bdesktop:top-[72px]'>
        <ul className='smobile:flex smobile:flex-col smobile:w-full smobile:gap-[32px] smobile:pt-[36px] smobile:pb-[32px] tablet:gap-[15px] tablet:pb-[24px] tablet:pt-[24px]'>
          {userSession?.user?.role === 'Admin' && (
            <li>
              <Link
                className='smobile:font-mundialRegular smobile:text-[20px]   tablet:text-[16px] smobile:leading-[1] smobile:text-black'
                href='/admin/properties'
                prefetch={false}
              >
                <p className='bg-orange p-2 rounded-full justify-center text-white text-center flex gap-2 items-center'>
                  Admin Panel
                  <ArrowRightToLine size={20} strokeWidth={1.5} absoluteStrokeWidth />
                </p>
              </Link>
            </li>
          )}

          <li>
            <Link
              className='smobile:font-mundialRegular smobile:text-[20px] tablet:text-[16px] smobile:leading-[1] smobile:text-black'
              href='/account'
            >
              <p>Your Account</p>
            </Link>
          </li>
          <li>
            <Link
              className='smobile:font-mundialRegular smobile:text-[20px] tablet:text-[16px] smobile:leading-[1] smobile:text-black'
              href='/saved-properties'
            >
              <p>Saved Properties</p>
            </Link>
          </li>
          <li>
            <Link
              className='smobile:font-mundialRegular smobile:text-[20px] tablet:text-[16px] smobile:leading-[1] smobile:text-black'
              href='/search'
            >
              <p>Search</p>
            </Link>
          </li>
          <li>
            <Link
              className='smobile:font-mundialRegular smobile:text-[20px] tablet:text-[16px] smobile:leading-[1] smobile:text-black'
              href='#'
            >
              <p>Invite a Colleague</p>
            </Link>
          </li>
          <li className='w-auto'>
            <Link
              className='smobile:font-mundialRegular smobile:text-[20px] tablet:text-[16px] smobile:leading-[1] smobile:text-black'
              href='/faq'
            >
              <p>FAQ</p>
            </Link>
          </li>
        </ul>
        <div className='smobile:w-full smobile:border-t smobile:border-[#D1D1D1] mobile:max-w-[140px] tablet:max-w-none'>
          <button
            type='button'
            onClick={() => {
              void signOut({ callbackUrl: '/login' })
            }}
            className='smobile:font-mundialRegular smobile:text-[20px] tablet:text-[16px] smobile:leading-[1] smobile:text-customGreyAccount smobile:pt-[32px] smobile:pb-[38px] tablet:pt-[16px] tablet:pb-[22px]'
          >
            <p>Log out</p>
          </button>
        </div>
      </div>
    </div>
  )
}
