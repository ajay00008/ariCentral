'use client'

import * as React from 'react'
import JSZip from 'jszip'
import * as Sentry from '@sentry/nextjs'
import { saveAs } from 'file-saver'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import assets from '@/assets'
import { ClientDownloadsCard } from '@/components/Cards/ClientDownloadsCard'
import { trackEvent } from '@/app/actions'
import { EventType } from '@/constants/event-type'

interface Props {
  data: ActionGetPropertyBySlug
}

export async function downloadFilesAsZip (urls: string[]): Promise<void> {
  const zip = new JSZip()

  for (const url of urls) {
    try {
      const response = await fetch(url)

      if (!response.ok) {
        Sentry.captureException(new Error(`Failed to to fetch file ${url}`))
        continue
      }

      const blob = await response.blob()
      const filename = url.split('/').pop()
      if (filename !== undefined) {
        zip.file(filename, blob)
      }
    } catch (err) {
      Sentry.captureException(err)
    }
  }

  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, 'Property Downloads.zip')
}

export async function handleDownloadAll (urls: string[], slug: string): Promise<void> {
  if (urls === undefined) return
  trackEvent(slug, EventType.DOWNLOAD_CLICK)
  await downloadFilesAsZip(urls)
}

export function DownloadsSection ({ data }: Props): React.ReactNode {
  const backwardURL = `${window.origin}/${data.Slug}`.toString()
  const fileLinksArray = data.Downloads
    .map(it => it.downloadFile.data?.attributes.url ?? '')
    .filter((it) => it !== '')

  return (
    <section id='downloads' className='smobile:pt-[48px] smobile:pb-[32px] tablet:pt-[64px] laptop:pb-[64px] bdesktop:py-[96px] smobile:mx-auto laptop:max-w-[1280px] desktop:max-w-[1440px] bdesktop:max-w-[1728px]'>
      <div className='smobile:flex smobile:flex-col smobile:gap-[48px] tablet:gap-[64px] desktop:gap-[50px] bdesktop:gap-[82px  ] smobile:w-full smobile:px-[16px] tablet:px-[32px] desktop:px-[64px]'>
        <div className='smobile:flex smobile:flex-col smobile:h-fit smobile:gap-[16px] laptop:gap-[32px] desktop:gap-[27px]'>
          <Link href={backwardURL} className='smobile:flex smobile:gap-[5px] smobile:items-center' title='Return to the property page'>
            <ChevronLeft className='smobile:w-[16px] smobile:h-[16px]' style={{ color: '#464646' }} />
            <p className='smobile:font-mundialRegular smobile:text-[16px] smobile:leading-[1] smobile:text-customGrey'>{data.Name}</p>
          </Link>
          <div className='smobile:w-full smobile:flex smobile:justify-between'>
            <h1 className='smobile:font-mundialRegular smobile:text-[40px] smobile:leading-[1] desktop:text-[56px]'>Downloads</h1>
            {data.Downloads.length !== 0 && (
              <button
                type='button'
                title='Download all property files from server'
                onClick={() => {
                  void handleDownloadAll(fileLinksArray, data.Slug)
                }}
                className='group smobile:gap-[15px] smobile:items-center smobile:hidden smobile:h-0 tablet:flex tablet:h-auto'
              >
                <assets.DownloadIconSVG width={12} height={12} className='flex flex-shrink-0 fill-[#464646] group-hover:fill-black transition duration-200' />
                <p className='smobile:font-mundialRegular smobile:text-[14px] smobile:leading-[1] text-customGrey group-hover:text-black transition duration-200'>DOWNLOAD ALL</p>
              </button>
            )}
          </div>
        </div>
        <ul className='smobile:flex smobile:gap-[16px] smobile:w-full smobile:flex-col tablet:grid tablet:grid-cols-2 tablet:gap-[24px] laptop:grid-cols-4 desktop:gap-[26px] bdesktop:gap-[32px]'>
          {data.Downloads.map(item => (
            <ClientDownloadsCard key={item.id} slug={data.Slug} data={item} />
          ))}
        </ul>
      </div>
    </section>
  )
}
