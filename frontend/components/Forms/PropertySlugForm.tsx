'use client'

import * as React from 'react'
import { ExternalLinkIcon, TrashIcon } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { HeroMediaLibrary } from '@/components/Custom/HeroMediaLibrary'
import { MultiSelect } from '@/components/Custom/MultiSelect'
import { PropertyTextList } from '@/components/Lists/PropertyTextList'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { generatePropertyHero } from '@/lib/generator'
import { uploadAssets } from '@/app/actions'
import { countryList } from '@/constants/countryList'
import { parseAddress } from '@/lib/utils'
import { heroImageFileSchema } from '@/schemas/file-upload'

const facilitiesSuggestions = [
  '2.7m Ceilings',
  '3 Car Garage',
  '3m Ceilings',
  'BBQ',
  'Bar Fridge',
  'Beachfront',
  'Bike Storage',
  'Butlers Pantry',
  'Car Wash Bay',
  'EV Charger',
  'Extensive Outdoor Living',
  'Fireplace',
  'Gym',
  'Hot Tub',
  'Indoor Pool',
  'Indoor Spa',
  'Lift',
  'MPR',
  'Ocean Views',
  'Office',
  'Outdoor Kitchen',
  'Outdoor Pizza Oven',
  'Outdoor Pool',
  'Outdoor Shower',
  'Outdoor Spa',
  'Pet Wash',
  'Rooftop Amenities',
  'Rooftop Terraces',
  'Sauna',
  'Secure Garage',
  'Solar',
  'Storage',
  'Surfboard Storage',
  'Water Views',
  'Yoga Studio'
]

interface PropertySlugFormProps {
  data: StrapiPropertyProperty
  disabled: boolean
  onChange: <T extends StrapiPropertyPropertyFields> (name: T, val: StrapiPropertyProperty['attributes'][T]) => unknown
  onLoading: (loading: boolean) => unknown
}

function checkboxValue (val: string | null): string {
  return (val ?? '').endsWith(' disabled') ? 'disabled' : val ?? ''
}

function isDisabled (val: string | null): boolean {
  return (val ?? '').endsWith(' disabled')
}

export function PropertySlugForm ({
  data,
  disabled,
  onChange,
  onLoading
}: PropertySlugFormProps): React.ReactNode {
  const heroImagesInputRef = React.useRef<HTMLInputElement>(null)
  const brochureInputRef = React.useRef<HTMLInputElement>(null)
  const [heroImageError, setHeroImageError] = React.useState<string | null>(null)
  const allEmpty =
        (data.attributes.StreetAddress1 === null || data.attributes.StreetAddress1 === '') &&
        (data.attributes.StreetAddress2 === null || data.attributes.StreetAddress2 === '') &&
        (data.attributes.City === null || data.attributes.City === '') &&
        (data.attributes.Region === null || data.attributes.Region === '') &&
        (data.attributes.PostalCode === null || data.attributes.PostalCode === '') &&
        (data.attributes.Country === null || data.attributes.Country === '')

  React.useEffect(() => {
    if (data.attributes.Address !== null) {
      if (allEmpty) {
        const parsed = parseAddress(data.attributes.Address)
        if (parsed !== null && parsed.length > 0) {
          const addr = parsed[0]
          if (addr.address1 !== null) onChange('StreetAddress1', addr.address1)
          if (addr.city !== null) onChange('City', addr.city)
          if (addr.region !== null) onChange('Region', addr.region)
          if (addr.postalCode !== null) onChange('PostalCode', addr.postalCode)
          if (addr.country !== null) {
            onChange('Country', '')
            setTimeout(() => {
              onChange('Country', addr.country)
            }, 0)
          }
        }
      }
    }
  }, [data.attributes.Address, data.attributes.StreetAddress1, data.attributes.StreetAddress2, data.attributes.City, data.attributes.Region, data.attributes.PostalCode, data.attributes.Country, onChange])

  async function handleBrochureChange (files: FileList): Promise<void> {
    if (files.length !== 1) {
      return
    }

    onLoading(true)

    const [asset] = await uploadAssets(files[0])
    onChange('Brochure', { ...data.attributes.Brochure, data: asset })

    onLoading(false)
  }

  async function handleHeroAssetChange (files: FileList): Promise<void> {
    if (files.length === 0) {
      return
    }

    try {
      const filesArray = Array.from(files)

      for (const file of filesArray) {
        const result = heroImageFileSchema.safeParse({ type: file.type })
        if (!result.success) {
          setHeroImageError(result.error.errors[0].message)
          if (heroImagesInputRef.current != null) {
            heroImagesInputRef.current.value = ''
          }
          return
        }
      }

      setHeroImageError(null)
      onLoading(true)

      const assets = await uploadAssets(files)

      onChange('HeroImages', [
        ...data.attributes.HeroImages,
        ...assets.map(generatePropertyHero)
      ])

      onLoading(false)
    } catch (error) {
      setHeroImageError('An error occurred while processing the files.')
      if (heroImagesInputRef.current != null) {
        heroImagesInputRef.current.value = ''
      }
    }
  }

  function handleHeroAssetDelete (id: number): void {
    const mediaIdx = data.attributes.HeroImages.findIndex((file) => file.id === id)

    onChange('HeroImages', [
      ...data.attributes.HeroImages.slice(0, mediaIdx),
      ...data.attributes.HeroImages.slice(mediaIdx + 1)
    ])

    if (heroImagesInputRef.current != null) {
      heroImagesInputRef.current.value = ''
    }
    setHeroImageError(null)
  }

  function handleBrochureDelete (): void {
    onChange('Brochure', { ...data.attributes.Brochure, data: null })
    if (brochureInputRef.current != null) {
      brochureInputRef.current.value = ''
    }
  }

  function handleHeroAssetNameChange (id: number, name: string): void {
    const mediaIdx = data.attributes.HeroImages.findIndex((file) => file.id === id)

    onChange('HeroImages', [
      ...data.attributes.HeroImages.slice(0, mediaIdx),
      {
        ...data.attributes.HeroImages[mediaIdx],
        Name: name
      },
      ...data.attributes.HeroImages.slice(mediaIdx + 1)
    ])
  }

  function handleToggle (name: StrapiPropertyPropertyTextFields): void {
    const val = data.attributes[name] ?? ''
    onChange(name, isDisabled(val) ? val.replace(/ disabled$/, '') : `${val} disabled`)
  }

  return (
    <div className='flex flex-col gap-4'>
      <h1 className='text-3xl text-black flex gap-2 items-center'>
        {data.attributes.Name.trim()}
        <Link
          className='hover:opacity-70 transition duration-200'
          href={`/${data.attributes.Slug}`}
          prefetch={false}
          rel='noopener noreferrer'
          target='_blank'
        >
          <ExternalLinkIcon />
        </Link>
      </h1>
      <div className='relative'>
        <form className='space-y-0 grid grid-cols-2 gap-8 items-baseline p-[20px] rounded-xl border-zinc-200 border'>
          <div className='grid w-full max-w-sm mt-0 items-center'>
            <Label htmlFor='name' className='text-black mb-2'>Name</Label>
            <Input
              id='name'
              disabled={disabled}
              maxLength={24}
              onChange={(e) => onChange('Name', e.target.value)}
              placeholder='Enter property name'
              value={data.attributes.Name}
            />
            <p className='text-sm text-muted-foreground mt-[8px]'>
              Name should be at least 3 characters long
            </p>
          </div>
          <div className='grid w-full max-w-sm mt-0 items-center'>
            <Label htmlFor='slug' className='text-black mb-2'>Slug</Label>
            <Input
              id='slug'
              disabled
              placeholder='Enter property slug'
              readOnly
              value={data.attributes.Slug}
            />
            <p className='text-sm text-muted-foreground mt-[8px]'>
              Part of url used to access property page
            </p>
          </div>
          <div className='grid w-full max-w-sm mt-0 items-center'>
            <Label htmlFor='hero-images' className='text-black mb-2'>Hero Images</Label>
            <Input
              id='hero-images'
              ref={heroImagesInputRef}
              disabled={disabled}
              multiple
              accept='image/jpeg,image/jpg,image/png,image/webp,image/gif'
              onChange={(e) => {
                if (e.target.files !== null) {
                  void handleHeroAssetChange(e.target.files)
                }
              }}
              type='file'
            />
            {heroImageError !== null && (
              <p className='text-sm text-red-600 mt-2 font-medium'>
                {heroImageError}
              </p>
            )}
            <p className='text-sm text-muted-foreground mt-[8px]'>
              Images that are displayed in hero section. If images are not showing, try uploading them again.
            </p>
            {data.attributes.HeroImages.length > 0 && (
              <div className='rounded-[8px] mt-[5px] w-full h-[250px] relative overflow-hidden'>
                <HeroMediaLibrary
                  disabled={disabled}
                  media={data.attributes.HeroImages}
                  onDelete={handleHeroAssetDelete}
                  onNameChange={handleHeroAssetNameChange}
                />
              </div>
            )}
          </div>
          <div className='grid w-full max-w-sm mt-0 items-center'>
            <Label htmlFor='brochure' className='text-black mb-2'>Brochure</Label>
            <Input
              id='brochure'
              ref={brochureInputRef}
              disabled={disabled}
              onChange={(e) => {
                if (e.target.files !== null) {
                  void handleBrochureChange(e.target.files)
                }
              }}
              type='file'
            />
            <p className='text-sm text-muted-foreground mt-[8px]'>
              File that's downloaded when clicking "Download Brochure"
            </p>
            {data.attributes.Brochure.data !== null && (
              <div className='relative mt-2'>
                <div className='absolute right-2 top-2 z-10'>
                  <Button
                    disabled={disabled}
                    onClick={handleBrochureDelete}
                    size='icon'
                    type='button'
                    variant='destructive'
                  >
                    <TrashIcon size={16} />
                  </Button>
                </div>
                <embed
                  className='w-full'
                  height='250px'
                  src={data.attributes.Brochure.data.attributes.url}
                />
              </div>
            )}
          </div>
          <div className='grid w-full max-w-sm mt-0 items-center'>
            <Label htmlFor='address' className='text-black mb-2'>Address</Label>
            <div className='grid gap-y-2'>
              <div className='grid grid-cols-1 gap-2'>
                <div>
                  <Label htmlFor='street1' className='text-xs text-muted-foreground mb-1 block'>Street Address 1</Label>
                  <Input
                    id='street1'
                    disabled={disabled}
                    value={data.attributes.StreetAddress1 ?? ''}
                    onChange={(e) => onChange('StreetAddress1', e.target.value)}
                    placeholder='Street address, P.O. box, etc.'
                    className='h-9'
                  />
                </div>
                <div>
                  <Label htmlFor='suburb' className='text-xs text-muted-foreground mb-1 block'>Suburb</Label>
                  <Input
                    id='suburb'
                    disabled={disabled}
                    value={data.attributes.Suburb ?? ''}
                    onChange={(e) => onChange('Suburb', e.target.value)}
                    placeholder='e.g. Main Beach, Surfers Paradise, Southport, etc.'
                    className='h-9'
                  />
                </div>
              </div>

              <div className='grid grid-cols-3 gap-2'>
                <div className='col-span-1'>
                  <Label htmlFor='street2' className='text-xs text-muted-foreground mb-1 block'>Street 2</Label>
                  <Input
                    id='street2'
                    disabled={disabled}
                    value={data.attributes.StreetAddress2 ?? ''}
                    onChange={(e) => onChange('StreetAddress2', e.target.value)}
                    placeholder='Apt, suite, etc.'
                    className='h-9'
                  />
                </div>
                <div className='col-span-2'>
                  <Label htmlFor='city' className='text-xs text-muted-foreground mb-1 block'>City</Label>
                  <Input
                    id='city'
                    disabled={disabled}
                    value={data.attributes.City ?? ''}
                    onChange={(e) => onChange('City', e.target.value)}
                    placeholder='City'
                    className='h-9'
                  />
                </div>
              </div>

              <div className='grid grid-cols-5 gap-2'>
                <div className='col-span-3'>
                  <Label htmlFor='region' className='text-xs text-muted-foreground mb-1 block'>Region/State</Label>
                  <Input
                    id='region'
                    disabled={disabled}
                    value={data.attributes.Region ?? ''}
                    onChange={(e) => onChange('Region', e.target.value)}
                    placeholder='State/Province/Region'
                    className='h-9'
                  />
                </div>
                <div className='col-span-2'>
                  <Label htmlFor='postalCode' className='text-xs text-muted-foreground mb-1 block'>Postal Code</Label>
                  <Input
                    id='postalCode'
                    disabled={disabled}
                    value={data.attributes.PostalCode ?? ''}
                    onChange={(e) => onChange('PostalCode', e.target.value)}
                    placeholder='Postal code'
                    className='h-9'
                  />
                </div>
              </div>

              <div>
                <Label htmlFor='country' className='text-xs text-muted-foreground mb-1 block'>Country</Label>
                <Select
                  disabled={disabled}
                  value={data.attributes.Country ?? ''}
                  onValueChange={(value) => onChange('Country', value)}
                >
                  <SelectTrigger id='country' className='h-9'>
                    <SelectValue placeholder='Select a country' />
                  </SelectTrigger>
                  <SelectContent className='max-h-[300px]'>
                    {countryList.map((country, index) => (
                      <SelectItem key={index} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <p className='text-sm text-muted-foreground mt-[8px]'>
              Complete address will be formatted automatically
            </p>
          </div>
          <div className='grid w-full max-w-sm mt-0 items-center'>
            <Label htmlFor='summary' className='text-black mb-2'>Summary</Label>
            <Textarea
              id='summary'
              disabled={disabled}
              onChange={(e) => onChange('Summary', e.target.value)}
              placeholder='Enter property summary'
              rows={4}
              value={data.attributes.Summary ?? ''}
            />
            <p className='text-sm text-muted-foreground mt-[8px]'>
              Property summary section text
            </p>
          </div>
          <div className='grid w-full max-w-sm mt-0 items-center'>
            <Label htmlFor='commission' className='text-black mb-2'>Commission</Label>
            <Input
              id='commission'
              disabled={disabled}
              onChange={(e) => onChange('Commission', Number.parseFloat(e.target.value))}
              placeholder='Enter property commission'
              type='number'
              value={data.attributes.Commission}
            />
            <p className='text-sm text-muted-foreground mt-[8px]'>
              Property commission (%)
            </p>
          </div>
          <div className='grid w-full max-w-sm mt-0 items-center'>
            <div className='flex items-center gap-[10px] mb-2'>
              <Label htmlFor='architect' className='text-black'>Architect</Label>
              <Input
                checked={!isDisabled(data.attributes.Architect)}
                className='w-fit h-auto'
                disabled={disabled}
                onChange={() => handleToggle('Architect')}
                type='checkbox'
              />
            </div>
            <Input
              id='architect'
              disabled={isDisabled(data.attributes.Architect) || disabled}
              onChange={(e) => onChange('Architect', e.target.value)}
              placeholder='Enter property architect'
              value={checkboxValue(data.attributes.Architect)}
            />
          </div>
          <div className='grid w-full max-w-sm mt-0 items-center'>
            <div className='flex items-center gap-[10px] mb-2'>
              <Label htmlFor='builder' className='text-black'>Builder</Label>
              <Input
                checked={!isDisabled(data.attributes.Builder)}
                className='w-fit h-auto'
                disabled={disabled}
                onChange={() => handleToggle('Builder')}
                type='checkbox'
              />
            </div>
            <Input
              id='builder'
              disabled={isDisabled(data.attributes.Builder) || disabled}
              onChange={(e) => onChange('Builder', e.target.value)}
              placeholder='Enter property builder'
              value={checkboxValue(data.attributes.Builder)}
            />
          </div>
          <div className='grid w-full max-w-sm mt-0 items-center'>
            <div className='flex items-center gap-[10px] mb-2'>
              <Label htmlFor='developer' className='text-black'>Developer</Label>
              <Input
                checked={!isDisabled(data.attributes.Developer)}
                className='w-fit h-auto'
                disabled={disabled}
                onChange={() => handleToggle('Developer')}
                type='checkbox'
              />
            </div>
            <Input
              id='developer'
              disabled={isDisabled(data.attributes.Developer) || disabled}
              onChange={(e) => onChange('Developer', e.target.value)}
              placeholder='Enter property developer'
              value={checkboxValue(data.attributes.Developer)}
            />
          </div>
          <div className='grid w-full max-w-sm mt-0 items-center'>
            <div className='flex items-center gap-[10px] mb-2'>
              <Label htmlFor='book-a-call-link' className='text-black'>Book Call Code</Label>
              <Input
                checked={!isDisabled(data.attributes.BookACallLink)}
                className='w-fit h-auto'
                disabled={disabled}
                onChange={() => handleToggle('BookACallLink')}
                type='checkbox'
              />
            </div>
            <Textarea
              id='book-a-call-link'
              disabled={isDisabled(data.attributes.BookACallLink) || disabled}
              onChange={(e) => onChange('BookACallLink', e.target.value)}
              placeholder='Enter html code'
              rows={5}
              value={checkboxValue(data.attributes.BookACallLink)}
            />
          </div>
          <div className='grid w-full max-w-sm mt-0 items-center'>
            <div className='flex items-center gap-[10px] mb-2'>
              <Label htmlFor='make-an-offer-link' className='text-black'>Make Offer Code</Label>
              <Input
                checked={!isDisabled(data.attributes.MakeAnOfferLink)}
                className='w-fit h-auto'
                disabled={disabled}
                onChange={() => handleToggle('MakeAnOfferLink')}
                type='checkbox'
              />
            </div>
            <Textarea
              id='make-an-offer-link'
              disabled={isDisabled(data.attributes.MakeAnOfferLink) || disabled}
              onChange={(e) => onChange('MakeAnOfferLink', e.target.value)}
              placeholder='Enter html code'
              rows={5}
              value={checkboxValue(data.attributes.MakeAnOfferLink)}
            />
          </div>
          <div className='grid w-full max-w-sm mt-0 items-center'>
            <div className='flex items-center gap-[10px] mb-2'>
              <Label htmlFor='register-for-updates-code' className='text-black'>Register For Updates</Label>
              <Input
                checked={!isDisabled(data.attributes.RegisterForUpdatesCode)}
                className='w-fit h-auto'
                disabled={disabled}
                onChange={() => handleToggle('RegisterForUpdatesCode')}
                type='checkbox'
              />
            </div>
            {/* <Textarea
              id='register-for-updates-code'
              disabled={isDisabled(data.attributes.RegisterForUpdatesCode) || disabled}
              onChange={(e) => onChange('RegisterForUpdatesCode', e.target.value)}
              placeholder='Enter html code'
              rows={5}
              value={checkboxValue(data.attributes.RegisterForUpdatesCode)}
            /> */}
          </div>
          <div className='grid w-full max-w-sm mt-0 items-center'>
            <div className='flex items-center gap-[10px] mb-2'>
              <Label htmlFor='project-website-link' className='text-black'>Website Link</Label>
              <Input
                checked={!isDisabled(data.attributes.ProjectWebsiteLink)}
                className='w-fit h-auto'
                disabled={disabled}
                onChange={() => handleToggle('ProjectWebsiteLink')}
                type='checkbox'
              />
            </div>
            <Input
              id='project-website-link'
              disabled={isDisabled(data.attributes.ProjectWebsiteLink) || disabled}
              onChange={(e) => onChange('ProjectWebsiteLink', e.target.value)}
              placeholder='Enter property website link'
              value={checkboxValue(data.attributes.ProjectWebsiteLink)}
            />
          </div>
          <div className='grid w-full max-w-sm mt-0 items-center'>
            <Label className='text-black mb-2'>Deal Type</Label>
            <Select
              disabled={disabled}
              onValueChange={(val) => onChange('DealType', val as StrapiPropertyProperty['attributes']['DealType'])}
              value={data.attributes.DealType}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select a market value' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='ExclusiveOffMarket'>Exclusive Off Market</SelectItem>
                <SelectItem value='OnMarket'>On Market</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='grid w-full max-w-sm mt-0 items-center'>
            <Label className='text-black mb-2'>Build Stage</Label>
            <Select
              disabled={disabled}
              onValueChange={(val) => onChange('StageOfBuild', val as StrapiPropertyProperty['attributes']['StageOfBuild'])}
              value={data.attributes.StageOfBuild}
            >
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='Select a market value' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='PreRelease'>Pre Release</SelectItem>
                <SelectItem value='UnderConstruction'>Under Construction</SelectItem>
                <SelectItem value='Completed'>Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {data.attributes.Dates !== null && (
            <div className='grid w-full max-w-sm items-center'>
              <PropertyTextList
                disabled={disabled}
                label='Key Dates'
                onChange={(val) => onChange('Dates', val)}
                value={data.attributes.Dates}
              />
            </div>
          )}
          {data.attributes.Facilities !== null && (
            <div className='grid w-full max-w-sm items-center'>
              <MultiSelect
                disabled={disabled}
                label='Facilities'
                onChange={(val) => onChange('Facilities', val)}
                suggestions={facilitiesSuggestions}
                value={data.attributes.Facilities}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
