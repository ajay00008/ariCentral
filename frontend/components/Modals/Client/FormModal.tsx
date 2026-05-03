'use client'

import * as React from 'react'
import { closeModalWithAnimation, openModal } from './UnitDetailsModal'
import { useFormProvider } from '@/providers/FormModalProvider'
import { X } from 'lucide-react'
import DOMPurify from 'dompurify'

export function FormModal (): React.ReactNode {
  const { closeModal, isModalOpen, iframeCode, isNested } = useFormProvider()
  const [loading, setLoading] = React.useState(true)
  const [sanitizedContent, setSanitizedContent] = React.useState('')

  function handleCloseModal (): void {
    closeModalWithAnimation('formModal', isNested)
    closeModal()
  }

  function handleEscape (e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      handleCloseModal()
    }
  }

  function handleBackdropClick (e: React.MouseEvent<HTMLDivElement>): void {
    if (e.target === e.currentTarget) {
      handleCloseModal()
    }
  }

  React.useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('keydown', (e) => handleEscape(e))

      return () => {
        document.removeEventListener('keydown', (e) => handleEscape(e))
      }
    }
  }, [isModalOpen])

  React.useEffect(() => {
    if (isModalOpen) openModal('formModal')
  }, [isModalOpen])

  React.useEffect(() => {
    if (isModalOpen) {
      const cleanHTML = DOMPurify.sanitize(iframeCode, {
        ALLOWED_TAGS: ['iframe', 'div', 'span', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'b', 'i', 'strong', 'em', 'br', 'script'],
        ALLOWED_ATTR: [
          'src',
          'style',
          'width',
          'height',
          'frameborder',
          'allow',
          'allowfullscreen',
          'border',
          'border-radius',
          'id',
          'data-*',
          'title',
          'target',
          'rel',
          'href'
        ]
      })
      setSanitizedContent(cleanHTML)
      setLoading(false)
    }
  }, [isModalOpen])

  return (
    <div
      id='formModal'
      className='fixed inset-0 items-center justify-center z-50 bg-black bg-opacity-30 hidden'
      onClick={handleBackdropClick}
    >
      <div className='bg-white rounded-lg p-8 mr-auto h-screen w-full overflow-scroll'>
        <div className='flex justify-end'>
          <button onClick={() => handleCloseModal()} className='text-gray-600 hover:text-gray-800'>
            <X width={26} height={26} />
          </button>
        </div>
        {loading
          ? (
            <div className='flex flex-col w-full justify-center items-center h-full text-3xl text-black'>Loading...</div>
            )
          : (
            <div className='flex flex-col w-full justify-around h-full' dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
            )}
      </div>
    </div>
  )
}
