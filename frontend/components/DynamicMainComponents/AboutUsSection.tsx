'use client'

import * as React from 'react'
import { registerForUpdates, trackEvent } from '@/app/actions'
import assets from '@/assets'
import Link from 'next/link'
import classNames from 'classnames'
import { useSession } from 'next-auth/react'
import * as Sentry from '@sentry/nextjs'
import { useAlertProvider } from '@/providers/AlertProvider'
import { EventType } from '@/constants/event-type'

interface Props {
  data: ActionGetPropertyBySlug
  currency: Currency
  isPreview?: boolean
}

export function AboutUsSection ({ data, isPreview }: Props): React.ReactNode {
  const { data: session } = useSession()
  const userSession = session as SessionType | null
  const { setAlertMessage } = useAlertProvider()

  const [loadingRegisterUpdate, setRegisterUpdateLoading] = React.useState(false)
  const [isRegisteredForUpdates, setIsRegisteredForUpdates] = React.useState<boolean>(
    userSession?.user?.registeredForUpdates?.some(item => item.Item === data.Slug) ?? false
  )
  const downloadRef = React.useRef<HTMLAnchorElement>(null)

  const handleRegisterForUpdates = async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>): Promise<void> => {
    e.preventDefault()
    if (loadingRegisterUpdate) return

    if (isRegisteredForUpdates) {
      setAlertMessage('You have already registered for updates!', true)
      return
    }

    setRegisterUpdateLoading(true)
    setAlertMessage('Registering for updates.....', true)

    try {
      const result = await registerForUpdates(data.Slug, data.Name)
      if (result.success) {
        setIsRegisteredForUpdates(true)
        setAlertMessage('Successfully registered for updates', true)
      }
    } catch (err) {
      Sentry.captureException(err)
      setAlertMessage('There was an error registering you for updates. Please contact the site administrator.', false)
    }

    setRegisterUpdateLoading(false)
  }

  const handleDownload = (slug: string): void => {
    if (downloadRef.current !== null) {
      const timestamp = new Date().getTime()
      downloadRef.current.href = `/api/property/brochure?slug=${slug.trim()}&t=${timestamp}`
      downloadRef.current.click()
    }
    trackEvent(slug, EventType.DOWNLOAD_CLICK)
  }

  return (
    <section id='about-us' className='smobile:py-[32px] smobile:px-[16px] tablet:px-[32px] laptop:p-[64px] max-w-[2000px] w-full mx-auto'>
      <div className='smobile:flex smobile:flex-col smobile:gap-[32px] smobile:w-full laptop:flex-row laptop:justify-between'>
        <div className='smobile:flex smobile:flex-col smobile:h-fit smobile:gap-3'>
          <h1 className='smobile:font-mundialRegular smobile:text-[40px] smobile:leading-[1] desktop:text-[56px] desktop:text-ellipsis desktop:line-clamp-2 desktop:overflow-hidden desktop:max-w-[380px] bdesktop:text-nowrap bdesktop:max-w-[660px] bdesktop:block bdesktop:text-[72px]'>{data.Name}</h1>
        </div>
        <div className='smobile:flex smobile:flex-col smobile:gap-5 smobile:w-full laptop:grid laptop:grid-cols-3 laptop:w-fit'>
          {data.Brochure?.data !== null && isPreview !== true && (
            <div className='smobile:w-auto smobile:h-auto'>
              <div
                onClick={() => {
                  handleDownload(data.Slug)
                }}
                className='group smobile:block smobile:h-[68px] cursor-pointer laptop:h-[126px] desktop:h-[136px] smobile:p-[16px] laptop:p-[18px] bdesktop:p-[33px] smobile:w-full laptop:w-[280px] smobile:relative smobile:bg-white smobile:text-black smobile:hover:bg-blue-500 smobile:hover:text-white transition duration-200 flex flex-col items-start justify-start'
              >
                <p className='smobile:text-[16px] smobile:leading-[1] smobile:font-mundialRegular bdesktop:text-[24px] text-left'>
                  View Project Brochure
                </p>
                <assets.ChevronRightSVG
                  style={{ color: 'white' }}
                  width={30}
                  height={30}
                  className='smobile:absolute smobile:bottom-0 smobile:right-0 smobile:bg-blue-500 group-hover:bg-transparent transition duration-200'
                />
              </div>
              <a
                ref={downloadRef}
                href={`/api/property/brochure?slug=${data.Slug.trim()}`}
                download
                className='hidden'
              />
            </div>
          )}
          {(data.ProjectWebsiteLink !== null && data.ProjectWebsiteLink !== undefined && data.ProjectWebsiteLink !== '' && !data.ProjectWebsiteLink.includes(' disabled')) && (
            <div className='smobile:w-auto smobile:h-auto'>
              <Link
                className='group smobile:block smobile:h-[68px] laptop:h-[126px] desktop:h-[136px] smobile:p-[16px] laptop:p-[18px] bdesktop:p-[33px] smobile:w-full laptop:w-[280px] smobile:relative smobile:bg-white smobile:text-black smobile:hover:bg-blue-500 smobile:hover:text-white transition duration-200'
                href={data.ProjectWebsiteLink}
                prefetch={false}
                rel='noopener noreferrer'
                target='_blank'
              >
                <p className='smobile:text-[16px] smobile:leading-[1] smobile:font-mundialRegular bdesktop:text-[24px]'>
                  View Project Website
                </p>
                <assets.ChevronRightSVG
                  style={{ color: 'white' }}
                  width={30}
                  height={30}
                  className='smobile:absolute smobile:bottom-0 smobile:right-0 smobile:bg-blue-500 group-hover:bg-transparent transition duration-200'
                />
              </Link>
            </div>
          )}
          {(data.RegisterForUpdatesCode !== null && !data.RegisterForUpdatesCode.includes(' disabled')) && isPreview !== true && (
            <div
              className={classNames(
                'smobile:w-auto smobile:h-auto',
                (loadingRegisterUpdate || isRegisteredForUpdates) && 'opacity-75'
              )}
            >
              <Link
                href='#'
                onClick={(e) => {
                  void handleRegisterForUpdates(e)
                }}
                className='group smobile:block smobile:h-[68px] laptop:h-[126px] desktop:h-[136px] smobile:p-[16px] laptop:p-[18px] bdesktop:p-[33px] smobile:w-full laptop:w-[280px] smobile:relative smobile:bg-white smobile:text-black smobile:hover:bg-blue-500 smobile:hover:text-white transition duration-200'
              >
                <p className='smobile:text-[16px] smobile:leading-[1] smobile:font-mundialRegular bdesktop:text-[24px]'>
                  Register For Updates
                </p>
                <assets.ChevronRightSVG
                  style={{ color: 'white' }}
                  width={30}
                  height={30}
                  className='smobile:absolute smobile:bottom-0 smobile:right-0 smobile:bg-blue-500 group-hover:bg-transparent transition duration-200'
                />
              </Link>
            </div>
          )}
          {isPreview !== true && (
            <div className='smobile:w-auto smobile:h-auto'>
              <Link
                href='/search'
                className='group smobile:block smobile:h-[68px] laptop:h-[126px] desktop:h-[136px] smobile:p-[16px] laptop:p-[18px] bdesktop:p-[33px] smobile:w-full laptop:w-[280px] smobile:relative smobile:bg-white smobile:text-black smobile:hover:bg-blue-500 smobile:hover:text-white transition duration-200'
              >
                <p className='smobile:text-[16px] smobile:leading-[1] smobile:font-mundialRegular bdesktop:text-[24px]'>
                  Back To Search
                </p>
                <assets.ChevronRightSVG
                  style={{ color: 'white' }}
                  width={30}
                  height={30}
                  className='smobile:absolute smobile:bottom-0 smobile:right-0 smobile:bg-blue-500 group-hover:bg-transparent transition duration-200'
                />
              </Link>
            </div>
          )}

          {isPreview !== true && (
            <div className='smobile:w-auto smobile:h-auto'>
              <Link
                href='mailto:concierge@walkerwholesale.com'
                className='group smobile:block smobile:h-[68px] laptop:h-[126px] desktop:h-[136px] smobile:p-[16px] laptop:p-[18px] bdesktop:p-[33px] smobile:w-full laptop:w-[280px] smobile:relative smobile:bg-white smobile:text-black smobile:hover:bg-blue-500 smobile:hover:text-white transition duration-200'
              >
                <div className='smobile:w-full smobile:h-full smobile:flex smobile:flex-col'>
                  <p className='smobile:text-[16px] smobile:leading-[1] smobile:font-mundialRegular bdesktop:text-[24px]'>
                    Got An Enquiry?
                  </p>
                  <p className='smobile:text-[16px] smobile:leading-[1] smobile:font-mundialRegular bdesktop:text-[24px]'>
                    Ask Walker
                  </p>
                </div>
                <assets.ChevronRightSVG
                  style={{ color: 'white' }}
                  width={30}
                  height={30}
                  className='smobile:absolute smobile:bottom-0 smobile:right-0 smobile:bg-blue-500 group-hover:bg-transparent transition duration-200'
                />
              </Link>
            </div>
          )}
          {isPreview !== true && (
            <div className='smobile:w-auto smobile:h-auto'>
              <Link
                href={`/${data.Slug}/downloads`}
                className='group smobile:block smobile:h-[68px] laptop:h-[126px] desktop:h-[136px] smobile:p-[16px] laptop:p-[18px] bdesktop:p-[33px] smobile:w-full laptop:w-[280px] smobile:relative smobile:bg-white smobile:text-black smobile:hover:bg-blue-500 smobile:hover:text-white transition duration-200'
              >
                <div className='w-full h-full laptop:justify-between laptop:flex laptop:flex-col'>
                  <p className='smobile:text-[16px] smobile:leading-[1] smobile:font-mundialRegular bdesktop:text-[24px]'>
                    Download Project Details
                  </p>
                  <p className='smobile:text-[10px] bdesktop:text-[12px] smobile:leading-[1] smobile:font-mundialLight smobile:hidden smobile:h-0 laptop:block laptop:h-auto laptop:text-customGrey'>
                    Sections, Rental Appraisal etc
                  </p>
                </div>
                <assets.ChevronRightSVG
                  style={{ color: 'white' }}
                  width={30}
                  height={30}
                  className='smobile:absolute smobile:bottom-0 smobile:right-0 smobile:bg-blue-500 group-hover:bg-transparent transition duration-200'
                />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
