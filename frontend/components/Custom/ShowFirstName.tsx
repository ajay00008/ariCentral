'use client'

import * as React from 'react'

interface Props {
  userName: string
}

export function ShowFirstName ({ userName }: Props): React.ReactNode {
  const [firstName] = React.useState<string | undefined>(userName)

  return (
    <h1 className='smobile:font-mundialRegular smobile:text-[40px] desktop:text-[56px] smobile:leading-[1] smobile:text-black smobile:text-center'>G’day, {firstName}!</h1>
  )
}
