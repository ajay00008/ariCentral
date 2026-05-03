import { z } from 'zod'
import { mediaSchema } from './media'

export const subGallerySchema = z.object({
  id: z.number(),
  Name: z.string(),
  Media: z.object({
    data: z.nullable(z.array(mediaSchema))
  })
})
