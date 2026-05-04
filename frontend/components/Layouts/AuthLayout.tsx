import * as React from 'react'
import Image from 'next/image'
import { BackgroundImage } from '@/components/Custom/BackgroundImage'
import { heroImages } from '@/lib/hero-images'

interface AuthLayoutProps {
  children: React.ReactNode
  lastProperty: LastProperty | null
}

export function AuthLayout ({ children, lastProperty }: Readonly<AuthLayoutProps>): React.ReactNode {
  const heroImage = heroImages(lastProperty)[0] ?? null

  return (
    <>
      <div className='bg-grey'>
        <div className='smobile:relative smobile:inset-0 smobile:items-center smobile:justify-center smobile:z-50 laptop:w-[50%]'>
          <div className='smobile:bg-grey smobile:px-[16px] tablet:px-[32px] smobile:mr-auto smobile:min-h-screen tablet:h-screen smobile:w-full smobile:flex smobile:flex-col smobile:gap-[48px]'>
            <Image
              src='/walker-logo-dark.png'
              alt='Logo image'
              width={1000}
              height={1000}
              priority
              quality={100}
              className='smobile:w-[80px] smobile:h-[80px] smobile:mt-[80px] tablet:mt-[80px] object-contain aspect-square'
            />
            <React.Suspense fallback={<div>Loading...</div>}>
              {children}
            </React.Suspense>
            <div className='smobile:hidden smobile:h-0 bdesktop:flex bdesktop:fixed bdesktop:bottom-0 bdesktop:left-0 bdesktop:h-auto bdesktop:overflow-hidden bdesktop:max-w-[50%]'>
              <BackgroundImage
                src='/white-fragment.png'
                alt='Thumbnail image'
                aria-label='thumbnail'
                className='w-auto h-auto -z-[-1] max-h-[120px]'
                width={300}
                height={300}
              />
              <BackgroundImage
                src='/white-fragment.png'
                alt='Thumbnail image'
                aria-label='thumbnail'
                className='w-auto h-auto -z-[-1] max-h-[120px]'
                width={300}
                height={300}
              />
              <BackgroundImage
                src='/white-fragment.png'
                alt='Thumbnail image'
                aria-label='thumbnail'
                className='w-auto h-auto -z-[-1] max-h-[120px]'
                width={300}
                height={300}
              />
            </div>
          </div>
        </div>
        {lastProperty !== null && (
          <>
            <div className='smobile:hidden laptop:fixed laptop:inset-0 laptop:items-center laptop:justify-center laptop:z-40 laptop:w-[50%] laptop:flex laptop:select-none'>
              {heroImage !== null && (
                <Image
                  src={heroImage.Image.data.attributes.url}
                  alt='Last property image'
                  aria-label='last property image'
                  width={heroImage.Image.data.attributes.width ?? undefined}
                  height={heroImage.Image.data.attributes.height ?? undefined}
                  className='laptop:fixed laptop:w-[50%] laptop:object-cover laptop:h-screen laptop:right-0'
                />
              )}
            </div>
            <div className='smobile:hidden laptop:flex laptop:flex-col laptop:fixed laptop:bottom-[22px] laptop:right-[22px] z-[60] laptop:gap-[3px] laptop:max-w-[92px] laptop:select-none'>
              <p className='laptop:font-mundialLight laptop:text-[16px] laptop:leading-[1] laptop:text-white laptop:text-end'>
                {lastProperty.Name}
              </p>
              <p className='laptop:font-mundialLight laptop:text-[12px] laptop:leading-[1] laptop:text-white laptop:text-end'>
                {lastProperty.Address}
              </p>
            </div>
          </>
        )}
      </div>
    </>
  )
}
