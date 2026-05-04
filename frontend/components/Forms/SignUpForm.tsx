'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import * as Sentry from '@sentry/nextjs'
import { Label } from '@/components/ui/label'
import { useAlertProvider } from '@/providers/AlertProvider'
import { getTermsAndConditions, getEmailExistState, registerNewUserInDB } from '@/app/actions'
import { ProgressBar } from '@/components/ProgressBar/ProgressBar'
import { ChevronLeft, Loader2 } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { countryList } from '@/constants/countryList'
import { avgSalesPriceList, bestDescribeList, introducedList, howDidYouHearList, marketsOptions } from '@/constants/registration-mock'
import { signIn } from 'next-auth/react'
import { Codes } from '@/constants/code-errors'
import ReactMarkdown from 'react-markdown'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'

export function SignUpForm (): React.ReactNode {
  const router = useRouter()
  const { setAlertMessage } = useAlertProvider()
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    firstName: '',
    surname: '',
    phone: '',
    companyName: '',
    country: countryList[13],
    howDidYouHear: howDidYouHearList[1],
    bestDescribe: bestDescribeList[1],
    avgSalesPrice: 'below1M',
    introduced: introducedList[2],
    address: '',
    marketsOfInterest: [] as string[]
  })
  const [loading, setLoading] = React.useState<boolean>(false)
  const [isFirstStepPass, setIsFirstStepPass] = React.useState(false)
  const [, setIsExist] = React.useState(false)
  const [isChecked, setIsChecked] = React.useState(false)
  const [currentStep, setCurrentStep] = React.useState<number>(0)
  const [hasScrolledToBottom, setHasScrolledToBottom] = React.useState(false)
  const [termsContent, setTermsContent] = React.useState<string>('')
  const [termStatus, setTermStatus] = React.useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  let content

  const fetchTermsContent = async (): Promise<void> => {
    try {
      setTermStatus('loading')
      const data = await getTermsAndConditions()
      const content = data?.Content ?? ''
      if (content !== '') {
        setTermsContent(content)
        setTermStatus('success')
      } else {
        setTermsContent('No terms and conditions available.')
        setTermStatus('error')
      }
    } catch (err) {
      Sentry.captureException(err)
      setTermsContent('Failed to load terms and conditions.')
      setTermStatus('error')
    }
  }

  React.useEffect(() => {
    void fetchTermsContent()
  }, [])

  function handleTermsScroll (e: React.UIEvent<HTMLDivElement>): void {
    const container = e.currentTarget
    const hasOverflow = container.scrollHeight > container.clientHeight

    if (!hasOverflow) {
      setHasScrolledToBottom(true)
      return
    }

    const { scrollTop, scrollHeight, clientHeight } = container
    const isAtBottom = scrollHeight - scrollTop <= clientHeight + 10
    setHasScrolledToBottom(isAtBottom)
  }

  function handleStepChange (isPrev?: boolean): void {
    if (currentStep === 0) {
      setIsFirstStepPass(true)
      return
    }

    if (isPrev !== undefined && isPrev) {
      setCurrentStep(prevState => prevState - 1)
      return
    }
    setCurrentStep(prevState => prevState + 1)
  }

  function handleSelectChange (value: string, fieldName: string): void {
    if (value === '') return
    setFormData({
      ...formData,
      [fieldName]: value
    })
  }

  function handleMarketsChange (value: string): void {
    if (value === 'All of the above') {
      setFormData({
        ...formData,
        marketsOfInterest: marketsOptions.filter(opt => opt !== 'All of the above')
      })
      return
    }
    let updated = [...formData.marketsOfInterest]
    if (updated.includes(value)) {
      updated = updated.filter(v => v !== value)
    } else {
      updated.push(value)
    }
    setFormData({
      ...formData,
      marketsOfInterest: updated
    })
  }

  function handleChange (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>): void {
    const { value, name } = e.target
    setFormData({ ...formData, [name]: value })
  }

  async function handleSubmit (e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    setLoading(true)

    if (currentStep < 4) {
      handleStepChange()
      setLoading(false)
      return
    }

    const marketsOfInterestObjects = formData.marketsOfInterest.map((item) => ({ Item: item }))
    const res = await registerNewUserInDB(
      formData.email,
      formData.password,
      formData.firstName,
      formData.surname,
      formData.phone,
      formData.address,
      formData.companyName,
      formData.country,
      formData.howDidYouHear,
      formData.bestDescribe,
      formData.avgSalesPrice,
      formData.introduced,
      marketsOfInterestObjects
    )

    setLoading(false)
    if ((res as APIError).message === 'Email should be valid string email.') {
      setAlertMessage('Email is incorrect. Please, provide valid email address. Check data, and try again.', false)
    }
    if ((res as APIError).message === 'Password should be string, and must contain min 6 characters in it.') {
      setAlertMessage('Password is incorrect. Minimum length - 6 characters. Check data, and try again.', false)
    }
    if ((res as APIError).message === 'Email or Username are already taken') {
      setAlertMessage('Email already exist. Try to login instead.', false)
    }
    if ((res as APIError).message === undefined) {
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
        router.push('/admin/properties', { scroll: false })
      }
    }
  }

  React.useEffect(() => {
    if (!isFirstStepPass) {
      return
    }

    if (isChecked) {
      setCurrentStep(prev => prev + 1)
      return
    }

    async function checkEmail (): Promise<void> {
      const res = await getEmailExistState(formData.email)

      if (res?.email ?? false) {
        setIsExist(true)
        setIsFirstStepPass(false)
        setAlertMessage('Email is already exist in Application. Please, write another email, and try again.', false)
      } else {
        setIsExist(false)
        setIsFirstStepPass(false)
        setIsChecked(true)
        setCurrentStep(prev => prev + 1)
      }
    }

    void checkEmail()
  }, [isFirstStepPass])

  const progressPercentage = (currentStep + 1) * 100 / 6

  switch (currentStep) {
    case 0:
      content = (
        <>
          <div className='smobile:hidden smobile:h-0 tablet:block tablet:h-auto'>
            <ProgressBar percentage={progressPercentage} isAuth />
          </div>
          <CardHeader className='smobile:p-0 smobile:mb-[23px] tablet:mb-[42px] smobile:w-full smobile:text-center'>
            <CardTitle className='smobile:font-mundialRegular smobile:leading-[1] smobile:text-[28px] smobile:font-normal desktop:text-[32px] smobile:margin-0 text-customSignUpBlack'>Sign Up</CardTitle>
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
                  minLength={6}
                />
              </div>
              <div className='smobile:grid gap-[15px]'>
                <Label htmlFor='password' className='smobile:font-mundialLight smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px]'>Password</Label>
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
                  Already a member? <span className='smobile:underline smobile:font-mundialRegular smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px]'>Log In</span>
                </Link>
              </div>
            </form>
          </CardContent>
        </>
      )
      break

    case 1:
      content = (
        <>
          <div className='smobile:hidden smobile:h-0 tablet:block tablet:h-auto'>
            <ProgressBar percentage={progressPercentage} isAuth />
          </div>
          <CardHeader className='smobile:p-0 smobile:mb-[23px] tablet:mb-[42px] smobile:w-full smobile:text-center smobile:relative'>
            <button className='h-auto w-auto bg-transparent outline-none absolute left-0 top-[25%]' onClick={() => handleStepChange(true)} title='To the previous step'>
              <ChevronLeft className='w-[24px] h-[24px] flex flex-shrink-0' />
            </button>
            <CardTitle className='smobile:font-mundialRegular smobile:leading-[1] smobile:text-[28px] smobile:font-normal desktop:text-[32px] smobile:margin-0 text-customSignUpBlack'>Sign Up</CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <form
              className='smobile:grid smobile:gap-[24px]'
              onSubmit={(e) => {
                void handleSubmit(e)
              }}
            >
              <div className='smobile:grid gap-[15px]'>
                <Label htmlFor='firstName' className='smobile:font-mundialLight smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px]'>First Name</Label>
                <Input
                  id='firstName'
                  type='text'
                  name='firstName'
                  placeholder='Jane'
                  value={formData.firstName}
                  onChange={handleChange}
                  className='smobile:px-[15px] smobile:py-[17px] smobile:min-h-[56px] smobile:font-mundialLight smobile:text-[16px] smobile:leading-[1] smobile:justify-center smobile:items-center smobile:border-black'
                  required
                  maxLength={255}
                />
              </div>
              <div className='smobile:grid gap-[15px]'>
                <Label htmlFor='surname' className='smobile:font-mundialLight smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px]'>Surname</Label>
                <Input
                  id='surname'
                  type='text'
                  name='surname'
                  placeholder='Doe'
                  value={formData.surname}
                  onChange={handleChange}
                  className='smobile:px-[15px] smobile:py-[17px] smobile:min-h-[56px] smobile:font-mundialLight smobile:text-[16px] smobile:leading-[1] smobile:justify-center smobile:items-center smobile:border-black'
                  required
                  maxLength={255}
                />
              </div>
              <div className='smobile:grid gap-[15px]'>
                <Label htmlFor='phone' className='smobile:font-mundialLight smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px]'>Phone</Label>
                <Input
                  id='phone'
                  type='text'
                  name='phone'
                  placeholder='+61 000 000 000'
                  value={formData.phone}
                  onChange={handleChange}
                  className='smobile:px-[15px] smobile:py-[17px] smobile:min-h-[56px] smobile:font-mundialLight smobile:text-[16px] smobile:leading-[1] smobile:justify-center smobile:items-center smobile:border-black'
                  required
                  maxLength={255}
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
                  Already a member? <span className='smobile:underline smobile:font-mundialRegular smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px]'>Log In</span>
                </Link>
              </div>
            </form>
          </CardContent>
        </>
      )
      break

    case 2:
      content = (
        <>
          <div className='smobile:hidden smobile:h-0 tablet:block tablet:h-auto'>
            <ProgressBar percentage={progressPercentage} isAuth />
          </div>
          <CardHeader className='smobile:p-0 smobile:mb-[23px] tablet:mb-[42px] smobile:w-full smobile:text-center smobile:relative'>
            <button className='h-auto w-auto bg-transparent outline-none absolute left-0 top-[25%]' onClick={() => handleStepChange(true)} title='To the previous step'>
              <ChevronLeft className='w-[24px] h-[24px] flex flex-shrink-0' />
            </button>
            <CardTitle className='smobile:font-mundialRegular smobile:leading-[1] smobile:text-[28px] smobile:font-normal desktop:text-[32px] smobile:margin-0 text-customSignUpBlack'>Sign Up</CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <form
              className='smobile:grid smobile:gap-[24px]'
              onSubmit={(e) => {
                void handleSubmit(e)
              }}
            >
              <div className='smobile:grid gap-[15px]'>
                <Label htmlFor='address' className='smobile:font-mundialLight smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px]'>Address</Label>
                <Input
                  id='address'
                  type='text'
                  name='address'
                  placeholder='123 example st, Town, Country 0000'
                  value={formData.address}
                  onChange={handleChange}
                  className='smobile:px-[15px] smobile:py-[17px] smobile:min-h-[56px] smobile:font-mundialLight smobile:text-[16px] smobile:leading-[1] smobile:justify-center smobile:items-center smobile:border-black'
                  required
                  maxLength={255}
                />
              </div>
              <div className='smobile:grid gap-[15px]'>
                <Label htmlFor='country' className='smobile:font-mundialLight smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px]'>Country</Label>
                <Select
                  value={formData.country !== '' ? formData.country : countryList[13]}
                  onValueChange={(e) => handleSelectChange(e, 'country')}
                >
                  <SelectTrigger
                    className='custom-select-color smobile:relative smobile:px-[15px] smobile:py-[17px] smobile:min-h-[56px] smobile:font-mundialLight smobile:text-[16px] smobile:leading-[1] smobile:justify-between smobile:items-center smobile:border smobile:border-black smobile:appearance-none'
                  >
                    <SelectValue placeholder='Select a country' />
                  </SelectTrigger>
                  <SelectContent
                    className='smobile:border smobile:border-black smobile:font-mundialLight smobile:text-[16px] smobile:leading-[1]'
                  >
                    {countryList.map(item => (
                      <SelectItem
                        key={item}
                        value={item}
                        className='smobile:px-[15px] smobile:py-[17px] smobile:min-h-[56px] smobile:justify-center smobile:items-center smobile:border-b smobile:border-black last:border-0'
                      >
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='smobile:grid gap-[15px]'>
                <Label htmlFor='companyName' className='smobile:font-mundialLight smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px]'>Company</Label>
                <Input
                  id='companyName'
                  type='text'
                  name='companyName'
                  placeholder='Jane’s Jet skis'
                  value={formData.companyName}
                  onChange={handleChange}
                  className='smobile:px-[15px] smobile:py-[17px] smobile:min-h-[56px] smobile:font-mundialLight smobile:text-[16px] smobile:leading-[1] smobile:justify-center smobile:items-center smobile:border-black'
                  required
                  maxLength={255}
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
                  Already a member? <span className='smobile:underline smobile:font-mundialRegular smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px]'>Log In</span>
                </Link>
              </div>
            </form>
          </CardContent>
        </>
      )
      break

    case 3:
      content = (
        <>
          <div className='smobile:hidden smobile:h-0 tablet:block tablet:h-auto'>
            <ProgressBar percentage={progressPercentage} isAuth />
          </div>
          <CardHeader className='smobile:p-0 smobile:mb-[23px] tablet:mb-[42px] smobile:w-full smobile:text-center smobile:relative'>
            <button className='h-auto w-auto bg-transparent outline-none absolute left-0 top-[25%]' onClick={() => handleStepChange(true)} title='To the previous step'>
              <ChevronLeft className='w-[24px] h-[24px] flex flex-shrink-0' />
            </button>
            <CardTitle className='smobile:font-mundialRegular smobile:leading-[1] smobile:text-[28px] smobile:font-normal desktop:text-[32px] smobile:margin-0 text-customSignUpBlack'>Sign Up</CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <form
              className='smobile:grid smobile:gap-[24px]'
              onSubmit={(e) => {
                void handleSubmit(e)
              }}
            >
              <div className='smobile:grid gap-[15px]'>
                <Label htmlFor='howDidYouHear' className='smobile:font-mundialLight smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px]'>How did you hear about us?</Label>
                <Select
                  value={formData.howDidYouHear !== '' ? formData.howDidYouHear : howDidYouHearList[1]}
                  onValueChange={(e) => handleSelectChange(e, 'howDidYouHear')}
                >
                  <SelectTrigger
                    className='custom-select-color smobile:relative smobile:px-[15px] smobile:py-[17px] smobile:min-h-[56px] smobile:font-mundialLight smobile:text-[16px] smobile:leading-[1] smobile:justify-between smobile:items-center smobile:border smobile:border-black smobile:appearance-none'
                  >
                    <SelectValue placeholder='Select an option' />
                  </SelectTrigger>
                  <SelectContent
                    className='smobile:border smobile:border-black smobile:font-mundialLight smobile:text-[16px] smobile:leading-[1]'
                  >
                    {howDidYouHearList.map(item => (
                      <SelectItem
                        key={item}
                        value={item}
                        className='smobile:px-[15px] smobile:py-[17px] smobile:min-h-[56px] smobile:justify-center smobile:items-center smobile:border-b smobile:border-black last:border-0'
                      >
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='smobile:grid gap-[15px]'>
                <Label className='smobile:font-mundialLight smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px]'>Markets of interest</Label>
                <div className='flex flex-wrap gap-2'>
                  {marketsOptions.map((item) => (
                    <button
                      type='button'
                      key={item}
                      className={`px-4 py-2 rounded border border-black text-[14px] font-mundialLight ${formData.marketsOfInterest.includes(item) || (item === 'All of the above' && formData.marketsOfInterest.length === marketsOptions.length - 1) ? 'bg-orange text-white' : 'bg-white text-black'}`}
                      onClick={() => handleMarketsChange(item)}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className='text-xs text-gray-500 mt-1'>You can select multiple. "All of the above" selects all.</div>
              </div>
              <div className='smobile:grid gap-[15px]'>
                <Label htmlFor='bestDescribe' className='smobile:font-mundialLight smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px]'>What best describes you?</Label>
                <Select
                  value={formData.bestDescribe !== '' ? formData.bestDescribe : bestDescribeList[1]}
                  onValueChange={(e) => handleSelectChange(e, 'bestDescribe')}
                >
                  <SelectTrigger
                    className='custom-select-color smobile:relative smobile:px-[15px] smobile:py-[17px] smobile:min-h-[56px] smobile:font-mundialLight smobile:text-[16px] smobile:leading-[1] smobile:justify-between smobile:items-center smobile:border smobile:border-black smobile:appearance-none'
                  >
                    <SelectValue placeholder='Select an option' />
                  </SelectTrigger>
                  <SelectContent
                    className='smobile:border smobile:border-black smobile:font-mundialLight smobile:text-[16px] smobile:leading-[1]'
                  >
                    {bestDescribeList.map(item => (
                      <SelectItem
                        key={item}
                        value={item}
                        className='smobile:px-[15px] smobile:py-[17px] smobile:min-h-[56px] smobile:justify-center smobile:items-center smobile:border-b smobile:border-black last:border-0'
                      >
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='smobile:grid gap-[15px]'>
                <Label htmlFor='avgSalesPrice' className='smobile:font-mundialLight smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px]'>
                  What is your average sales price?
                </Label>
                <Select
                  value={formData.avgSalesPrice}
                  onValueChange={(e) => handleSelectChange(e, 'avgSalesPrice')}
                >
                  <SelectTrigger className='custom-select-color smobile:relative smobile:px-[15px] smobile:py-[17px] smobile:min-h-[56px] smobile:font-mundialLight smobile:text-[16px] smobile:leading-[1] smobile:justify-between smobile:items-center smobile:border smobile:border-black smobile:appearance-none'>
                    <SelectValue placeholder='Select an option' />
                  </SelectTrigger>
                  <SelectContent className='smobile:border smobile:border-black smobile:font-mundialLight smobile:text-[16px] smobile:leading-[1]'>
                    {Object.entries(avgSalesPriceList).map(([key, label]) => (
                      <SelectItem
                        key={key}
                        value={key}
                        className='smobile:px-[15px] smobile:py-[17px] smobile:min-h-[56px] smobile:justify-center smobile:items-center smobile:border-b smobile:border-black last:border-0'
                      >
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className='smobile:grid gap-[15px]'>
                <Label htmlFor='introduced' className='smobile:font-mundialLight smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px]'>
                  Who introduced you to Walker?
                </Label>
                <Select
                  value={formData.introduced}
                  onValueChange={(e) => handleSelectChange(e, 'introduced')}
                >
                  <SelectTrigger className='custom-select-color smobile:relative smobile:px-[15px] smobile:py-[17px] smobile:min-h-[56px] smobile:font-mundialLight smobile:text-[16px] smobile:leading-[1] smobile:justify-between smobile:items-center smobile:border smobile:border-black smobile:appearance-none'>
                    <SelectValue placeholder='Select an option' />
                  </SelectTrigger>
                  <SelectContent className='smobile:border smobile:border-black smobile:font-mundialLight smobile:text-[16px] smobile:leading-[1]'>
                    {introducedList.map((item) => (
                      <SelectItem
                        key={item}
                        value={item}
                        className='smobile:px-[15px] smobile:py-[17px] smobile:min-h-[56px] smobile:justify-center smobile:items-center smobile:border-b smobile:border-black last:border-0'
                      >
                        {item}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button type='submit' disabled={loading} className='smobile:w-full smobile:h-auto smobile:py-[17px] smobile:min-h-[56px] smobile:mx-auto smobile:bg-orange smobile:font-mundialRegular smobile:text-customWhite smobile:font-normal smobile:text-[20px] smobile:leading-[1] disabled:opacity-50'>
                Next
              </Button>
              <div className='flex w-full justify-center smobile:mt-[16px]'>
                <Link
                  href='/login'
                  className='smobile:flex smobile:gap-[5px] smobile:items-center smobile:font-mundialRegular smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px] bg-transparent justify-center'
                >
                  Already a member? <span className='smobile:underline smobile:font-mundialRegular smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px]'>Log In</span>
                </Link>
              </div>
            </form>
          </CardContent>
        </>
      )
      break

    case 4:
      content = (
        <>
          <div className='smobile:hidden smobile:h-0 tablet:block tablet:h-auto'>
            <ProgressBar percentage={progressPercentage} isAuth />
          </div>
          <CardHeader className='smobile:p-0 smobile:mb-[23px] tablet:mb-[42px] smobile:w-full smobile:text-center smobile:relative'>
            <button className='h-auto w-auto bg-transparent outline-none absolute left-0 top-[25%]' onClick={() => handleStepChange(true)} title='To the previous step'>
              <ChevronLeft className='w-[24px] h-[24px] flex flex-shrink-0' />
            </button>
            <CardTitle className='smobile:font-mundialRegular smobile:leading-[1] smobile:text-[28px] smobile:font-normal desktop:text-[32px] smobile:margin-0 text-customSignUpBlack'>Sign Up</CardTitle>
          </CardHeader>
          <CardContent className='p-0'>
            <form
              className='smobile:grid smobile:gap-[24px]'
              onSubmit={(e) => {
                void handleSubmit(e)
              }}
            >
              <div
                className='border border-gray-300 p-4 rounded-md max-h-[400px] overflow-y-auto'
                onScroll={handleTermsScroll}
                aria-label='Terms and conditions scrollable content'
                ref={(el) => {
                  if (el != null) {
                    const hasOverflow = el.scrollHeight > el.clientHeight
                    if (!hasOverflow) setHasScrolledToBottom(true)
                  }
                }}
              >
                {termStatus === 'loading'
                  ? (
                    <div className='flex justify-center items-center h-full'>
                      <Loader2 className='h-8 w-8 text-orange animate-spin' />
                    </div>
                    )
                  : termStatus === 'error'
                    ? (
                      <div className='text-red-500 text-center p-4'>
                        {termsContent}
                      </div>
                      )
                    : (
                      <div className='grid gap-5'>
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
                          {termsContent}
                        </ReactMarkdown>
                      </div>
                      )}
              </div>
              <Button
                type='submit'
                disabled={!hasScrolledToBottom || loading || termStatus === 'error' || termStatus === 'loading'}
                className='smobile:w-full smobile:h-auto smobile:py-[17px] smobile:min-h-[56px] smobile:mx-auto smobile:bg-orange smobile:font-mundialRegular smobile:text-customWhite smobile:font-normal smobile:text-[20px] smobile:leading-[1] disabled:opacity-50'
              >
                Agree & Register
              </Button>
              <div className='flex w-full justify-center smobile:mt-[16px]'>
                <Link
                  href='/login'
                  className='smobile:flex smobile:gap-[5px] smobile:items-center smobile:font-mundialRegular smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px] bg-transparent justify-center'
                >
                  Already a member? <span className='smobile:underline smobile:font-mundialRegular smobile:text-customTextBlack smobile:leading-[1] smobile:text-[12px]'>Log In</span>
                </Link>
              </div>
            </form>
          </CardContent>
        </>
      )
      break

    default:
      break
  }

  return (
    <div className='w-auto rounded-lg'>
      <div className='smobile:block smobile:h-auto tablet:hidden tablet:h-0'>
        <ProgressBar percentage={progressPercentage} />
      </div>
      <Card className='smobile:w-full smobile:py-[40px] z-50 smobile:px-[16px] tablet:px-[32px] mb-10 smobile:bg-white smobile:border-0 tablet:relative tablet:top-[50%] tablet:left-[50%] tablet:translate-center tablet:max-w-[445px] tablet:overflow-hidden'>
        {content}
      </Card>
    </div>
  )
}
