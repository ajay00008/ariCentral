import { z } from 'zod'
import { mediaSchema } from './media'
import { unitPositionSchema } from './unit-position'

export const unitSchema = z.object({
  id: z.number(),
  attributes: z.object({
    externalSize: z.nullable(z.number()),
    internalSize: z.nullable(z.number()),
    cars: z.nullable(z.number()),
    powder: z.nullable(z.number()),
    unitPlan: z.object({
      data: z.nullable(mediaSchema)
    }),
    order: z.nullable(z.number()),
    identifier: z.string(),
    status: z.enum(['AVAILABLE', 'SOLD', 'RESERVED']),
    aspect: z.enum(['SOUTH', 'NORTH', 'WEST', 'EAST']),
    type: z.enum(['TOWNHOUSE', 'APARTMENT', 'HOUSE', 'PENTHOUSE', 'LAND', 'VILLA']),
    unitGallery: z.object({
      data: z.nullable(z.array(mediaSchema))
    }),
    price: z.nullable(z.number()),
    beds: z.nullable(z.string()),
    baths: z.nullable(z.string()),
    bodyCorp: z.nullable(z.number()),
    rentApp: z.nullable(z.number()),
    rates: z.nullable(z.number()),
    living: z.nullable(z.number()),
    positions: z.array(unitPositionSchema),
    createdAt: z.string(),
    updatedAt: z.string(),
    publishedAt: z.string()
  })
})
