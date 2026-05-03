'use client'

import * as React from 'react'
import { updateUserInDB } from '@/app/actions'
import { useAlertProvider } from '@/providers/AlertProvider'

interface Props {
  user: SessionType
  onChange: React.Dispatch<React.SetStateAction<SessionUserData>>
}

export function AccountForm ({ user, onChange }: Props): React.ReactNode {
  const { setAlertMessage } = useAlertProvider()
  const [formData, setFormData] = React.useState({
    firstName: user.user?.firstName ?? '',
    surname: user.user?.surname ?? '',
    email: user.user?.email ?? '',
    phone: user.user?.phone ?? '',
    companyName: user.user?.companyName ?? ''
  })
  const [loading, setLoading] = React.useState<boolean>(false)

  function handleChange (e: React.ChangeEvent<HTMLInputElement>): void {
    const { value, name } = e.target
    setFormData({ ...formData, [name]: value })
  }

  async function handleSubmit (e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    setLoading(true)

    await updateUserInDB(
      formData.email,
      formData.firstName,
      formData.surname,
      formData.phone,
      formData.companyName
    )

    setLoading(false)
    if (user.user !== undefined) {
      user.user.email = formData.email
      user.user.firstName = formData.firstName
      user.user.surname = formData.surname
      user.user.phone = formData.phone
      user.user.companyName = formData.companyName
    }
    onChange({
      firstName: formData.firstName,
      surname: formData.surname,
      companyName: formData.companyName
    })
    setAlertMessage('Data was updated.', true)
  }

  return (
    <div className='smobile:w-full smobile:flex smobile:flex-col smobile:gap-[36px] tablet:mt-[41px] tablet:mb-[64px] smobile:mt-[46px] smobile:mb-[46px] laptop:mb-0 laptop:mt-[40px] desktop:mb-0 bdesktop:mb-0'>
      <h2 className='smobile:font-mundialRegular smobile:text-[24px] smobile:leading-[1] smobile:text-customParagraphMarkdown'>Your details</h2>
      <form
        className='smobile:grid smobile:gap-[24px] laptop:gap-x-[24px] laptop:gap-y-[32px] desktop:gap-[32px] laptop:grid-cols-2'
        onSubmit={(e) => {
          void handleSubmit(e)
        }}
      >
        <div className='smobile:grid gap-[10px]'>
          <label
            htmlFor='firstName'
            className='smobile:font-mundialLight smobile:text-customGrey smobile:leading-[1] smobile:text-[12px]'
          >
            First Name
          </label>
          <input
            id='firstName'
            type='text'
            name='firstName'
            value={formData.firstName}
            onChange={handleChange}
            className='smobile:px-[15px] smobile:py-[17px] smobile:min-h-[56px] smobile:font-mundialRegular smobile:text-customParagraphMarkdown smobile:text-[16px] smobile:leading-[1] smobile:justify-center smobile:items-center smobile:border-black'
            placeholder='Jane'
            maxLength={255}
            required
          />
        </div>
        <div className='smobile:grid gap-[10px]'>
          <label
            htmlFor='surname'
            className='smobile:font-mundialLight smobile:text-customGrey smobile:leading-[1] smobile:text-[12px]'
          >
            Last Name
          </label>
          <input
            id='surname'
            type='text'
            name='surname'
            value={formData.surname}
            onChange={handleChange}
            className='smobile:px-[15px] smobile:py-[17px] smobile:min-h-[56px] smobile:font-mundialRegular smobile:text-customParagraphMarkdown smobile:text-[16px] smobile:leading-[1] smobile:justify-center smobile:items-center smobile:border-black'
            placeholder='Doe'
            maxLength={255}
            required
          />
        </div>
        <div className='smobile:grid gap-[10px]'>
          <label
            htmlFor='email'
            className='smobile:font-mundialLight smobile:text-customGrey smobile:leading-[1] smobile:text-[12px]'
          >
            Email
          </label>
          <input
            id='email'
            type='email'
            name='email'
            value={formData.email}
            onChange={handleChange}
            className='smobile:px-[15px] smobile:py-[17px] smobile:min-h-[56px] smobile:font-mundialRegular smobile:text-customParagraphMarkdown smobile:text-[16px] smobile:leading-[1] smobile:justify-center smobile:items-center smobile:border-black'
            placeholder='Jane@doe.com'
            required
          />
        </div>
        <div className='smobile:grid gap-[10px]'>
          <div className='smobile:w-full smobile:flex smobile:justify-between smobile:items-center'>
            <label
              htmlFor='phone'
              className='smobile:font-mundialLight smobile:text-customGrey smobile:leading-[1] smobile:text-[12px]'
            >
              Phone
            </label>
          </div>
          <input
            id='phone'
            type='text'
            name='phone'
            placeholder='+61 402 111 222'
            value={formData.phone}
            onChange={handleChange}
            className='smobile:px-[15px] smobile:py-[17px] smobile:min-h-[56px] smobile:font-mundialRegular smobile:text-customParagraphMarkdown smobile:text-[16px] smobile:leading-[1] smobile:justify-center smobile:items-center smobile:border-black'
            required
            minLength={6}
            maxLength={255}
          />
        </div>
        <div className='smobile:grid gap-[10px] laptop:col-span-2'>
          <label
            htmlFor='companyName'
            className='smobile:font-mundialLight smobile:text-customGrey smobile:leading-[1] smobile:text-[12px]'
          >
            Company Name
          </label>
          <input
            id='companyName'
            type='text'
            name='companyName'
            value={formData.companyName}
            onChange={handleChange}
            className='smobile:px-[15px] smobile:py-[17px] smobile:min-h-[56px] smobile:font-mundialRegular smobile:text-customParagraphMarkdown smobile:text-[16px] smobile:leading-[1] smobile:justify-center smobile:items-center smobile:border-black'
            placeholder='Jane’s Jet skis'
            maxLength={255}
            required
          />
        </div>
        <button
          type='submit'
          title='Save changes'
          disabled={loading}
          className='smobile:mt-[22px] tablet:mt-[14px] laptop:mt-[18px] laptop:col-span-2 smobile:w-full tablet:max-w-[246px] tablet:ml-auto tablet:mx-0 smobile:h-auto smobile:py-[21px] bdesktop:py-[20px] smobile:min-h-[56px] smobile:mx-auto smobile:bg-orange smobile:font-mundialRegular smobile:text-customWhite smobile:font-normal smobile:text-[14px] bdesktop:text-[16px] smobile:leading-[1] disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Save changes
        </button>
      </form>
    </div>
  )
}
