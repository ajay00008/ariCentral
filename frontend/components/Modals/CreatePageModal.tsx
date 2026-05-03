'use client'

import * as React from 'react'
import { RichTextEditor } from '@/components/RichTextEditor/RichTextEditor'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { PopoverContent } from '@radix-ui/react-popover'
import { addDays, endOfDay, format, isAfter } from 'date-fns'
import { CalendarIcon, X } from 'lucide-react'
import { closeModalWithAnimation, openModal } from './Client/UnitDetailsModal'
import { usePageProvider } from '@/providers/PageProvider'
import { Calendar } from '@/components/ui/calendar'
import { fetchAPI } from '@/api/fetch-api'

interface Props {
  onPageCreate: (newPage: DynamicPage) => void
}

export function CreatePageModal ({ onPageCreate }: Props): React.ReactNode {
  const { closeModal, isModalOpen } = usePageProvider()
  const [isError, setIsError] = React.useState(false)
  const [isSubmit, setIsSubmit] = React.useState(false)
  const [stylesChanged, setStylesChanged] = React.useState(false)
  const [MarkdownRerenderKey, setMarkdownRerenderKey] = React.useState(0)
  const [isPageValuesChanges, setIsPageValuesChanges] = React.useState(false)
  const [formData, setFormData] = React.useState({
    slug: '',
    name: '',
    description: '',
    date: new Date(),
    content: '',
    originalStaticSlug: ''
  })
  const today = new Date()

  function disableFutureDays (day: Date | string): boolean {
    return isAfter(day, endOfDay(today))
  }

  function handleMarkdownRerenderKeyIncrease (): void {
    setMarkdownRerenderKey(prev => prev + 1)
  }

  function onChange (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>): void {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setIsError(false)
  }

  function onMarkdownChange (markdown: string): void {
    if (!isPageValuesChanges) {
      setFormData({ ...formData, content: markdown, date: new Date() })
      setIsPageValuesChanges(true)
    } else setFormData({ ...formData, content: markdown })
  }

  async function handleSubmit (e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    setIsSubmit(true)

    const response = await fetchAPI<ActionProcessDynamicPage>('/api/admin/pages/create', {
      method: 'POST',
      token: undefined,
      fields: {
        data: {
          ...formData
        }
      }
    }, true, false)

    if ((response as ActionProcessDynamicPage).message?.includes('Slug is already taken / used.') === true) {
      setIsError(true)
      setIsSubmit(false)
    } else {
      setIsError(false)
      onPageCreate(response as ActionProcessDynamicPage)
      setFormData({
        slug: '',
        name: '',
        description: '',
        date: new Date(),
        content: '',
        originalStaticSlug: ''
      })
      setIsSubmit(false)
      handleCloseModal()
    }
  }

  function handleCloseModal (): void {
    if (!isSubmit) {
      setFormData({
        slug: '',
        name: '',
        description: '',
        date: formData.date,
        content: '',
        originalStaticSlug: ''
      })
      handleMarkdownRerenderKeyIncrease()
    }
    closeModalWithAnimation('pageModal')
    closeModal()
  }

  function handleBackdropClick (e: React.MouseEvent<HTMLDivElement>): void {
    if (e.target === e.currentTarget) {
      handleCloseModal()
    }
  }

  function handleEscape (e: KeyboardEvent): void {
    if (e.key === 'Escape') {
      handleCloseModal()
    }
  }

  React.useEffect(() => {
    if (isModalOpen) openModal('pageModal')
  }, [isModalOpen])

  React.useEffect(() => {
    if (isModalOpen) {
      document.addEventListener('keydown', (e) => handleEscape(e))

      return () => {
        document.removeEventListener('keydown', (e) => handleEscape(e))
      }
    }
  }, [isModalOpen])

  React.useEffect(() => {
    if (!stylesChanged || MarkdownRerenderKey !== 0) {
      const intervalId = setInterval(() => {
        const popupContainer = document.querySelector<HTMLElement>(
          '.mdxeditor-popup-container._editorRoot_uazmk_53._popupContainer_uazmk_1220.border.border-greySeparator'
        )

        if (popupContainer !== null && popupContainer !== undefined) {
          popupContainer.style.position = 'fixed'
          popupContainer.style.bottom = '0'
          setStylesChanged(true)
          clearInterval(intervalId)
        }
      }, 100)

      return () => clearInterval(intervalId)
    }
  }, [MarkdownRerenderKey])

  return (
    <div
      id='pageModal'
      className='fixed inset-0 z-[1] bg-black hidden bg-opacity-30 laptop:max-w-none'
      onClick={handleBackdropClick}
    >
      <div className='smobile:bg-white smobile:relative smobile:min-w-[375px] mobile:min-w-[428px] smobile:py-[30px] smobile:px-[16px] smobile:rounded-[20px] tablet:min-w-[768px] tablet:px-[30px] tablet:overflow-auto laptop:max-h-none laptop:w-full laptop:h-full laptop:overflow-y-scroll laptop:py-0 laptop:px-0 laptop:rounded-none'>
        <div className='smobile:flex smobile:flex-col smobile:w-auto smobile:h-auto laptop:flex-row'>
          <div className='smobile:flex smobile:flex-col smobile:w-auto smobile:h-auto laptop:ml-[64px] laptop:w-full laptop:p-[30px] desktop:p-[50px]'>
            <div className='flex justify-between bdesktop:items-center'>
              <div>
                <h2 className='font-medium text-2xl text-black'>Create Page</h2>
                <p className='text-medium text-black'>
                  You need to fulfill page data in this form.
                </p>
              </div>
              <button
                onClick={() => handleCloseModal()}
                className='text-gray-600 hover:text-gray-800'
              >
                <X width={26} height={26} />
              </button>
            </div>
            <div className='smobile:flex smobile:flex-col smobile:w-full smobile:h-auto'>
              <form
                className='flex flex-col gap-4 py-4'
                onSubmit={(e) => {
                  void handleSubmit(e)
                }}
              >
                <div className='flex items-center justify-between gap-3'>
                  <div className='flex flex-col items-center gap-3 min-w-[45%]'>
                    <div className='flex flex-col items-center gap-3 w-full'>
                      <div className='grid grid-cols-4 items-center gap-4 w-full'>
                        <Label htmlFor='slug' className='text-right'>
                          Slug
                        </Label>
                        <Input
                          id='page-slug'
                          name='slug'
                          type='text'
                          placeholder='MyPage1'
                          value={formData.slug}
                          onChange={(e) => onChange(e)}
                          className='col-span-3'
                          style={isError ? { border: '1px solid red' } : {}}
                          required
                        />
                      </div>
                      <p className={`${isError ? 'block' : 'hidden'} text-rose-600 ml-[auto] text-sm`}>
                        This slug value is already taken, please, try another.
                      </p>
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4 w-full'>
                      <Label htmlFor='name' className='text-right'>
                        Name
                      </Label>
                      <Input
                        id='page-name'
                        name='name'
                        type='text'
                        placeholder='MyPageName1'
                        value={formData.name}
                        onChange={(e) => onChange(e)}
                        className='col-span-3'
                        required
                      />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4 w-full'>
                      <Label htmlFor='description' className='text-right'>
                        Description
                      </Label>
                      <Textarea
                        id='page-description'
                        name='description'
                        placeholder='MyPageDescription'
                        value={formData.description}
                        onChange={(e) => onChange(e)}
                        className='col-span-3'
                        required
                      />
                    </div>
                    <div className='grid grid-cols-4 items-center gap-4 w-full'>
                      <Label htmlFor='date' className='text-right'>
                        Date
                      </Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            className={cn(
                              'w-[280px] justify-start text-left font-normal',
                              formData.date.toString() === '' && 'text-muted-foreground'
                            )}
                          >
                            <CalendarIcon className='mr-2 h-4 w-4' />
                            {(formData.date.toString() !== '' && !isNaN(new Date(formData.date).getTime())) ? format(formData.date, 'PPP') : <span>Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='flex w-auto flex-col space-y-2 p-2 z-[101] pointer-events-auto'>
                          <Select
                            onValueChange={(value) =>
                              setFormData({ ...formData, date: (addDays(new Date(), parseInt(value))) })}
                          >
                            <SelectTrigger className='z-[103]'>
                              <SelectValue placeholder='Select date preset' className='z-[104]' />
                            </SelectTrigger>
                            <SelectContent position='popper' className='z-[105]'>
                              <SelectItem value='0'>Today</SelectItem>
                              <SelectItem value='1'>Tomorrow</SelectItem>
                              <SelectItem value='3'>In 3 days</SelectItem>
                              <SelectItem value='7'>In a week</SelectItem>
                            </SelectContent>
                          </Select>
                          <div className='rounded-md border z-[104] bg-white'>
                            <Calendar
                              mode='single'
                              selected={formData.date}
                              onSelect={(e) => setFormData({ ...formData, date: e as Date })}
                              disabled={disableFutureDays}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className='flex flex-col w-fit items-center gap-4'>
                    <Label htmlFor='content' className='text-right'>
                      Content
                    </Label>
                    <RichTextEditor
                      key={MarkdownRerenderKey}
                      contentField={formData.content}
                      onFieldChange={() => { }}
                      onMarkDownChange={onMarkdownChange}
                      isPages
                    />
                  </div>
                </div>
                <div className='flex justify-end'>
                  <Button>Save changes</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
