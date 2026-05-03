import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { LucideIcon, XCircle } from 'lucide-react'

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  errorMessage: string
  title?: string
  icon?: LucideIcon
}

export function ErrorModal ({
  isOpen,
  onClose,
  errorMessage,
  title = 'Registration Error',
  icon: Icon = XCircle
}: ErrorModalProps): React.ReactNode {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Icon className='h-6 w-6 text-red-500' />
            {title}
          </DialogTitle>
        </DialogHeader>
        <Alert variant='destructive'>
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
        <div className='flex justify-end'>
          <Button variant='outline' onClick={onClose}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
