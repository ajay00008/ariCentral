'use client'

import * as React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { requestAccess } from '@/app/actions'
import { heroImages } from '@/lib/hero-images'
import Link from 'next/link'

interface AccessRequestModalProps {
  setShowModal: (open: boolean) => void
  isOpen: boolean
  data: FullProperty | PropertyMain
}

export function AccessRequestModal ({
  setShowModal,
  isOpen = false,
  data
}: AccessRequestModalProps): React.ReactNode {
  const [isRequestAccessLoading, setIsRequestAccessLoading] =
    React.useState<boolean>(false)
  const [isImageLoaded, setIsImageLoaded] = React.useState<boolean>(false)

  const heroImage = heroImages(data.attributes)[0]

  const handleRequestAccess = async (e: React.MouseEvent): Promise<void> => {
    e.preventDefault()
    setIsRequestAccessLoading(true)

    if (data?.attributes?.RequestStatus === 'not_requested') {
      const response = await requestAccess(data.attributes.Slug)
      if (response.success) {
        data.attributes.RequestStatus = 'pending'
      }
    }
    setIsRequestAccessLoading(false)
  }

  const handleRequestAccessClick = (e: React.MouseEvent): void => {
    void handleRequestAccess(e)
  }

  const isSubmissionReceived =
    data?.attributes?.RequestStatus !== 'not_requested'

  return (
    <Dialog open={isOpen} onOpenChange={setShowModal}>
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: '100%', opacity: 0 }}
        transition={{ duration: 2, ease: 'easeOut' }}
      >
        <DialogContent className='sm:max-w-[425px] flex flex-col p-0 smobile:max-w-[100vw] smobile:h-full smobile:overflow-y-auto smobile:max-h-[100vh] tablet:h-auto smobile:fixed rounded-none'>
          {heroImage !== undefined && (
            <Image
              src={
                isImageLoaded
                  ? heroImage.Image.data.attributes.url
                  : '/empty-skeleton.jpg'
              }
              onLoad={() => setIsImageLoaded(true)}
              alt='Modal Hero Image'
              width={400}
              height={200}
              className='w-full max-h-[440px] object-cover'
            />
          )}
          {heroImage === undefined && (
            <Image
              src='/empty-skeleton.jpg'
              alt='Modal Hero Image'
              width={400}
              height={200}
              className='w-full max-h-[440px] object-cover'
            />
          )}
          <div className='flex flex-col w-full gap-2 py-4 px-8'>
            <DialogHeader>
              <DialogTitle className='font-mundialRegular text-start text-[20px] font-light'>
                {isSubmissionReceived
                  ? 'Submission received.'
                  : `Request access to sell ${data?.attributes?.Name ?? ''}`}
              </DialogTitle>
            </DialogHeader>
            {isSubmissionReceived
              ? (
                <div>
                  <p className='font-mundialLight text-[16px]'>
                    Thank you for your interest in {data?.attributes?.Name ?? ''}.
                    You will receive a notification via email when you have been
                    granted access.
                  </p>
                  <Button
                    onClick={() => setShowModal(false)}
                    className='smobile:w-full smobile:h-auto smobile:min-h-[48px] smobile:mx-auto smobile:bg-orange smobile:font-mundialRegular smobile:text-customWhite smobile:font-normal smobile:text-[14px] smobile:leading-[1] rounded-none p-1 mt-4'
                  >
                    Close
                  </Button>
                </div>
                )
              : (
                <div className='grid gap-3'>
                  <p className='font-mundialLight text-[12px]'>
                    By submitting an enquiry, you have read, understood and agreed
                    to our
                    <Link
                      className='underline ml-1'
                      href='/terms'
                      rel='noopener noreferrer'
                      target='_blank'
                    >
                      Terms of Use
                    </Link>
                    .
                  </p>
                  <Button
                    disabled={
                    data?.attributes?.RequestStatus !== 'not_requested' ||
                    isRequestAccessLoading
                  }
                    onClick={handleRequestAccessClick}
                    className='smobile:w-full smobile:h-auto smobile:min-h-[48px] smobile:mx-auto smobile:bg-orange smobile:font-mundialRegular disabled:opacity-100 smobile:text-customWhite smobile:font-normal smobile:text-[14px] disabled:bg-grey disabled:text-nativeBlack smobile:leading-[1] rounded-none p-1'
                  >
                    <p className='flex gap-2 items-center'>REQUEST ACCESS</p>
                  </Button>
                </div>
                )}
          </div>
        </DialogContent>
      </motion.div>
    </Dialog>
  )
}
