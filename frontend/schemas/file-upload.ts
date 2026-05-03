import { z } from 'zod'

export const heroImageFileSchema = z.object({
  type: z.enum(['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'], {
    errorMap: () => ({ message: 'Please upload only image files. Video format is not supported.' })
  })
})
