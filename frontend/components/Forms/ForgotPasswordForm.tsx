'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAlertProvider } from '@/providers/AlertProvider'
import { getPasswordResetLink } from '@/app/actions'
import Link from 'next/link'

export function ForgotPasswordForm (): React.ReactNode {
  const { setAlertMessage } = useAlertProvider()
  const [formData, setFormData] = React.useState({
    email: ''
  })
  const [loading, setLoading] = React.useState<boolean>(false)

  function handleChange (e: React.ChangeEvent<HTMLInputElement>): void {
    const { value, name } = e.target
    setFormData({ ...formData, [name]: value })
  }

  async function handleSubmit (e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    setLoading(true)
    setAlertMessage('If your email exists in the system you will receive an email with restoration link', true)
    await getPasswordResetLink(formData.email)
    setLoading(false)
    setFormData({ email: '' })
  }

  return (
    <Card className='smobile:w-full smobile:py-[40px] smobile:px-[16px] tablet:px-[32px] smobile:bg-white smobile:border-0 tablet:fixed tablet:top-[50%] tablet:left-[50%] tablet:translate-center tablet:max-w-[445px] laptop:left-[25%]'>
      <CardHeader className='smobile:p-0 smobile:mb-[23px] tablet:mb-[42px] smobile:w-full smobile:text-center'>
        <CardTitle className='smobile:font-mundialRegular smobile:leading-[1] smobile:text-[28px] smobile:font-normal desktop:text-[32px] smobile:margin-0 smobile:mb-[20px]'>Reset password</CardTitle>
        <CardDescription className='smobile:leading-[1] smobile:font-mundialLight smobile:text-customTextBlack smobile:text-[16px]'>
          Enter your account email address, and we'll send you a link to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent className='p-0'>
        <form
          className='smobile:grid smobile:gap-[24px]'
          onSubmit={(e) => {
            void handleSubmit(e)
          }}
        >
          <div className='smobile:grid gap-[15px]'>
            <Label htmlFor='email' className='smobile:font-mundialLight smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px]'>Email</Label>
            <Input
              id='email'
              type='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='smobile:px-[15px] smobile:py-[17px] smobile:min-h-[56px] smobile:font-mundialLight smobile:text-[16px] smobile:leading-[1] smobile:justify-center smobile:items-center smobile:border-black'
              placeholder='Jane@doe.com'
              required
            />
          </div>
          <Button type='submit' disabled={loading} className='smobile:w-full smobile:h-auto smobile:py-[17px] smobile:min-h-[56px] smobile:mx-auto smobile:bg-orange smobile:font-mundialRegular smobile:text-customWhite smobile:font-normal smobile:text-[20px] smobile:leading-[1] disabled:opacity-50'>
            Next
          </Button>
          <div className='flex w-full justify-center smobile:mt-[16px]'>
            <Link
              href='/login'
              className='smobile:flex smobile:gap-[5px] smobile:items-center smobile:font-mundialRegular smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px] bg-transparent justify-center'
            >
              Back to <span className='smobile:underline smobile:font-mundialRegular smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px]'>Sign In</span>
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
