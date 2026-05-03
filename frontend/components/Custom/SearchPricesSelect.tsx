'use client'

import { ChevronDown } from 'lucide-react'

interface Props {
  variant: number
  text: string
  isHidden?: boolean
  data: SearchCheckboxes | FilterParamsSelects
  fieldName: string
  onValueChange: (e: React.ChangeEvent<HTMLSelectElement>, value: string) => void
  onCheckBoxChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export function SearchSelect ({ variant, text, data, onValueChange, onCheckBoxChange, isHidden, fieldName }: Props): React.ReactNode {
  function handleDivClick (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void {
    if ((e.target as HTMLElement).tagName !== 'INPUT') {
      const checkbox = e.currentTarget.querySelector<HTMLElement>('input[type="checkbox"]')
      if (checkbox !== null) {
        checkbox.click()
      }
    }
  }

  switch (variant) {
    case 2:
      return (
        <div className='smobile:flex smobile:flex-col smobile:gap-4 smobile:min-w-[134px] smobile:max-h-[350px]'>
          {isHidden === undefined && <p className='font-mundialRegular text-xl'>{text}</p>}
          <div className='smobile:relative smobile:w-full'>
            <select
              value={(data as FilterParamsSelects)[fieldName as keyof FilterParamsSelects]}
              onChange={(e) => onValueChange(e, fieldName)}
              className='smobile:w-full smobile:py-[9px] smobile:px-[14px] smobile:appearance-none smobile:font-mundialLight smobile:text-black smobile:text-[14px] smobile:leading-[1] smobile:bg-white smobile:border smobile:border-greySeparator hover:border-gray-400 focus:border-orange-500 focus:ring focus:ring-orange-200 transition duration-200'
            >
              <option value='Any' className='smobile:font-mundialLight smobile:text-[14px] smobile:leading-[1]'>Any</option>
              <option value='1' className='smobile:font-mundialLight smobile:text-[14px] smobile:leading-[1]'>1</option>
              <option value='2' className='smobile:font-mundialLight smobile:text-[14px] smobile:leading-[1]'>2</option>
              <option value='3' className='smobile:font-mundialLight smobile:text-[14px] smobile:leading-[1]'>3</option>
              <option value='4' className='smobile:font-mundialLight smobile:text-[14px] smobile:leading-[1]'>4</option>
              <option value='5' className='smobile:font-mundialLight smobile:text-[14px] smobile:leading-[1]'>5</option>
              <option value='6' className='smobile:font-mundialLight smobile:text-[14px] smobile:leading-[1]'>6</option>
              <option value='7' className='smobile:font-mundialLight smobile:text-[14px] smobile:leading-[1]'>7</option>
            </select>
            <ChevronDown className='absolute top-[50%] w-[16px] h-[16px] -translate-y-2/4 right-[10%] pointer-events-none' />
          </div>
        </div>
      )

    case 3:
      return (
        <div className='smobile:flex smobile:gap-[16px] smobile:w-auto smobile:items-start cursor-pointer' onClick={handleDivClick}>
          <input
            name={text}
            checked={(data as SearchCheckboxes)[fieldName as keyof SearchCheckboxes]}
            onChange={(e) => onCheckBoxChange(e)}
            type='checkbox'
            className='smobile:w-[16px] smobile:h-[16px] smobile:appearance-none smobile:bg-white smobile:border smobile:border-black smobile:checked:bg-black smobile:checked:border-black smobile:focus:outline-none smobile:transition smobile:duration-200 smobile:relative smobile:checked:before:content-[""] smobile:checked:before:block smobile:checked:before:w-[14px] smobile:checked:before:h-[14px] smobile:checked:before:bg-black smobile:checked:before:border-2 smobile:checked:before:border-white smobile:checked:before:relative smobile:checked:before:top-0 smobile:checked:before:left-0'
          />
          <p className='smobile:font-mundialLight smobile:text-black smobile:text-[16px] smobile:leading-[1]'>{text.replace(/([A-Z])/g, ' $1').trim()}</p>
        </div>
      )

    default:
      break
  }
}
