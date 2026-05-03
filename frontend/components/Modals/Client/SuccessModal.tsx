import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { CheckCircle2, LucideIcon } from 'lucide-react'

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
  successMessage: string
  title?: string
  icon?: LucideIcon
}

export function SuccessModal ({
  isOpen,
  onClose,
  successMessage,
  title = 'Success',
  icon: Icon = CheckCircle2
}: SuccessModalProps): React.ReactNode {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2 text-green-500'>
            <Icon className='h-6 w-6' />
            {title}
          </DialogTitle>
        </DialogHeader>
        <Alert variant='default' className='border-green-500'>
          <AlertDescription>{successMessage}</AlertDescription>
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
