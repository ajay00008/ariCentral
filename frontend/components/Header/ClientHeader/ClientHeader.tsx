'use client'

import * as React from 'react'
import assets from '@/assets'
import { handleDownloadAll } from '@/components/DynamicMainComponents/DownloadsSection'
import { useBurgerProvider } from '@/providers/BurgerProvider'
import { ChevronDown } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { trackEvent } from '@/app/actions'
import { EventType } from '@/constants/event-type'

interface Props {
  data?: ActionGetPropertyBySlug
  currency?: Currency
  isSearchPage?: boolean
  isFAQ?: boolean
  collectionData?: FAQCollectionElement[]
  userData: SessionType | null
  changeCurrency?: (currency: string) => void
  isPreview?: boolean
  isPropertyHeader?: boolean
}

export function ClientHeader ({ data, isSearchPage, isFAQ, collectionData, currency, userData, changeCurrency, isPreview, isPropertyHeader = true }: Props): React.ReactNode {
  const { isModalOpen, openModal, closeModal } = useBurgerProvider()
  const [isFixed, setIsFixed] = React.useState<boolean>(false)
  const [activeSection, setActiveSection] = React.useState<string | null>('hero')
  const [activeLiItem, setActiveLiItem] = React.useState<string | null>(null)
  const [isProgrammaticScroll, setIsProgrammaticScroll] = React.useState<boolean>(false)
  const isProgrammaticRef = React.useRef(isProgrammaticScroll)
  const headerRef = React.useRef<HTMLDivElement>(null)
  const ElementStyles = isFixed
    ? 'smobile:hidden laptop:h-auto laptop:flex laptop:fixed laptop:w-full laptop:bg-customGreyRGBA laptop:top-0 laptop:left-0'
    : 'smobile:hidden laptop:relative laptop:h-auto laptop:flex laptop:w-full'
  const ElementStyles2 = isFixed
    ? 'smobile:h-auto smobile:flex smobile:fixed smobile:items-center smobile:w-full smobile:px-[19px] smobile:py-[16px] smobile:gap-0 smobile:justify-between smobile:bg-customGreyRGBA smobile:top-0 smobile:left-0 tablet:py-[19px] tablet:px-[32px] laptop:px-[64px]'
    : 'smobile:relative smobile:py-[19px] smobile:px-[16px] smobile:h-auto smobile:flex smobile:justify-between smobile:items-center smobile:w-full tablet:py-[19px] tablet:px-[32px] laptop:px-[64px]'
  const heroSectionVisible = activeSection === 'hero'
    ? 'font-mundialDemiBold text-customBlack'
    : 'text-customGrey font-mundialLight'
  const tableSectionVisible = activeSection === 'table'
    ? 'font-mundialDemiBold text-customBlack'
    : 'text-customGrey font-mundialLight'
  const summarySectionVisible = activeSection === 'summary'
    ? 'font-mundialDemiBold text-customBlack'
    : 'text-customGrey font-mundialLight'
  const floorPlansSectionVisible = activeSection === 'floorPlans'
    ? 'font-mundialDemiBold text-customBlack'
    : 'text-customGrey font-mundialLight'
  const galleriesSectionVisible = activeSection === 'galleries'
    ? 'font-mundialDemiBold text-customBlack'
    : 'text-customGrey font-mundialLight'
  const viewsSectionVisible = activeSection === 'views'
    ? 'font-mundialDemiBold text-customBlack'
    : 'text-customGrey font-mundialLight'
  const googleMapSectionVisible = activeSection === 'map'
    ? 'font-mundialDemiBold text-customBlack'
    : 'text-customGrey font-mundialLight'

  const fileLinksArray = data?.Downloads?.map(it => it.downloadFile.data?.attributes.url ?? '').filter(it => it !== '') ?? []
  const isViewsEmpty = data?.ViewsGallery?.SubGallery?.every(item => item.Media.data === null) ?? false
  const isFacilitiesEmpty = data?.AmenitiesGallery?.SubGallery?.every(item => item.Media.data === null) ?? false
  const isExteriorEmpty = data?.Gallery?.SubGallery?.every(item => item.Media.data === null) ?? false
  const isInteriorEmpty = data?.InteriorGallery?.SubGallery?.every(item => item.Media.data === null) ?? false
  const downloadRef = React.useRef<HTMLAnchorElement>(null)
  const isFloorPlansEmpty = data?.floors?.data === undefined || data.floors.data.length === 0
  const isMapEmpty = data?.Address === null || data?.Address === undefined || data.Address === ''
  function handleSelectValueChange (e: React.ChangeEvent<HTMLSelectElement>): void {
    changeCurrency?.(e.target.value)
  }

  React.useEffect(() => {
    function handleScroll (): void {
      if (headerRef.current !== null) {
        if (window.scrollY > 80) {
          setIsFixed(true)
        } else {
          setIsFixed(false)
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleDownload = (slug: string): void => {
    if (downloadRef.current !== null) {
      const timestamp = new Date().getTime()
      downloadRef.current.href = `/api/property/brochure?slug=${slug.trim()}&t=${timestamp}`
      downloadRef.current.click()
    }
    trackEvent(slug, EventType.DOWNLOAD_CLICK)
  }

  React.useEffect(() => {
    const sections = document.querySelectorAll('section')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (entry.target.id !== 'shadow-host-companion') {
              setActiveSection(entry.target.id)
            } else {
              setActiveSection('hero')
            }
          }
        })
      },
      { threshold: 0.8 }
    )

    sections.forEach((section) => {
      observer.observe(section)
    })

    return () => {
      sections.forEach((section) => {
        observer.unobserve(section)
      })
    }
  }, [])

  React.useEffect(() => {
    const links = document.querySelectorAll('a[href^="#"]')

    function handleSmoothScroll (e: Event): void {
      e.preventDefault()

      const target = e.currentTarget as HTMLAnchorElement
      const targetHref = target.getAttribute('href')
      const targetId = target.getAttribute('href')?.substring(1) ?? ''
      const targetElement = document.getElementById(targetId)

      if (targetElement === null) {
        return
      }

      setIsProgrammaticScroll(true)
      isProgrammaticRef.current = true

      let offsetTop = targetElement.getBoundingClientRect().top + window.scrollY - 62

      if (targetId === 'galleries' || targetId === 'views') {
        offsetTop += window.innerWidth >= 1280 ? 96 : 56
      }

      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      })

      setActiveSection(targetHref)
      setActiveLiItem(targetHref?.replace('#', '') ?? '')

      setTimeout(() => {
        setIsProgrammaticScroll(false)
        isProgrammaticRef.current = false
      }, 1000)
    }

    links.forEach((link) => {
      link.addEventListener('click', handleSmoothScroll)
    })

    return () => {
      links.forEach((link) => {
        link.removeEventListener('click', handleSmoothScroll)
      })
    }
  }, [])

  React.useEffect(() => {
    function handleScroll (): void {
      if (!isProgrammaticRef.current) {
        setActiveLiItem((prevActiveLiItem) => {
          if (prevActiveLiItem !== null) {
            isProgrammaticRef.current = false
            return null
          }
          return prevActiveLiItem
        })
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  function handleToggleMenu (): void {
    if (isModalOpen) {
      closeModal()
    } else {
      openModal()
    }
  }

  return (
    <div ref={headerRef} className='w-full flex flex-col'>
      <div className='border-b border-[#D1D1D1] relative'>
        <div className='flex justify-between items-center w-full relative smobile:p-[16px] tablet:px-[32px] laptop:py-[24px] laptop:px-[64px] max-w-[2000px] mx-auto' id='header-body'>
          <Link
            href='/search'
            className='h-auto w-auto'
            aria-label='Check all properties link'
            onClick={() => {
              location.href = '/search'
            }}
            title='See all properties'
          >
            <Image
              src='/logo.svg'
              alt='Logo image'
              width={69}
              height={40}
              priority
              className='max-w-[55px] max-h-[32px] object-contain'
            />
          </Link>
          <div className='flex justify-end w-full items-center md:ml-auto smobile:gap-[4px] mobile:gap-[8px] tablet:gap-[12px]'>
            {currency !== undefined && (
              <div className='relative w-[80px]'>
                <select
                  className='w-full px-[15px] py-[9px] rounded-[60px] text-black text-[12px] leading-[1] appearance-none bg-white border border-[#D1D1D1] focus:ring focus:ring-orange-200 transition duration-200'
                  value={currency?.BaseCurrency ?? 'AUD'}
                  onChange={handleSelectValueChange}
                  aria-label='Currency change select'
                >
                  <option value='AUD' className='font-mundialRegular text-black text-[12px] leading-[1]'>$ AUD</option>
                  <option value='USD' className='font-mundialRegular text-black text-[12px] leading-[1]'>$ USD</option>
                  <option value='EUR' className='font-mundialRegular text-black text-[12px] leading-[1]'>€ EUR</option>
                  <option value='SGD' className='font-mundialRegular text-black text-[12px] leading-[1]'>$ SGD</option>
                  <option value='GBP' className='font-mundialRegular text-black text-[12px] leading-[1]'>£ GBP</option>
                  <option value='CAD' className='font-mundialRegular text-black text-[12px] leading-[1]'>$ CAD</option>
                  <option value='NZD' className='font-mundialRegular text-black text-[12px] leading-[1]'>$ NZD</option>
                  <option value='BTC' className='font-mundialRegular text-black text-[12px] leading-[1]'>₿ BTC</option>
                </select>
                <ChevronDown width={12} height={12} className='absolute top-[50%] -translate-y-2/4 right-[10%] pointer-events-none' />
              </div>
            )}
            {userData !== null && isPreview !== true && (
              <button
                type='button'
                onClick={handleToggleMenu}
                className='smobile:relative smobile:flex smobile:shrink-0 smobile:px-[9px] smobile:py-[9px] smobile:rounded-[60px] smobile:border smobile:border-[#D1D1D1] smobile:bg-white'
              >
                <Image
                  src={String(userData.user?.avatar?.url)}
                  alt='User avatar image'
                  width={24}
                  height={24}
                  className='smobile:w-[24px] smobile:h-[24px] smobile:object-cover smobile:max-w-[24px] smobile:max-h-[24px] smobile:rounded-[1000px] smobile:absolute smobile:left-[4px] smobile:top-[3px]'
                />
                <p className='smobile:font-mundialRegular smobile:ml-[30px] smobile:mr-[30px] smobile:text-[12px] smobile:text-black  smobile:text-ellipsis  smobile:leading-[1]'>
                  {userData.user?.firstName} {userData.user?.surname}
                </p>
                <ChevronDown width={12} height={12} className={`absolute top-[50%] -translate-y-2/4 right-[10%] pointer-events-none ${isModalOpen ? 'rotate-180' : ''}`} />
              </button>
            )}
          </div>
        </div>
      </div>
      {(isFixed && isSearchPage === undefined) && <div className='w-full h-[62px] opacity-0 select-none' />}
      {(isSearchPage === undefined && isPropertyHeader) && (
        <div className={ElementStyles}>
          <div className='max-w-[2000px] mx-auto flex justify-between items-center w-full laptop:py-[8px] laptop:px-[64px]'>
            <ul className='flex laptop:gap-[24px]'>
              <li className='w-auto'>
                <Link href='#hero' className={`w-fit hover:text-customBlack hover:font-mundialDemiBold laptop:text-[16px] leading-[1] scroll-smooth ${heroSectionVisible}`}>Overview</Link>
              </li>
              <li>
                <Link href='#summary' className={`w-fit  hover:text-customBlack hover:font-mundialDemiBold laptop:text-[16px] leading-[1] scroll-smooth ${summarySectionVisible}`}>Summary</Link>
              </li>
              {(!isExteriorEmpty || !isFacilitiesEmpty || !isInteriorEmpty) && (
                <li>
                  <Link href='#galleries' className={`w-fit hover:text-customBlack hover:font-mundialDemiBold laptop:text-[16px] leading-[1] scroll-smooth ${galleriesSectionVisible}`}>Gallery</Link>
                </li>
              )}
              {!isFloorPlansEmpty && (
                <li>
                  <Link href='#table' className={`w-fit hover:text-customBlack hover:font-mundialDemiBold laptop:text-[16px] leading-[1] scroll-smooth ${tableSectionVisible}`}>Availability</Link>
                </li>
              )}
              {!isFloorPlansEmpty && (
                <li>
                  <Link href='#floorPlans' className={`w-fit hover:text-customBlack hover:font-mundialDemiBold laptop:text-[16px] leading-[1] scroll-smooth ${floorPlansSectionVisible}`}>Floor Plans</Link>
                </li>
              )}
              {!isViewsEmpty && (
                <li>
                  <Link href='#views' className={`w-fit hover:text-customBlack hover:font-mundialDemiBold laptop:text-[16px] leading-[1] scroll-smooth ${viewsSectionVisible}`}>Views</Link>
                </li>
              )}
              {!isMapEmpty && (
                <li>
                  <Link href='#map' className={`w-fit hover:text-customBlack hover:font-mundialDemiBold laptop:text-[16px] leading-[1] scroll-smooth ${googleMapSectionVisible}`}>Map</Link>
                </li>
              )}
            </ul>
            <div className='flex gap-3'>
              {data?.Brochure?.data !== null && data !== undefined && isPreview !== true && (
                <div>
                  <button
                    type='button'
                    onClick={() => {
                      handleDownload(data.Slug)
                    }}
                    title='Download property brochure'
                    className='group flex shrink-0 bg-transparent items-center p-[15px] laptop:gap-[8px] transition duration-200'
                  >
                    <assets.DownloadIconSVG
                      width={12}
                      height={12}
                      className='flex flex-shrink-0 fill-[#464646] group-hover:fill-black transition duration-200'
                    />
                    <p className='laptop:font-mundialLight laptop:text-[16px] laptop:leading-[1] text-customGrey group-hover:text-black transition duration-200'>
                      Download Brochure
                    </p>
                  </button>
                  <a
                    ref={downloadRef}
                    href={`/api/property/brochure?slug=${data.Slug.trim()}`}
                    download
                    className='hidden'
                  />
                </div>
              )}
              {
                isPreview !== true && (
                  <button
                    type='button'
                    title='Download Property Files'
                    onClick={() => {
                      if (data !== null && data !== undefined) {
                        void handleDownloadAll(fileLinksArray, data.Slug)
                      }
                    }}
                    className='group flex shrink-0 bg-transparent items-center p-[15px] laptop:gap-[8px] transition duration-200'
                  >
                    <assets.ShareIconSVG width={12} height={12} className='flex flex-shrink-0 fill-[#464646] group-hover:fill-black transition duration-200' />
                    <p className='laptop:font-mundialLight laptop:text-[16px] laptop:leading-[1] text-customGrey group-hover:text-black transition duration-200'>Share</p>
                  </button>
                )
              }
            </div>
            <div className='laptop:absolute laptop:w-full laptop:left-0 laptop:bottom-0 smobile:flex smobile:bg-[#D1D1D1] laptop:h-[1px]' />
          </div>
        </div>
      )}
      {(isFAQ !== undefined) && (
        <div className={ElementStyles2}>
          <ul className='flex smobile:gap-[24px] overflow-hidden overflow-x-auto w-full'>
            {collectionData?.map((item) => {
              const isActive = activeLiItem === item.attributes.collectionName
              const ElementActiveStyles = isActive
                ? 'w-fit text-customBlack font-mundialDemiBold text-[16px] leading-[1] scroll-smooth text-nowrap'
                : 'w-fit hover:text-customBlack hover:font-mundialDemiBold text-customGrey font-mundialLight text-[16px] leading-[1] scroll-smooth text-nowrap'
              return (
                <li
                  className='w-auto'
                  key={item.id}
                >
                  <Link
                    href={`#${item.attributes.collectionName ?? item.id}`}
                    className={ElementActiveStyles}
                    id={item.id.toString()}
                  >
                    {item.attributes.collectionName ?? item.id}
                  </Link>
                </li>
              )
            })}
          </ul>
          <div className='smobile:absolute smobile:w-full smobile:left-0 smobile:bottom-0 smobile:flex smobile:bg-[#D1D1D1] smobile:h-[1px]' />
        </div>
      )}
    </div>
  )
}
