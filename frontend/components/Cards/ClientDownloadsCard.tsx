'use client'

import * as Sentry from '@sentry/nextjs'
import assets from '@/assets'
import { trackEvent } from '@/app/actions'
import { EventType } from '@/constants/event-type'

interface Props {
  data: DownloadsItem
  slug: string
}

export function ClientDownloadsCard ({ data, slug }: Props): React.ReactNode {
  async function downloadFile (url: string): Promise<void> {
    try {
      const response = await fetch(url)

      if (!response.ok) {
        throw new Error('Failed to fetch the file.')
      }

      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = url.split('/').pop() ?? ''
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (err) {
      Sentry.captureException(err)
    }
  }

  async function handleDownload (url: string): Promise<void> {
    if (url === null || url === undefined) return
    trackEvent(slug, EventType.DOWNLOAD_CLICK)
    await downloadFile(url)
  }

  return (
    <li className='smobile:flex smobile:flex-col smobile:w-full smobile:min-h-[158px] smobile:bg-white smobile:p-[20px] desktop:p-[24px] bdesktop:p-[32px] smobile:gap-[22px] laptop:min-w-[285px] desktop:min-w-[308px] bdesktop:min-w-[376px]'>
      <div className='smobile:flex smobile:flex-col smobile:gap-[20px]'>
        {data.Icon === 'Image'
          ? (
            <assets.DownloadsImageSelectSVG width={14} height={14} className='smobile:w-[14px] smobile:h-[14px] desktop:w-[15px] bdesktop:w-[20px] desktop:h-[20px] bdesktop:h-[20px]' />
            )
          : data.Icon === 'Chart'
            ? (
              <assets.DownloadsChartSelectSVG width={14} height={14} className='smobile:w-[14px] smobile:h-[14px] desktop:w-[15px] bdesktop:w-[20px] desktop:h-[20px] bdesktop:h-[20px]' />
              )
            : data.Icon === 'Building'
              ? (
                <assets.DownloadsBuildingSelectSVG width={14} height={14} className='smobile:w-[14px] smobile:h-[14px] desktop:w-[15px] bdesktop:w-[20px] desktop:h-[20px] bdesktop:h-[20px]' />
                )
              : (
                <assets.DownloadsFloorPlanSelectSVG width={14} height={14} className='smobile:w-[14px] smobile:h-[14px] desktop:w-[15px] bdesktop:w-[20px] desktop:h-[20px] bdesktop:h-[20px]' />
                )}
        <p className='smobile:font-mundialRegular smobile:text-[24px] smobile:leading-[1]'>{data.downloadName}</p>
      </div>
      <button
        type='button'
        onClick={() => {
          void handleDownload(String(data.downloadFile?.data?.attributes?.url))
        }}
        title='Download element from server'
        className='smobile:flex smobile:gap-[10px] smobile:p-[14px] smobile:items-center smobile:justify-center smobile:bg-orange smobile:max-w-[187px]'
      >
        <assets.DownloadIconSVG width={12} height={12} className='flex smobile:w-[10px] smobile:h-[10px] flex-shrink-0 fill-[#FFFFFF] group-hover:fill-black transition duration-200' />
        <p className='smobile:font-mundialRegular smobile:text-[14px] smobile:leading-[1] text-white group-hover:text-black transition duration-200'>DOWNLOAD</p>
      </button>
    </li>
  )
}
