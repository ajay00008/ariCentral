import { z } from 'zod'
import { subGallerySchema } from './sub-gallery'

export const gallerySchema = z.object({
  id: z.number(),
  name: z.string(),
  SubGallery: z.array(subGallerySchema)
})
