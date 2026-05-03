'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import '../../app/(main)/faq/markdown-updated.css'

interface Props {
  currentCollection: FAQSubSemiCollectionElement
  currentIndex: number
  currentOpenedIndex: number
  onDropdownActiveChange: (index: number) => void
}

export function FaqDropdownCard ({
  currentCollection,
  currentOpenedIndex,
  currentIndex,
  onDropdownActiveChange
}: Props): React.ReactNode {
  if (currentCollection.collectionElementHeading === null || currentCollection.collectionElementHeading === '') return null
  const [isOpen, setIsOpen] = React.useState(false)

  function handleToggle (e: React.MouseEvent): void {
    e.preventDefault()
    onDropdownActiveChange(currentIndex)
  }

  React.useEffect(() => {
    setIsOpen(currentIndex === currentOpenedIndex)
  }, [currentOpenedIndex, currentIndex])

  return (
    <li className='smobile:flex smobile:flex-col smobile:gap-[30px]'>
      <details className='group smobile:w-full' open={isOpen}>
        <summary
          className='flex justify-between items-center smobile:font-mundialRegular smobile:text-[24px] smobile:leading-[1] smobile:text-customFAQHalfBlack smobile:pb-[25px] laptop:pb-[32px] smobile:border-b smobile:border-[#D1D1D1] cursor-pointer'
          onClick={(e) => handleToggle(e)}
        >
          {currentCollection.collectionElementHeading}
          <span className='transition-transform duration-200 group-open:rotate-180'>
            <ChevronDown className='smobile:w-[16px] smobile:h-[16px]' />
          </span>
        </summary>
        <div className='smobile:w-full smobile:h-auto markdown smobile:pt-[25px]'>
          <Markdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
          >
            {currentCollection.collectionItemMarkdown}
          </Markdown>
        </div>
      </details>
    </li>
  )
}
