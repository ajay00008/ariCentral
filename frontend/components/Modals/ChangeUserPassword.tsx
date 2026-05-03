'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateUserPassword } from '@/app/actions'

interface Props {
  isModalOpen: boolean
  toggleModal: () => void
  setMessage: (text: string, status: boolean) => void
  id: number
}

export function ChangeUserPasswordModal ({ id, isModalOpen, toggleModal, setMessage }: Props): React.ReactNode {
  const [formData, setFormData] = React.useState<PasswordFormModal | null>({
    newPassword: ''
  })

  function handleChangePassword (e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target
    setFormData((prevData) => {
      if (prevData === null) return null

      return {
        ...prevData,
        [name]: value
      }
    })
  }

  async function handleSubmitPasswordChange (e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    if (formData === null) return

    await updateUserPassword(id, formData.newPassword)
    setMessage('User password was changed successfully', true)
    toggleModal()
  }

  return (
    <Dialog open={isModalOpen} onOpenChange={toggleModal}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Change selected User password</DialogTitle>
          <DialogDescription>
            User password here
          </DialogDescription>
        </DialogHeader>
        <form
          className='grid gap-4'
          onSubmit={(e) => {
            void handleSubmitPasswordChange(e)
          }}
        >
          <div className='grid gap-2'>
            <Label htmlFor='newPassword'>New Password</Label>
            <Input
              id={`newPasswordModal + ${id}`}
              type='password'
              name='newPassword'
              value={formData?.newPassword}
              onChange={handleChangePassword}
              placeholder='SomePassword1234'
              required
            />
          </div>
          <Button type='submit' className='w-full border-t px-6 py-4'>
            Save new user password
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}
