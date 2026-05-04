'use client'

import * as React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface FooterProps {
  isJustify?: boolean
}

const footerLinks = [
  {
    label: 'Privacy Policy',
    url: '/privacy'
  },
  {
    label: 'Terms & Conditions',
    url: '/terms'
  }
]

export function Footer ({ isJustify }: FooterProps): React.ReactNode {
  React.useEffect(() => {
    const header = document.querySelector('header')
    const main = document.querySelector('main')
    const footer = document.querySelector('footer')

    function updateFooterMargin (): void {
      if (header !== null && main !== null && footer !== null) {
        if (window.innerWidth >= 1280) {
          if (window.innerHeight < 1130) {
            footer.style.marginTop = '64px'
          } else {
            const headerHeight = header.offsetHeight
            const mainHeight = main.offsetHeight

            const dynamicNumber = window.innerWidth >= 1728 ? 240 : 168

            const totalHeight = headerHeight + mainHeight + dynamicNumber
            const marginTop = window.innerHeight - totalHeight

            footer.style.marginTop = `${marginTop}px`
          }
        }
      }
    }

    if (isJustify !== undefined && isJustify) {
      window.addEventListener('resize', updateFooterMargin)

      if (header !== null && main !== null) {
        const resizeObserver = new ResizeObserver(() => {
          updateFooterMargin()
        })

        resizeObserver.observe(header)
        resizeObserver.observe(main)

        updateFooterMargin()

        return () => {
          window.removeEventListener('resize', updateFooterMargin)
          resizeObserver.disconnect()
        }
      }
    }
  }, [])

  return (
    <div className='border-t border-[#D1D1D1]'>
      <div className='smobile:flex smobile:flex-col smobile:items-start smobile:gap-[32px] smobile:py-[32px] smobile:px-[16px] tablet:px-[32px] laptop:p-[64px] laptop:justify-between laptop:w-full laptop:items-center laptop:flex-row bdesktop:py-[100px] max-w-[2000px] w-full mx-auto'>
        <div className='flex'>
          <Link
            href='/search'
            className='h-auto w-auto'
            aria-label='Check all properties link'
            title='See all properties'
          >
            <Image
              src='/walker-logo-dark.png'
              alt='Logo image'
              width={1000}
              height={1000}
              priority
              className='max-w-[100px] max-h-[100px] object-contain aspect-square'
            />
          </Link>
        </div>
        <div className='smobile:flex items-center flex-wrap smobile:w-full laptop:hidden laptop:h-0'>
          <p className='font-mundialLight smobile:text-[16px] smobile:leading-[1] flex flex-wrap gap-[5px] max-w-[394px]'>
            Walker @ {new Date().getFullYear()} |
            {footerLinks.map((footerLink, idx, arr) => (
              <Link
                className='font-mundialLight smobile:text-[16px] smobile:leading-[1] transition duration-200 hover:underline'
                href={footerLink.url}
                key={footerLink.url}
              >
                {footerLink.label}{idx < arr.length - 1 ? ', ' : ''}
              </Link>
            ))}
          </p>
        </div>
        <div className='items-center smobile:w-full smobile:hidden smobile:h-0 laptop:flex laptop:h-auto laptop:w-fit'>
          <p className='pr-[10px] font-mundialLight smobile:text-[16px] smobile:leading-[1] w-fit whitespace-nowrap'>
            Walker @ {new Date().getFullYear()}
          </p>
          <ul className='flex border-l border-black pl-[10px] w-fit flex-wrap gap-[5px]'>
            {footerLinks.map((footerLink, idx, arr) => (
              <li key={footerLink.url}>
                <Link
                  className='font-mundialLight smobile:text-[16px] smobile:leading-[1] transition duration-200 hover:underline'
                  href={footerLink.url}
                >
                  {footerLink.label}{idx < arr.length - 1 ? ', ' : ''}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
