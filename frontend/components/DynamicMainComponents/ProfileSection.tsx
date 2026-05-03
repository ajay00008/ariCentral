'use client'

import * as React from 'react'
import { useSession } from 'next-auth/react'
import { ProfilePreview } from '@/components/Custom/ProfilePreview'
import { AccountManager } from '@/components/AccountManager/AccountManager'

export function ProfileSection (): React.ReactNode {
  const { data: session } = useSession()
  if (session === null) {
    return null
  }
  const user = session as SessionType
  const [userData, setUserData] = React.useState<SessionUserData>({
    firstName: user.user?.firstName,
    surname: user.user?.surname,
    companyName: user.user?.companyName
  })

  return (
    <section className='mx-auto laptop:max-w-[1280px] desktop:max-w-[1440px] bdesktop:max-w-[1728px] w-full h-auto'>
      <div id='container-account' className='smobile:flex smobile:px-[16px] tablet:px-[32px] desktop:px-[64px] smobile:flex-col smobile:gap-[52px] tablet:gap-[60px] laptop:gap-[65px] desktop:gap-[82px] bdesktop:gap-[64px]'>
        <div className='smobile:flex smobile:py-[48px] tablet:py-[65px] desktop:py-[64px] border-b border-[#D1D1D1]'>
          <h2 className='smobile:font-mundialRegular smobile:text-[40px] desktop:text-[56px] smobile:text-black smobile:leading-[1]'>
            Your Dashboard
          </h2>
        </div>
        <div className='smobile:flex smobile:flex-col smobile:gap-[52px] tablet:gap-[60px] laptop:flex laptop:flex-row laptop:w-full laptop:items-start laptop:gap-[125px] desktop:gap-[131px]'>
          <ProfilePreview user={user} userData={userData} />
          <AccountManager user={user} onChange={setUserData} />
        </div>
      </div>
    </section>
  )
}
