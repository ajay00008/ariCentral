import { z } from 'zod'
import { unitSchema } from './unit'

export const floorSchema = z.object({
  id: z.number(),
  attributes: z.object({
    identifier: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
    publishedAt: z.string(),
    units: z.object({
      data: z.array(unitSchema)
    })
  })
})
