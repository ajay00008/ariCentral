import { cn } from '@/lib/utils'
import React from 'react'

const Skeleton = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('animate-pulse bg-muted bg-slate-400', className)}
      {...props}
    />
  )
)

export { Skeleton }
