import { z } from 'zod'

export const mediaSchema = z.object({
  id: z.number(),
  attributes: z.object({
    name: z.string(),
    alternativeText: z.nullable(z.string()),
    caption: z.nullable(z.string()),
    width: z.nullable(z.number()),
    height: z.nullable(z.number()),
    formats: z.nullable(z.object({})),
    hash: z.string(),
    ext: z.nullable(z.string()),
    mime: z.string(),
    size: z.number(),
    url: z.string(),
    previewUrl: z.nullable(z.string()),
    provider: z.string(),
    provider_metadata: z.nullable(z.object({})),
    createdAt: z.string(),
    updatedAt: z.string()
  })
})
