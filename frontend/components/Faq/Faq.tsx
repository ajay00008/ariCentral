'use client'

import * as React from 'react'
import { FaqDropdownsList } from '@/components/Lists/FaqDropdownsList'

interface Props {
  collectionData: FAQCollectionElement[]
}

export function Faq ({ collectionData }: Props): React.ReactNode {
  return (
    <section className='mx-auto laptop:max-w-[1280px] desktop:max-w-[1440px] bdesktop:max-w-[1728px] w-full h-auto'>
      <div className='smobile:flex smobile:px-[16px] tablet:px-[32px] desktop:px-[64px] smobile:flex-col smobile:gap-[32px] mobile:gap-[55px] tablet:gap-[48px] laptop:gap-[65px] desktop:gap-[70px] bdesktop:gap-[64px]'>
        <div className='smobile:flex smobile:py-[48px] tablet:py-[65px] border-b border-[#D1D1D1]'>
          <h2 className='smobile:font-mundialRegular smobile:text-[40px] desktop:text-[56px] smobile:leading-[1]'>
            Frequently Asked Questions
          </h2>
        </div>
        <FaqDropdownsList
          collectionData={collectionData}
        />
      </div>
    </section>
  )
}
