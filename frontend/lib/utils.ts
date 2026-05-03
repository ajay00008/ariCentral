import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

import {
  mediaNormalizer,
  heroNormalizer,
  galleryNormalizer,
  floorNormalizer,
  listNormalizer,
  downloadNormalizer
} from './normalizers'

export function cn (...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}

export const transformPropertyResponse = (data: unknown): ActionGetPropertyBySlug => {
  const dataObj = typeof data === 'object' && data !== null ? data as Record<string, unknown> : {}

  return {
    Name: typeof dataObj.Name === 'string' ? dataObj.Name : '',
    Slug: typeof dataObj.Slug === 'string' ? dataObj.Slug : '',
    Address: typeof dataObj.Address === 'string' ? dataObj.Address : '',
    Architect: typeof dataObj.Architect === 'string' ? dataObj.Architect : '',
    Builder: typeof dataObj.Builder === 'string' ? dataObj.Builder : '',
    Developer: typeof dataObj.Developer === 'string' ? dataObj.Developer : '',
    BookACallLink: typeof dataObj.BookACallLink === 'string' ? dataObj.BookACallLink : '',
    MakeAnOfferLink: typeof dataObj.MakeAnOfferLink === 'string' ? dataObj.MakeAnOfferLink : '',
    ProjectWebsiteLink: typeof dataObj.ProjectWebsiteLink === 'string' ? dataObj.ProjectWebsiteLink : '',
    RegisterForUpdatesCode: typeof dataObj.RegisterForUpdatesCode === 'string' ? dataObj.RegisterForUpdatesCode : '',
    DealType: typeof dataObj.DealType === 'string' ? dataObj.DealType : '',
    Summary: typeof dataObj.Summary === 'string' ? dataObj.Summary : '',
    Commission: typeof dataObj.Commission === 'number' ? dataObj.Commission : 0,
    StageOfBuild: typeof dataObj.StageOfBuild === 'string' ? dataObj.StageOfBuild : '',
    PageView: typeof dataObj.PageView === 'number' ? dataObj.PageView : 0,
    MakeOfferButtonClicks: typeof dataObj.MakeOfferButtonClicks === 'number' ? dataObj.MakeOfferButtonClicks : 0,
    DownloadButtonClicks: typeof dataObj.DownloadButtonClicks === 'number' ? dataObj.DownloadButtonClicks : 0,
    createdAt: typeof dataObj.createdAt === 'string' ? dataObj.createdAt : '',
    shareToken: typeof dataObj.shareToken === 'string' ? dataObj.shareToken : null,
    Approved: typeof dataObj.Approved === 'boolean' ? dataObj.Approved : false,
    floors: {
      data: Array.isArray(dataObj.floors)
        ? dataObj.floors.map(floorNormalizer.normalizeFloor)
        : []
    },
    ViewsGallery: galleryNormalizer.normalizeGallery(dataObj.ViewsGallery),
    InteriorGallery: galleryNormalizer.normalizeGallery(dataObj.InteriorGallery),
    AmenitiesGallery: galleryNormalizer.normalizeGallery(dataObj.AmenitiesGallery),
    Gallery: galleryNormalizer.normalizeGallery(dataObj.Gallery),
    HeroImage: {
      data: (() => {
        const normalized = heroNormalizer.normalizeHeroImage(dataObj.HeroImage)
        return normalized.data?.filter((item): item is StrapiMedia => item !== null) ?? null
      })()
    },
    HeroImages: heroNormalizer.normalizeHeroImages(dataObj.HeroImages),
    Brochure: {
      data: (() => {
        const brochureData = dataObj.Brochure as Record<string, unknown> | undefined
        const media = brochureData?.data
        return typeof media === 'object' && media !== null
          ? mediaNormalizer.normalizeMedia(media)
          : null
      })()
    },
    PDFImages: {
      data: (() => {
        const pdfImagesData = dataObj.PDFImages as Record<string, unknown> | undefined
        const mediaList = pdfImagesData?.data
        return Array.isArray(mediaList)
          ? mediaNormalizer.normalizeMediaArray(mediaList)
          : null
      })()
    },
    Facilities: listNormalizer.normalizePropertyList(dataObj.Facilities),
    Details: listNormalizer.normalizePropertyList(dataObj.Details),
    Dates: listNormalizer.normalizePropertyList(dataObj.Dates),
    Downloads: downloadNormalizer.normalizeDownloads(
      Array.isArray(dataObj.Downloads) ? dataObj.Downloads : []
    )
  }
}

export function getUserFullName (user: { firstName?: string | null, surname?: string | null }): string {
  const first = typeof user.firstName === 'string' && user.firstName.trim().length > 0 ? user.firstName.trim() : ''
  const last = typeof user.surname === 'string' && user.surname.trim().length > 0 ? user.surname.trim() : ''
  return (first + (last.length > 0 ? ` ${last}` : '')).trim()
}

export function parseAddress (raw: string): ParsedAddress[] {
  const blocks: string[] = raw.trim().split(/\n\s*\n/)

  return blocks.map((block: string): ParsedAddress => {
    const lines: string[] = block.split('\n').map((l: string) => l.trim())

    const address1 = lines[0] !== null ? lines[0] : ''
    let city = ''
    let region = ''
    let postalCode = ''
    let country = 'Australia'

    for (let i = 1; i < lines.length; i++) {
      const line: string = lines[i]

      if (/^\d{4,6}$/.test(line)) {
        postalCode = line
      } else if (/^[A-Z]{2,3}\s*\d{4}$/.test(line)) {
        const [r, p] = line.split(/\s+/)
        region = r
        postalCode = p
      } else if (/^(QLD|NSW|VIC|WA|SA|TAS|NT|ACT)\s*\d{4}$/.test(line)) {
        const [r, p] = line.split(/\s+/)
        region = r
        postalCode = p
      } else if (/^(QLD|NSW|VIC|WA|SA|TAS|NT|ACT)$/.test(line)) {
        region = line
      } else if (/Bali|Jakarta|Java|Indonesia/i.test(line)) {
        region = line
        country = 'Indonesia'
      } else {
        city = line
      }
    }

    return {
      address1,
      city,
      region,
      postalCode,
      country
    }
  })
}
