'use client'

import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport
} from '@/components/ui/toast'
import { useToast } from '@/components/ui/use-toast'

export function Toaster (): React.ReactNode {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }: { id: string, title?: string | undefined, description?: string | React.ReactNode, action?: React.ReactNode }) {
        return (
          <Toast key={id} {...props}>
            <div className='grid gap-1'>
              {title !== undefined && <ToastTitle>{title}</ToastTitle>}
              {description !== undefined && (
                <ToastDescription>{description}</ToastDescription>
              )}
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
