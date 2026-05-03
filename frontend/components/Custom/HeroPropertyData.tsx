import * as React from 'react'
import { useFormProvider } from '@/providers/FormModalProvider'
import { getDomain } from '@/utils/get-domain'
import Link from 'next/link'
import { trackEvent } from '@/app/actions'
import { EventType } from '@/constants/event-type'

interface Props {
  data: ActionGetPropertyBySlug
  isCommissionEnabled: boolean
  isPreview?: boolean
}

export function HeroPropertyData ({ data, isCommissionEnabled, isPreview }: Props): React.ReactNode {
  const { openModal } = useFormProvider()

  return (
    <div className='smobile:flex smobile:flex-col smobile:h-fit smobile:mt-[30px] mobile:mt-[33px] laptop:mt-0 laptop:h-full laptop:justify-between'>
      <div className='flex flex-col'>
        <p className='smobile:font-mundialRegular smobile:text-[12px] smobile:leading-[1] smobile:mb-[24px] smobile:text-customGrey laptop:text-[16px]'>
          {data.StageOfBuild.replace(/([A-Z])/g, (match, p1, offset) => {
            return (offset > 0 ? '-' : '') + (p1 as string).toLowerCase()
          }).replace(/^./, str => str.toUpperCase()).trim()}
        </p>
        <h1 className='smobile:font-mundialRegular smobile:text-[40px] smobile:leading-[1] smobile:mb-[24px] desktop:text-[56px]'>
          {data.Name}
        </h1>
        {isCommissionEnabled && (
          <div className='smobile:flex smobile:items-center smobile:w-[183px] smobile:h-[48px] desktop:w-[240px] smobile:mb-[25px] laptop:mb-[24px]'>
            <div className='smobile:w-[8px] smobile:min-w-[8px] smobile:h-full smobile:bg-orange' />
            <div className='smobile:w-fit max-h-[48px] smobile:py-[14px] smobile:px-[24px] bg-comissionGrey desktop:pr-[32px] desktop:pl-[40px]'>
              <p className='smobile:font-mundialRegular smobile:text-[16px] smobile:leading-[1] desktop:text-[20px] smobile:w-max'>
                {data.Commission}% commission
              </p>
            </div>
          </div>
        )}
        <div className='smobile:w-[48px] smobile:h-[0.5px] smobile:bg-heroBreakLineBg laptop:hidden laptop:h-0' />
        <p className='smobile:font-mundialRegular smobile:text-[16px] smobile:leading-[1] smobile:whitespace-pre-line smobile:my-[23px] laptop:font-mundialLight laptop:mt-0 laptop:mb-[24px] desktop:text-[20px]'>
          {data.Address}
        </p>
        <div className='smobile:w-[48px] smobile:h-[0.5px] smobile:bg-heroBreakLineBg laptop:w-[24px]' />
        {data.ProjectWebsiteLink !== '' && data.ProjectWebsiteLink !== null && !data.ProjectWebsiteLink.includes(' disabled') && (
          <Link
            className='smobile:font-mundialRegular smobile:text-[16px] smobile:leading-[1] smobile:whitespace-pre-line smobile:mt-[24px] smobile:mb-[30px] laptop:mt-[24px] laptop:mb-auto laptop:pb-[24px] desktop:font-mundialLight desktop:text-[20px]'
            href={data.ProjectWebsiteLink}
            prefetch={false}
            rel='noopener noreferrer'
            target='_blank'
          >
            {getDomain(data.ProjectWebsiteLink)}
          </Link>
        )}
      </div>
      <div className='flex flex-col'>
        <div className='smobile:w-full smobile:gap-[8px] smobile:flex smobile:flex-col'>
          {(data.BookACallLink !== null && !data.BookACallLink.includes(' disabled')) && isPreview !== true && (
            <Link
              href='#'
              onClick={(e) => {
                e.preventDefault()
                openModal(data.BookACallLink, undefined)
              }}
              title='BOOK A CALL'
              className='smobile:shrink-0 smobile:bg-black smobile:items-center smobile:text-center smobile:text-white smobile:py-[21px] smobile:font-mundialRegular smobile:text-[16px] smobile:leading-[1] smobile:hover:bg-[#303030] tablet:max-w-[395px] laptop:text-[14px] transition duration-200'
            >
              BOOK A CALL
            </Link>
          )}
          {(data.MakeAnOfferLink !== null && !data.MakeAnOfferLink.includes(' disabled')) && isPreview !== true && (
            <Link
              href='#'
              onClick={(e): void => {
                e.preventDefault()
                trackEvent(data.Slug, EventType.MAKE_OFFER_CLICK)
                openModal(data.MakeAnOfferLink, undefined)
              }}
              title='MAKE AN OFFER'
              className='smobile:shrink-0 smobile:py-[21px] smobile:text-white smobile:font-mundialRegular smobile:text-[16px] smobile:leading-[1] smobile:text-center smobile:items-center smobile:bg-orange smobile:hover:bg-[#ED8E4E] tablet:max-w-[395px] laptop:text-[14px] transition duration-200'
            >
              MAKE AN OFFER
            </Link>
          )}
        </div>
      </div>
    </div>
  )
}
