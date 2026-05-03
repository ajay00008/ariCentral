'use client'

import * as React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { getCurrentUser, updateCurrentUserEmail, updateCurrentUserPassword } from '@/app/actions'
import { Label } from '@/components/ui/label'
import { useAlertProvider } from '@/providers/AlertProvider'

export function Profile (): React.ReactNode {
  const { setAlertMessage } = useAlertProvider()
  const [userData, setUserData] = React.useState<CurrentUser | null>(null)
  const [formData, setFormData] = React.useState<PasswordForm | null>({
    oldPassword: '',
    newPassword: '',
    newPasswordConfirmed: ''
  })

  function handleChangeEmail (e: React.ChangeEvent<HTMLInputElement>): void {
    const { name, value } = e.target
    setUserData((prevUserData) => {
      if (prevUserData === null) return null

      if (prevUserData[name as keyof CurrentUser] === value) {
        return prevUserData
      }

      return {
        ...prevUserData,
        [name]: value
      }
    })
  }

  async function handleSubmitEmailChange (e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    if (userData === null) return

    await updateCurrentUserEmail(userData.id, userData.email)
    setAlertMessage('User email was changed successfully.', true)
  }

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

    const response = await updateCurrentUserPassword(
      formData.oldPassword,
      formData.newPassword,
      formData.newPasswordConfirmed
    )

    if (response === null) {
      setAlertMessage('Unable to update user\'s password.', false)
      return
    }

    setFormData({
      oldPassword: '',
      newPassword: '',
      newPasswordConfirmed: ''
    })

    if ('code' in response && response.code === 400) {
      setAlertMessage('User password wasn`t changed. Probably old password is incorrect.', false)
    } else {
      setAlertMessage('User password was changed successfully.', true)
    }
  }

  React.useEffect(() => {
    async function fetchData (): Promise<void> {
      const data = await getCurrentUser()
      setUserData(data)
    }

    void fetchData()
  }, [])

  return (
    (userData !== null && formData !== null) && (
      <div className='flex gap-5 min-h-screen w-full flex-col'>
        <div className='mx-auto grid w-full max-w-6xl gap-2'>
          <h1 className='text-3xl font-semibold'>Settings</h1>
        </div>
        <div className='mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]'>
          <nav
            className='grid gap-4 text-sm text-muted-foreground' x-chunk='dashboard-04-chunk-0'
          >
            <Link href='#' className='font-semibold text-primary'>
              General
            </Link>
          </nav>
          <div className='grid gap-6'>
            <Card x-chunk='dashboard-04-chunk-1'>
              <CardHeader>
                <CardTitle>Change Email</CardTitle>
                <CardDescription>
                  Used to change email in current logined user.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className='grid gap-4'
                  onSubmit={(e) => {
                    void handleSubmitEmailChange(e)
                  }}
                >
                  <div className='grid gap-2'>
                    <Label htmlFor='email'>Email</Label>
                    <Input
                      id='email'
                      type='email'
                      name='email'
                      value={userData.email}
                      onChange={handleChangeEmail}
                      placeholder='superemail1234@example.com'
                      required
                    />
                  </div>
                  <Button type='submit' className='w-full border-t px-6 py-4'>
                    Save changed user Email
                  </Button>
                </form>
              </CardContent>
            </Card>
            <Card x-chunk='dashboard-04-chunk-2'>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                  Used to change current user password to a new one.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form
                  className='grid gap-4'
                  onSubmit={(e) => {
                    void handleSubmitPasswordChange(e)
                  }}
                >
                  <div className='grid gap-2'>
                    <Label htmlFor='oldPassword'>Old Password</Label>
                    <Input
                      id='oldPassword'
                      type='password'
                      name='oldPassword'
                      value={formData.oldPassword}
                      onChange={handleChangePassword}
                      placeholder='Somepassword1234'
                      required
                    />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='newPassword'>New Password</Label>
                    <Input
                      id='newPassword'
                      type='password'
                      name='newPassword'
                      value={formData.newPassword}
                      onChange={handleChangePassword}
                      placeholder='SomePassword1234'
                      required
                    />
                  </div>
                  <div className='grid gap-2'>
                    <Label htmlFor='newPasswordConfirmed'>Confirm New Password</Label>
                    <Input
                      id='newPasswordConfirmed'
                      type='password'
                      name='newPasswordConfirmed'
                      value={formData.newPasswordConfirmed}
                      onChange={handleChangePassword}
                      placeholder='SomePassword1234'
                      required
                    />
                  </div>
                  <Button type='submit' className='w-full border-t px-6 py-4'>
                    Save new user password
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  )
}
