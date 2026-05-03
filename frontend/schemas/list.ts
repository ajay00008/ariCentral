import { z } from 'zod'

export const listSchema = z.object({
  id: z.number(),
  Identifier: z.nullable(z.string()),
  Items: z.nullable(z.array(z.object({
    id: z.number(),
    Item: z.nullable(z.string())
  })))
})
