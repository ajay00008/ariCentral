'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAlertProvider } from '@/providers/AlertProvider'
import { Codes } from '@/constants/code-errors'
import Link from 'next/link'

interface AuthFormProps {
  login?: boolean
  code?: number
}

export function AuthForm ({ login }: AuthFormProps): React.ReactNode {
  const params = useSearchParams()
  const query = params.get('callbackUrl')
  const router = useRouter()
  const { setAlertMessage } = useAlertProvider()
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  })
  const [loading, setLoading] = React.useState<boolean>(false)
  const allowPublicProperties = process.env.NEXT_PUBLIC_ALLOW_PUBLIC_PROPERTIES === 'true'

  function handleChange (e: React.ChangeEvent<HTMLInputElement>): void {
    const { value, name } = e.target
    setFormData({ ...formData, [name]: value })
  }

  async function handleSubmit (e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    setLoading(true)

    const response = await signIn('credentials', {
      email: formData.email,
      password: formData.password,
      redirect: false
    })

    if (response?.error !== null) {
      setAlertMessage(Codes.INCORRECT.message, false)
      setLoading(false)
      return
    }

    if (response?.error === null) {
      router.push(query !== null ? query : '/admin/properties', { scroll: false })
    }
  }

  return (
    <Card className='smobile:w-full smobile:py-[40px] smobile:px-[16px] tablet:px-[32px] smobile:bg-white smobile:border-0 tablet:fixed tablet:top-[50%] tablet:left-[50%] tablet:translate-center tablet:max-w-[445px] laptop:left-[25%]'>
      <CardHeader className='smobile:p-0 smobile:mb-[23px] tablet:mb-[42px] smobile:w-full smobile:text-center'>
        <CardTitle className='smobile:font-mundialRegular smobile:leading-[1] smobile:text-[28px] smobile:font-normal desktop:text-[32px] smobile:margin-0'>Log In</CardTitle>
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
          <div className='smobile:grid gap-[15px]'>
            <div className='smobile:w-full smobile:flex smobile:justify-between smobile:items-center'>
              <Label htmlFor='password' className='smobile:font-mundialLight smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px]'>Password</Label>
              <Link
                href='/forgot-password'
                className='flex items-center smobile:font-mundialRegular smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px] bg-transparent hover:underline justify-center transition duration-200'
              >
                Forgot Password?
              </Link>
            </div>
            <Input
              id='password'
              type='password'
              name='password'
              placeholder=''
              value={formData.password}
              onChange={handleChange}
              className='smobile:px-[15px] smobile:py-[17px] smobile:min-h-[56px] smobile:font-mundialLight smobile:text-[16px] smobile:leading-[1] smobile:justify-center smobile:items-center smobile:border-black'
              required
              minLength={6}
              maxLength={255}
            />
          </div>
          <Button type='submit' disabled={loading} className='smobile:w-full smobile:h-auto smobile:py-[17px] smobile:min-h-[56px] smobile:mx-auto smobile:bg-orange smobile:font-mundialRegular smobile:text-customWhite smobile:font-normal smobile:text-[20px] smobile:leading-[1] disabled:opacity-50'>
            Continue
          </Button>
          {!allowPublicProperties && (
            <div className='flex w-full justify-center smobile:mt-[16px]'>
              <Link
                href='/register'
                className='smobile:flex smobile:gap-[5px] smobile:items-center smobile:font-mundialRegular smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px] bg-transparent justify-center'
              >
                Not a member? <span className='smobile:underline smobile:font-mundialRegular smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px]'>Sign Up</span>
              </Link>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
