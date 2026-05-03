'use client'

import * as React from 'react'
import { FaqDropdownCard } from '@/components/Cards/FaqDropdownCard'

interface Props {
  collectionData: FAQCollectionElement[]
}

interface Props2 {
  collectionData: FAQCollectionElement
}

export function FaqDropdownsList ({ collectionData }: Props): React.ReactNode {
  return (
    collectionData.map(item => (
      <div
        className='smobile:flex smobile:flex-col smobile:gap-[32px] mobile:gap-[48px] laptop:flex-row laptop:last:pb-[65px] desktop:last:pb-[70px] bdesktop:last:pb-[64px]'
        key={item.id}
        id={item.attributes.collectionName ?? item.id.toString()}
      >
        <h2 className='smobile:font-mundialRegular smobile:text-[24px] smobile:leading-[1] smobile:text-customGrey'>
          {item.attributes.collectionName}
        </h2>
        <FaqDropdownsListWithState
          collectionData={item}
        />
      </div>
    ))
  )
}

function FaqDropdownsListWithState ({ collectionData }: Props2): React.ReactNode {
  const [openItemIndex, setOpenItemIndex] = React.useState(0)

  function handleDropdownActiveChange (index: number): void {
    if (index === openItemIndex) return setOpenItemIndex(-1)
    setOpenItemIndex(index)
  }

  return (
    <ul
      className='smobile:flex smobile:w-full smobile:gap-[20px] smobile:flex-col laptop:w-[55%] laptop:ml-auto laptop:mr-[143px] desktop:mr-[207px]'
    >
      {collectionData.attributes.collectionItems.collectionElement.map((item, index) => (
        <FaqDropdownCard
          key={item.id}
          currentIndex={index}
          currentOpenedIndex={openItemIndex}
          currentCollection={item}
          onDropdownActiveChange={handleDropdownActiveChange}
        />
      ))}
    </ul>
  )
}
