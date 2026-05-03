import * as React from 'react'
import { cn } from '@/lib/utils'

interface ImageFrameProps {
  children: React.ReactNode
  className?: string
}

export function ImageFrame ({ children, className }: ImageFrameProps): React.ReactNode {
  return (
    <div className={cn('relative w-[250px] pb-[75%]', className)}>
      {children}
    </div>
  )
}
