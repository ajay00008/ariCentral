'use client'

import * as React from 'react'
import { deleteImageFromDatabase, updateProfileImage } from '@/app/actions'
import assets from '@/assets'
import Image from 'next/image'

interface Props {
  user: SessionType
  userData: SessionUserData
}

export function ProfilePreview ({ user, userData }: Props): React.ReactNode {
  const [avatar, setAvatar] = React.useState({
    id: user.user?.avatar?.id,
    url: user.user?.avatar?.url,
    width: user.user?.avatar?.width,
    height: user.user?.avatar?.height
  })

  async function handleImageChange (e: React.ChangeEvent<HTMLInputElement>): Promise<void> {
    const formData = new FormData()

    if (e.target === undefined ||
      e.target.files === undefined ||
      e.target.files === null ||
      e.target.files.length === 0) {
      return
    }

    for (let i = 0; i < e.target.files.length; i++) {
      const file = e.target.files[i]
      formData.append('files', file)
    }

    formData.append('ref', 'plugin::users-permissions.user')
    formData.append('refId', (user.user?.id ?? '').toString())
    formData.append('field', 'avatar')

    if (avatar.id !== null && avatar.id !== undefined) {
      await deleteImageFromDatabase(typeof avatar.id === 'number' ? avatar.id : Number.parseInt(avatar.id, 10))
    }

    const res = await updateProfileImage(formData)

    const newAvatar = {
      id: res.id,
      url: res.url,
      width: res.width,
      height: res.height
    }

    if (user.user !== undefined) {
      user.user.avatar = newAvatar
      setAvatar(newAvatar)
    }
  }

  return (
    <div className='smobile:flex smobile:flex-col smobile:justify-center smobile:items-center smobile:gap-[33px] smobile:mb-[15px] tablet:mb-[23px] laptop:mb-0 laptop:min-w-[180px]'>
      <div className='smobile:relative smobile:w-auto smobile:h-auto smobile:overflow-hidden smobile:max-w-[180px] smobile:max-h-[180px]'>
        <Image
          priority
          src={avatar?.url ?? '/empty-skeleton.jpg'}
          alt='User avatar image'
          width={avatar?.width ?? 180}
          height={avatar?.height ?? 180}
          className='smobile:w-full smobile:h-full smobile:min-h-[180px] smobile:min-w-[180px] smobile:object-cover smobile:max-w-[180px] smobile:max-h-[180px] smobile:rounded-[1000px] smobile:border smobile:border-[#C8C8C8]'
        />
        <label htmlFor='upload-avatar' className='smobile:w-auto smobile:h-auto smobile:px-[12px] smobile:py-[12px] smobile:bg-orange smobile:border smobile:border-grey smobile:max-w-[40px] smobile:max-h-[40px] smobile:rounded-[1000px] smobile:absolute smobile:bottom-[6px] smobile:right-0 smobile:z-50 cursor-pointer'>
          <assets.CameraSVG width={15} height={15} />
        </label>
        <input
          id='upload-avatar'
          type='file'
          accept='image/*'
          className='hidden'
          onChange={(e) => {
            void handleImageChange(e)
          }}
        />
      </div>
      <div className='smobile:flex smobile:flex-col smobile:gap-[9px] justify-center items-center'>
        <h2 className='smobile:text-[28px] desktop:text-[32px] smobile:leading-[1] smobile:font-mundialRegular smobile:text-customParagraphMarkdown'>{userData?.firstName} {userData?.surname}</h2>
        <p className='smobile:text-[16px] smobile:leading-[1] smobile:font-mundialLight smobile:text-customGrey smobile:opacity-[95%]'>{userData?.companyName}</p>
      </div>
    </div>
  )
}
