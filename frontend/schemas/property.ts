import { z } from 'zod'
import { downloadSchema } from './download'
import { floorSchema } from './floor'
import { gallerySchema } from './gallery'
import { listSchema } from './list'
import { mediaSchema } from './media'
import { propertyHeroSchema } from './property-hero'

export const propertySchema = z.object({
  id: z.number(),
  attributes: z.object({
    Name: z.string(),
    Slug: z.string(),
    Address: z.nullable(z.string()).optional(),
    StreetAddress1: z.nullable(z.string()),
    StreetAddress2: z.nullable(z.string()),
    City: z.nullable(z.string()),
    Region: z.nullable(z.string()),
    PostalCode: z.nullable(z.string()),
    Suburb: z.nullable(z.string()),
    Country: z.nullable(z.string()),
    Builder: z.nullable(z.string()),
    Architect: z.nullable(z.string()),
    Developer: z.nullable(z.string()),
    BookACallLink: z.nullable(z.string()),
    MakeAnOfferLink: z.nullable(z.string()),
    ProjectWebsiteLink: z.nullable(z.string()),
    DealType: z.enum(['ExclusiveOffMarket', 'OnMarket']),
    ListsValues: z.string(),
    StageOfBuild: z.enum(['PreRelease', 'UnderConstruction', 'Completed']),
    Summary: z.nullable(z.string()),
    Commission: z.number(),
    PropertyType: z.enum(['Land', 'Residential', 'Commercial']),
    Featured: z.boolean(),
    RegisterForUpdatesCode: z.nullable(z.string()),
    createdAt: z.string(),
    updatedAt: z.string(),
    publishedAt: z.string(),
    floors: z.object({
      data: z.array(floorSchema)
    }),
    ViewsGallery: z.nullable(gallerySchema),
    InteriorGallery: z.nullable(gallerySchema),
    HeroImage: z.object({
      data: z.nullable(z.array(mediaSchema))
    }),
    HeroImages: z.array(propertyHeroSchema),
    AmenitiesGallery: z.nullable(gallerySchema),
    Gallery: z.nullable(gallerySchema),
    Facilities: z.nullable(listSchema),
    Details: z.nullable(listSchema),
    Dates: z.nullable(listSchema),
    PDFImages: z.object({
      data: z.nullable(z.array(mediaSchema))
    }),
    Downloads: z.array(downloadSchema),
    Brochure: z.object({
      data: z.nullable(mediaSchema)
    })
  })
})
