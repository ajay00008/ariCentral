'use client'

import * as React from 'react'
import { Command as CommandPrimitive } from 'cmdk'
import { XIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Command, CommandItem, CommandList } from '@/components/ui/command'
import { CreatePropertyListItemModal } from '@/components/Modals/CreatePropertyListItemModal'
import { generateListItem } from '@/lib/generator'

interface MultiSelectProps {
  disabled: boolean
  label: string
  onChange: (val: StrapiSharedList) => unknown
  suggestions: string[]
  value: StrapiSharedList
}

export function MultiSelect ({
  disabled,
  label,
  onChange,
  suggestions,
  value
}: MultiSelectProps): React.ReactNode {
  const [open, setOpen] = React.useState(false)
  const [inputValue, setInputValue] = React.useState('')

  function handleCreate (val: string): void {
    onChange({
      ...value,
      Items: [
        ...(value.Items ?? []),
        generateListItem(val)
      ]
    })
  }

  function handleDelete (id: number): void {
    onChange({
      ...value,
      Items: [
        ...(value.Items ?? [])
          .filter((item) => item.id !== id)
          .map((item) => ({ ...item }))
      ]
    })
  }

  const currentSuggestions = suggestions.filter((suggestion) => {
    const items = (value.Items ?? [])
    const suggestionLower = suggestion.toLowerCase().trim()
    return items.find((it) => (it.Item ?? '').toLowerCase().trim() === suggestionLower) === undefined
  })

  return (
    <div className='flex flex-col gap-2'>
      <p className='text-sm/none font-medium text-black'>{label}</p>
      <div className='flex flex-col gap-2 border border-zinc-200 rounded-[8px] p-[10px]'>
        <CreatePropertyListItemModal
          disabled={disabled}
          onCreate={handleCreate}
        />
        <Command className='overflow-visible bg-transparent'>
          <div className='group border border-zinc-200 px-3 py-2 text-sm ring-offset-background rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2'>
            <div className='flex gap-1 flex-wrap'>
              {(value.Items ?? []).map((item) => {
                return (
                  <Badge key={item.id} variant='secondary'>
                    {item.Item}
                    <button
                      className='disabled:opacity-50 ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-muted-foreground enabled:hover:text-foreground'
                      disabled={disabled}
                      onClick={() => handleDelete(item.id)}
                    >
                      <XIcon className='h-3 w-3' />
                    </button>
                  </Badge>
                )
              })}
              <CommandPrimitive.Input
                className='ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1'
                disabled={disabled}
                onBlur={() => setOpen(false)}
                onFocus={() => setOpen(true)}
                onValueChange={setInputValue}
                placeholder='Select values...'
                value={inputValue}
              />
            </div>
          </div>
          {open && (
            <div className='relative mt-2'>
              <div className='absolute w-full z-10 top-0 rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in'>
                <CommandList>
                  <CommandPrimitive.Empty className='py-2 px-3 text-sm/none text-black'>
                    No results found
                  </CommandPrimitive.Empty>

                  {currentSuggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion}
                      className='cursor-pointer'
                      onMouseDown={(e) => e.preventDefault()}
                      onSelect={handleCreate}
                    >
                      {suggestion}
                    </CommandItem>
                  ))}
                </CommandList>
              </div>
            </div>
          )}
        </Command>
      </div>
    </div>
  )
}
