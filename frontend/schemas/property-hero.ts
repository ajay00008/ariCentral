import { z } from 'zod'
import { mediaSchema } from './media'

export const propertyHeroSchema = z.object({
  id: z.number(),
  Name: z.string(),
  Image: z.object({
    data: mediaSchema
  })
})
