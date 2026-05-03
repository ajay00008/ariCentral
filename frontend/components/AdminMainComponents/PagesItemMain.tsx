'use client'

import * as React from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { CalendarIcon } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { RichTextEditor } from '@/components/RichTextEditor/RichTextEditor'
import { addDays, endOfDay, format, isAfter } from 'date-fns'
import { cn } from '@/lib/utils'
import { useAlertProvider } from '@/providers/AlertProvider'
import { fetchAPI } from '@/api/fetch-api'

interface PropertyItemMainComponent {
  id: number
  pageData: DynamicPage['attributes']
}

export function PagesItemMain ({ id, pageData }: PropertyItemMainComponent): React.ReactNode {
  const { setAlertMessage } = useAlertProvider()
  const [loading, setLoading] = React.useState(false)
  const [isError, setIsError] = React.useState(false)
  const [isPageValuesChanges, setIsPageValuesChanges] = React.useState(false)
  const [formData, setFormData] = React.useState({
    slug: pageData.Slug,
    name: pageData.Name,
    description: pageData.Description,
    date: pageData.Date,
    content: pageData.Content,
    originalStaticSlug: pageData.Slug
  })
  const today = new Date()

  function disableFutureDays (day: Date | string): boolean {
    return isAfter(day, endOfDay(today))
  }

  function onChange (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>): void {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    setIsError(false)
  }

  function onMarkdownChange (markdown: string): void {
    setFormData({ ...formData, content: markdown })
    if (!isPageValuesChanges) {
      setFormData({ ...formData, date: new Date() })
      setIsPageValuesChanges(true)
    }
  }

  async function handleSubmit (e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault()
    setLoading(true)

    const response = await fetchAPI<ActionProcessDynamicPage>('/api/admin/pages/update', {
      method: 'POST',
      token: undefined,
      fields: {
        data: {
          ...formData,
          pageId: id?.toString(),
          isSlugChanged: formData.originalStaticSlug === formData.slug,
          date: !isPageValuesChanges ? formData.date : formData.date.toLocaleDateString('en-CA')
        }
      }
    }, true, false)

    if ((response as ActionProcessDynamicPage).message?.includes('Slug is already taken / used.') === true) {
      setIsError(true)
      setLoading(false)
      setAlertMessage('Slug is already exist in DB, please, select another Slug to use.', false)
    } else {
      setIsError(false)
      setLoading(false)
      setAlertMessage('The page was successfully updated with your data.', true)
    }
  }

  return (
    <div className='flex flex-col pt-[50px] gap-[50px] pb-[50px] width-[100%] height-[100%] px-16'>
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
                  <div className='rounded-md border z-[104]'>
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
              contentField={formData.content}
              onFieldChange={() => { }}
              onMarkDownChange={onMarkdownChange}
              isPages
            />
          </div>
        </div>
        <div className='flex justify-end'>
          <Button disabled={loading} className='disabled:opacity-30 disabled:cursor-not-allowed'>Save changes</Button>
        </div>
      </form>
    </div>
  )
}
