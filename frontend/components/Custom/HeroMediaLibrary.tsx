import * as React from 'react'
import { ChevronLeftIcon, ChevronRightIcon, LetterTextIcon, TrashIcon } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface HeroMediaLibraryProps {
  disabled: boolean
  media: StrapiSharedPropertyHero[]
  onDelete?: (id: number) => unknown
  onNameChange?: (id: number, name: string) => unknown
}

export function HeroMediaLibrary ({ disabled, media, onDelete, onNameChange }: HeroMediaLibraryProps): React.ReactNode {
  const [names, setNames] = React.useState(media.map(it => it.Name))
  const [nameModalIdx, setNameModalIdx] = React.useState<number | null>(null)
  const [visible, setVisible] = React.useState(0)
  const currentVisible = media.length > visible ? visible : media.length - 1

  function handleTextChange (e: React.FormEvent, idx: number): void {
    e.preventDefault()
    onNameChange?.(media[idx].id, names[idx])
    setNameModalIdx(null)
  }

  React.useEffect(() => {
    setNames(media.map(it => it.Name))
  }, [media])

  return (
    <div className='absolute inset-0'>
      {media.map((file, idx) => (
        <div key={file.id} className={idx === currentVisible ? '' : 'invisible'}>
          <Image
            alt='Media image'
            className='object-cover'
            fill
            sizes='400px'
            src={file.Image.data.attributes.url}
          />
          {file.Name !== '' && (
            <div
              className='absolute bottom-0 left-0 w-full p-2 pt-6 text-white text-center font-mundialLight'
              style={{ background: 'linear-gradient(to top, #000, transparent)' }}
            >
              {file.Name}
            </div>
          )}
          <div className='absolute right-2 top-2 flex gap-1'>
            <Button
              disabled={disabled}
              onClick={() => setNameModalIdx(idx)}
              size='icon'
              type='button'
              variant='secondary'
            >
              <LetterTextIcon size={20} />
            </Button>
            <Button
              disabled={disabled}
              onClick={() => onDelete?.(file.id)}
              size='icon'
              variant='destructive'
            >
              <TrashIcon size={16} />
            </Button>
          </div>
        </div>
      ))}
      {currentVisible !== 0 && (
        <Button
          className='absolute left-2 top-1/2 rounded-full -translate-y-1/2'
          disabled={disabled}
          onClick={() => setVisible((prev) => prev - 1)}
          size='icon'
          type='button'
        >
          <ChevronLeftIcon size={16} />
        </Button>
      )}
      {currentVisible !== media.length - 1 && (
        <Button
          className='absolute right-2 top-1/2 rounded-full -translate-y-1/2'
          disabled={disabled}
          onClick={() => setVisible((prev) => prev + 1)}
          size='icon'
          type='button'
        >
          <ChevronRightIcon size={16} />
        </Button>
      )}
      <Dialog onOpenChange={() => setNameModalIdx(null)} open={nameModalIdx !== null}>
        <DialogTrigger asChild>
          <Button disabled={disabled} size='icon' variant='secondary'>
            <LetterTextIcon size={20} />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Property Hero</DialogTitle>
            <DialogDescription>
              You can customize the way property hero looks.
            </DialogDescription>
          </DialogHeader>
          {nameModalIdx !== null && (
            <form onSubmit={(e) => handleTextChange(e, nameModalIdx)}>
              <div className='grid gap-4 py-4'>
                <div className='grid grid-cols-4 items-center gap-4'>
                  <Label htmlFor='property-hero-name' className='text-right'>
                    Alt Text
                  </Label>
                  <Input
                    id='property-hero-name'
                    className='col-span-3'
                    onChange={(e) => {
                      setNames([
                        ...names.slice(0, nameModalIdx),
                        e.target.value,
                        ...names.slice(nameModalIdx + 1)
                      ])
                    }}
                    placeholder='Enter hero image text...'
                    value={names[nameModalIdx]}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type='submit'>Save changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
