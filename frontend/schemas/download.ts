import { z } from 'zod'
import { mediaSchema } from './media'

export const downloadSchema = z.object({
  id: z.number(),
  downloadName: z.nullable(z.string()),
  downloadFile: z.object({
    data: z.nullable(mediaSchema)
  }),
  Icon: z.enum(['Image', 'Chart', 'FloorPlan', 'Building'])
})
