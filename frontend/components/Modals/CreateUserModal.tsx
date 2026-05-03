'use client'

import * as React from 'react'
import { PlusCircledIcon } from '@radix-ui/react-icons'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { countryList } from '@/constants/countryList'
import {
  avgSalesPriceList,
  bestDescribeList,
  howDidYouHearList,
  introducedList
} from '@/constants/registration-mock'
import { useAlertProvider } from '@/providers/AlertProvider'
import { fetchAPI } from '@/api/fetch-api'
import { validateUserForm, type FieldErrors } from '@/utils/validateUserForm'

interface Props {
  onUserCreate: (newUser: ActionCreateUser) => void
  onUserUpdate: (id: number, updatedUser: CustomUser) => void
  edit: boolean
  id?: number
  isModalOpen: boolean
  toggleModal: (value: boolean) => void
  currentUserModalId: number | null
  allUsers: ActionGetAllUsers[] | null
}

const defaultFormData = {
  email: '',
  password: '',
  role: 'Authenticated',
  firstName: '',
  surname: '',
  phone: '',
  address: '',
  companyName: '',
  country: '',
  howDidYouHear: '',
  bestDescribe: '',
  avgSalesPrice: 'below1M',
  introduced: introducedList[2]
}

export function CreateUserModal ({
  onUserCreate,
  onUserUpdate,
  isModalOpen,
  toggleModal,
  edit,
  id,
  currentUserModalId,
  allUsers
}: Props): React.ReactNode {
  const { setAlertMessage } = useAlertProvider()
  const [formError, setFormError] = React.useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = React.useState<FieldErrors>({})
  const [isOpen, setIsOpen] = React.useState(false)
  const [editMode, setEditMode] = React.useState(false)
  const [formData, setFormData] = React.useState({ ...defaultFormData })
  const [isLoading, setIsLoading] = React.useState(false)

  function handleModalOpen (value: boolean): void {
    setIsOpen(value)
  }

  function onChange (
    e:
    | React.ChangeEvent<HTMLInputElement>
    | React.ChangeEvent<HTMLTextAreaElement>
  ): void {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (fieldErrors[name] !== undefined) {
      setFieldErrors({ ...fieldErrors, [name]: '' })
    }
  }

  function handleSelectChange (value: string, fieldName: string): void {
    if (value === '') return
    setFormData({ ...formData, [fieldName]: value })
    if (fieldErrors[fieldName] !== undefined) {
      setFieldErrors({ ...fieldErrors, [fieldName]: '' })
    }
  }

  async function handleSubmit (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault()

    const errors = validateUserForm(formData, editMode)
    setFieldErrors(errors)

    if (Object.keys(errors).length > 0) {
      setFormError('Please fill in all required fields')
      return
    }

    if (editMode) {
      const emptyValues = Object.fromEntries(
        Object.entries(formData).filter(
          ([key, value]) =>
            key !== 'password' &&
            key !== 'stripeCustomerId' &&
            key !== 'subscriptionId' &&
            (value === undefined || value === '' || value === null)
        )
      )
      if (Object.keys(emptyValues).length > 0) {
        setFormError('All fields must be filled.')
        return
      }
    }

    const filteredValues = Object.fromEntries(
      Object.entries(formData).filter(
        ([key, value]) =>
          key === 'email' ||
          key === 'password' ||
          (value !== undefined && value !== '')
      )
    )

    setIsLoading(true)

    if (editMode) {
      const response = await fetchAPI<ActionUpdateUser>(
        '/api/admin/user/update/data',
        {
          method: 'POST',
          token: undefined,
          fields: {
            data: {
              id: currentUserModalId,
              email: formData.email,
              password: formData.password,
              ...filteredValues
            }
          }
        },
        true,
        false
      )

      const errorMsg = (response as any)?.message ?? (response as any)?.error?.message
      if (
        typeof errorMsg === 'string' &&
        errorMsg.length > 0
      ) {
        setFormError(errorMsg)
        setIsLoading(false)
        return
      }

      if (currentUserModalId !== null && typeof (response as any)?.id !== 'undefined') {
        setFormError(null)
        setFieldErrors({})
        onUserUpdate(currentUserModalId, response as ActionUpdateUser)
        setAlertMessage('User was updated successfully.', true)
        setFormData({ ...defaultFormData })
        setIsLoading(false)
        setIsOpen(false)
      } else {
        setFormError('Failed to update user. Please try again.')
        setIsLoading(false)
      }
    } else {
      const response = await fetchAPI<ActionCreateUser>(
        '/api/admin/user/create',
        {
          method: 'POST',
          token: undefined,
          fields: {
            data: {
              email: formData.email,
              password: formData.password,
              ...filteredValues
            }
          }
        },
        true,
        false,
        true
      )
      const errorMsg = (response as any)?.message
      if (
        typeof errorMsg === 'string' &&
        errorMsg !== ''
      ) {
        setFormError(errorMsg)
        setIsLoading(false)
      } else {
        setFormError(null)
        setFieldErrors({})
        onUserCreate(response as ActionCreateUser)
        setAlertMessage('User was created successfully.', true)
        setFormData({ ...defaultFormData })
        setIsLoading(false)
        setIsOpen(false)
      }
    }
  }

  React.useEffect(() => {
    if (isModalOpen) handleModalOpen(true)
  }, [isModalOpen])

  React.useEffect(() => {
    if (!isOpen) {
      handleModalOpen(false)
      toggleModal(false)
      setFormData({ ...defaultFormData })
      setFormError(null)
      setFieldErrors({})
    }
  }, [isOpen])

  React.useEffect(() => {
    if (currentUserModalId !== null) {
      setEditMode(true)
      const foundedUser = allUsers?.find((it) => it.id === currentUserModalId)
      if (foundedUser === undefined) return

      const newFormData = Object.fromEntries(
        Object.entries({
          ...foundedUser,
          role: foundedUser.role.name
        }).filter(([_, v]) => v !== null && v !== undefined)
      )

      setFormData({ ...defaultFormData, ...newFormData })
    } else {
      setFormData({ ...defaultFormData })
      setEditMode(false)
    }
  }, [currentUserModalId])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          size='sm'
          className='w-fit ml-auto mr-[50px] h-[50px] gap-1 bg-zinc-400'
          onClick={() => toggleModal(true)}
        >
          <PlusCircledIcon className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
            Add User
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px] md:max-w-[800px] h-screen tablet:h-auto overflow-auto'>
        <DialogHeader>
          <DialogTitle>{editMode ? 'Update user' : 'Create User'}</DialogTitle>
          <DialogDescription>
            You need to fill all the user data.
          </DialogDescription>
        </DialogHeader>
        {formError !== null && (
          <div className='text-rose-600 text-center text-sm mb-2'>
            {formError}
          </div>
        )}
        <form
          className='grid tablet:grid-cols-2 gap-4 py-4'
          onSubmit={(e) => {
            void handleSubmit(e)
          }}
        >
          <div className='flex flex-col items-center gap-3'>
            <div className='grid grid-cols-4 items-center gap-4 w-full'>
              <Label htmlFor='email' className='text-right'>
                Email
              </Label>
              <div className='col-span-3'>
                <Input
                  id='user-email'
                  name='email'
                  type='email'
                  placeholder='Jane@doe.com'
                  value={formData.email}
                  onChange={(e) => onChange(e)}
                  className={fieldErrors.email !== undefined && fieldErrors.email !== '' ? 'border-rose-500' : ''}
                  required
                />
                {fieldErrors.email !== undefined && fieldErrors.email !== '' && (
                  <p className='text-rose-600 text-xs mt-1'>{fieldErrors.email}</p>
                )}
              </div>
            </div>
          </div>
          {!editMode && (
            <div className='flex flex-col items-center gap-3'>
              <div className='grid grid-cols-4 items-center gap-4 w-full'>
                <Label htmlFor='password' className='text-right'>
                  Password
                </Label>
                <div className='col-span-3'>
                  <Input
                    type='password'
                    id='user-password'
                    name='password'
                    placeholder=''
                    value={formData.password}
                    onChange={(e) => onChange(e)}
                    className={fieldErrors.password !== undefined && fieldErrors.password !== '' ? 'border-rose-500' : ''}
                    required
                    minLength={6}
                    maxLength={255}
                  />
                  {fieldErrors.password !== undefined && fieldErrors.password !== '' && (
                    <p className='text-rose-600 text-xs mt-1'>{fieldErrors.password}</p>
                  )}
                </div>
              </div>
            </div>
          )}
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='role' className='text-right'>
              Role
            </Label>
            <div className='col-span-3'>
              <Select
                value={formData.role ?? 'Authenticated'}
                onValueChange={(e) => handleSelectChange(e, 'role')}
                required
              >
                <SelectTrigger className='w-full'>
                  <SelectValue placeholder='Select user role' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Authenticated'>Client</SelectItem>
                  <SelectItem value='Admin'>Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='firstName' className='text-right'>
              First Name
            </Label>
            <div className='col-span-3'>
              <Input
                id='user-firstName'
                name='firstName'
                placeholder='Jane'
                value={formData.firstName}
                onChange={(e) => onChange(e)}
                className={fieldErrors.firstName !== undefined && fieldErrors.firstName !== '' ? 'border-rose-500' : ''}
                required
                maxLength={255}
              />
              {fieldErrors.firstName !== undefined && fieldErrors.firstName !== '' && (
                <p className='text-rose-600 text-xs mt-1'>{fieldErrors.firstName}</p>
              )}
            </div>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='surname' className='text-right'>
              Last Name
            </Label>
            <div className='col-span-3'>
              <Input
                id='user-surname'
                name='surname'
                placeholder='Doe'
                value={formData.surname}
                onChange={(e) => onChange(e)}
                className={fieldErrors.surname !== undefined && fieldErrors.surname !== '' ? 'border-rose-500' : ''}
                required
                maxLength={255}
              />
              {fieldErrors.surname !== undefined && fieldErrors.surname !== '' && (
                <p className='text-rose-600 text-xs mt-1'>{fieldErrors.surname}</p>
              )}
            </div>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='phone' className='text-right'>
              Phone
            </Label>
            <div className='col-span-3'>
              <Input
                id='user-phone'
                name='phone'
                placeholder='+61 000 000 000'
                value={formData.phone}
                onChange={(e) => onChange(e)}
                className={fieldErrors.phone !== undefined && fieldErrors.phone !== '' ? 'border-rose-500' : ''}
                required
                maxLength={255}
              />
              {fieldErrors.phone !== undefined && fieldErrors.phone !== '' && (
                <p className='text-rose-600 text-xs mt-1'>{fieldErrors.phone}</p>
              )}
            </div>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='address' className='text-right'>
              Address
            </Label>
            <div className='col-span-3'>
              <Input
                id='user-address'
                name='address'
                placeholder='123 Example St, Town 0000'
                value={formData.address}
                onChange={(e) => onChange(e)}
                className={fieldErrors.address !== undefined && fieldErrors.address !== '' ? 'border-rose-500' : ''}
                required
                maxLength={255}
              />
              {fieldErrors.address !== undefined && fieldErrors.address !== '' && (
                <p className='text-rose-600 text-xs mt-1'>{fieldErrors.address}</p>
              )}
            </div>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='companyName' className='text-right'>
              Company
            </Label>
            <div className='col-span-3'>
              <Input
                id='user-companyName'
                name='companyName'
                placeholder='Jet Skis'
                value={formData.companyName}
                onChange={(e) => onChange(e)}
                className={fieldErrors.companyName !== undefined && fieldErrors.companyName !== '' ? 'border-rose-500' : ''}
                required
                maxLength={255}
              />
              {fieldErrors.companyName !== undefined && fieldErrors.companyName !== '' && (
                <p className='text-rose-600 text-xs mt-1'>{fieldErrors.companyName}</p>
              )}
            </div>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='country' className='text-right'>
              Country
            </Label>
            <div className='col-span-3'>
              <Select
                value={formData.country ?? 'Australia'}
                onValueChange={(e) => handleSelectChange(e, 'country')}
                required
              >
                <SelectTrigger className={`w-full ${fieldErrors.country !== undefined && fieldErrors.country !== '' ? 'border-rose-500' : ''}`}>
                  <SelectValue placeholder='Select country' />
                </SelectTrigger>
                <SelectContent>
                  {countryList.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.country !== undefined && fieldErrors.country !== '' && (
                <p className='text-rose-600 text-xs mt-1'>{fieldErrors.country}</p>
              )}
            </div>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='howDidYouHear' className='text-right'>
              Heard About With
            </Label>
            <div className='col-span-3'>
              <Select
                value={formData.howDidYouHear ?? 'Google'}
                onValueChange={(e) => handleSelectChange(e, 'howDidYouHear')}
                required
              >
                <SelectTrigger className={`w-full ${fieldErrors.howDidYouHear !== undefined && fieldErrors.howDidYouHear !== '' ? 'border-rose-500' : ''}`}>
                  <SelectValue placeholder='Select heard about with' />
                </SelectTrigger>
                <SelectContent>
                  {howDidYouHearList.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.howDidYouHear !== undefined && fieldErrors.howDidYouHear !== '' && (
                <p className='text-rose-600 text-xs mt-1'>{fieldErrors.howDidYouHear}</p>
              )}
            </div>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='bestDescribe' className='text-right'>
              Best Described As
            </Label>
            <div className='col-span-3'>
              <Select
                value={formData.bestDescribe ?? 'Agent'}
                onValueChange={(e) => handleSelectChange(e, 'bestDescribe')}
                required
              >
                <SelectTrigger className={`w-full ${fieldErrors.bestDescribe !== undefined && fieldErrors.bestDescribe !== '' ? 'border-rose-500' : ''}`}>
                  <SelectValue placeholder='Select best described as' />
                </SelectTrigger>
                <SelectContent>
                  {bestDescribeList.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.bestDescribe !== undefined && fieldErrors.bestDescribe !== '' && (
                <p className='text-rose-600 text-xs mt-1'>{fieldErrors.bestDescribe}</p>
              )}
            </div>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='avgSalesPrice' className='text-right'>
              Average Sales Price
            </Label>
            <div className='col-span-3'>
              <Select
                value={formData.avgSalesPrice}
                onValueChange={(e) => handleSelectChange(e, 'avgSalesPrice')}
                required
              >
                <SelectTrigger className={`w-full ${fieldErrors.avgSalesPrice !== undefined && fieldErrors.avgSalesPrice !== '' ? 'border-rose-500' : ''}`}>
                  <SelectValue placeholder='Select average sales price' />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(avgSalesPriceList).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.avgSalesPrice !== undefined && fieldErrors.avgSalesPrice !== '' && (
                <p className='text-rose-600 text-xs mt-1'>{fieldErrors.avgSalesPrice}</p>
              )}
            </div>
          </div>
          <div className='grid grid-cols-4 items-center gap-4'>
            <Label htmlFor='introduced' className='text-right'>
              Introduced By
            </Label>
            <div className='col-span-3'>
              <Select
                value={formData.introduced}
                onValueChange={(e) => handleSelectChange(e, 'introduced')}
                required
              >
                <SelectTrigger className={`w-full ${fieldErrors.introduced !== undefined && fieldErrors.introduced !== '' ? 'border-rose-500' : ''}`}>
                  <SelectValue placeholder='Select introduced by' />
                </SelectTrigger>
                <SelectContent>
                  {introducedList.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {fieldErrors.introduced !== undefined && fieldErrors.introduced !== '' && (
                <p className='text-rose-600 text-xs mt-1'>{fieldErrors.introduced}</p>
              )}
            </div>
          </div>
          <div className='flex justify-end'>
            <Button disabled={isLoading}>
              {isLoading ? (editMode ? 'Updating...' : 'Creating...') : 'Save changes'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
