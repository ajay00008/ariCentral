'use client'

import * as React from 'react'

export function NotFoundComponent (): React.ReactNode {
  React.useEffect(() => {
    const bodySelector = document.querySelector<HTMLElement>('body')
    if (bodySelector !== null) {
      bodySelector.style.background = 'black'
    }

    return () => {
      if (bodySelector !== null) {
        bodySelector.style.background = ''
      }
    }
  }, [])

  return (
    <div className='h-screen flex flex-col items-center justify-center text-center font-sans'>
      <div>
        <h1 className='inline-block m-0 mr-5 p-0 pr-6 text-xl font-medium leading-[49px] text-white border-r border-solid border-black/30 dark:border-white/30'>
          404
        </h1>
        <div className='inline-block'>
          <h2 className='m-0 text-sm font-normal leading-[49px] text-white'>
            This page could not be found.
          </h2>
        </div>
      </div>
    </div>
  )
}
