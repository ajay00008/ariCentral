import { z } from 'zod'

export const unitPositionSchema = z.object({
  id: z.number(),
  imageId: z.number(),
  x: z.number(),
  y: z.number()
})
