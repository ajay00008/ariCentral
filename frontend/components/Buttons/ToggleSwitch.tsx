'use client'

import * as React from 'react'

interface Props {
  state: boolean
  loading: boolean
  setState: React.Dispatch<React.SetStateAction<boolean>>
  onChange: (setStateF: (state: boolean) => void, state: boolean) => void
}

export default function ToggleSwitch ({ state, loading, setState, onChange }: Props): React.ReactNode {
  const trackStyles = state
    ? 'absolute top-0 left-[-65px] w-[48px] h-[20px] rounded-full bg-opacity-[20%] bg-orange transition duration-200'
    : 'absolute top-0 left-[-65px] w-[48px] h-[20px] rounded-full bg-opacity-[8%] bg-[#212121] transition duration-200'
  const thumbStyles = state
    ? 'absolute top-[-4px] left-[-75px] w-[28px] h-[28px] rounded-full bg-orange transition-all duration-200 ease-in translate-x-[35px] shadow-customThumb'
    : 'absolute top-[-4px] left-[-75px] w-[28px] h-[28px] rounded-full bg-white transition-all duration-200 ease-in shadow-customThumb'

  return (
    <div className='toggle relative flex items-center smobile:h-[28px]'>
      <input
        type='checkbox'
        id='temp'
        className='smobile:flex smobile:opacity-0 smobile:w-[48px] smobile:h-[20px] smobile:absolute smobile:top-0 smobile:left-[-65px] smobile:z-50 disabled:cursor-not-allowed'
        checked={state}
        disabled={loading}
        onChange={() => onChange(setState, state)}
      />
      <span
        className={trackStyles}
      />
      <span
        className={thumbStyles}
      />
    </div>
  )
}
