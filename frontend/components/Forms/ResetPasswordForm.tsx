'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
import { checkTokenIsValid, setResetedPassword } from '@/app/actions'
import Link from 'next/link'

export function ResetPasswordForm (): React.ReactNode {
  const params = useSearchParams()
  const query = params.get('token')
  const router = useRouter()
  const { setAlertMessage } = useAlertProvider()
  const [formData, setFormData] = React.useState({
    confirmPassword: '',
    password: ''
  })
  const [loading, setLoading] = React.useState<boolean>(false)
  const [isMatch, setIsMatch] = React.useState<boolean | null>(null)

  function handleChange (e: React.ChangeEvent<HTMLInputElement>): void {
    const { value, name } = e.target
    setFormData({ ...formData, [name]: value })
  }

  async function handleSubmit (e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    setLoading(true)
    setIsMatch(null)

    if (formData.password !== formData.confirmPassword) {
      setIsMatch(false)
      setLoading(false)
    } else if (formData.password === formData.confirmPassword && query !== null) {
      setIsMatch(true)
      await setResetedPassword(query, formData.password)
      setLoading(false)
      setAlertMessage('Your password was successfully reset, you can now proceed to login.', true)
      router.push('/login', { scroll: false })
    }
  }

  React.useEffect(() => {
    if (query === null) setLoading(true)
    else setLoading(false)
  }, [query])

  React.useEffect(() => {
    async function checkToken (): Promise<void> {
      if (query === null) {
        return
      }

      const res = await checkTokenIsValid(query)

      if (res === null) {
        setAlertMessage('Unable to check whether token is valid.', false)
        return
      }

      if (res.code === 2 || res.code === 3) {
        setLoading(true)
        setAlertMessage('Restoration link has expired, invalid, or used before.', false)
      }
    }

    void checkToken()
  }, [query])

  return (
    <Card className='smobile:w-full smobile:py-[40px] smobile:px-[16px] tablet:px-[32px] smobile:bg-white smobile:border-0 tablet:fixed tablet:top-[50%] tablet:left-[50%] tablet:translate-center tablet:max-w-[445px] laptop:left-[25%]'>
      <CardHeader className='smobile:p-0 smobile:mb-[23px] tablet:mb-[42px] smobile:w-full smobile:text-center'>
        <CardTitle className='smobile:font-mundialRegular smobile:leading-[1] smobile:text-[28px] smobile:font-normal desktop:text-[32px] smobile:margin-0'>New password</CardTitle>
      </CardHeader>
      <CardContent className='p-0'>
        <form
          className='smobile:grid smobile:gap-[24px]'
          onSubmit={(e) => {
            void handleSubmit(e)
          }}
        >
          <Label htmlFor='password' className='smobile:font-mundialLight smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px]'>New Password</Label>
          <div className='smobile:grid gap-[15px]'>
            <Input
              id='password'
              type='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className='smobile:px-[15px] smobile:py-[17px] smobile:min-h-[56px] smobile:font-mundialLight smobile:text-[16px] smobile:leading-[1] smobile:justify-center smobile:items-center smobile:border-black'
              placeholder=''
              required
              minLength={6}
              maxLength={255}
            />
          </div>
          <div className='smobile:grid gap-[15px]'>
            <Label htmlFor='confirmPassword' className='smobile:font-mundialLight smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px]'>Confirm Password</Label>
            <Input
              id='confirmPassword'
              type='password'
              name='confirmPassword'
              value={formData.confirmPassword}
              onChange={handleChange}
              className='smobile:px-[15px] smobile:py-[17px] smobile:min-h-[56px] smobile:font-mundialLight smobile:text-[16px] smobile:leading-[1] smobile:justify-center smobile:items-center smobile:border-black'
              placeholder=''
              required
              minLength={6}
              maxLength={255}
            />
          </div>
          {isMatch !== null && !isMatch && (
            <p className='mt-[5px] smobile:font-mundialLight text-red opacity-80 smobile:leading-[1] smobile:text-[12px] text-center'>Passwords Doesn`t Match</p>
          )}
          <Button type='submit' disabled={loading || query === null} className='smobile:w-full smobile:h-auto smobile:py-[17px] smobile:min-h-[56px] smobile:mx-auto smobile:bg-orange smobile:font-mundialRegular smobile:text-customWhite smobile:font-normal smobile:text-[20px] smobile:leading-[1] disabled:opacity-50'>
            Submit
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
