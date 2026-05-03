'use client'

import * as React from 'react'
import ToggleSwitch from '@/components/Buttons/ToggleSwitch'
import { updateUserCommissionInDB } from '@/app/actions'
import { useAlertProvider } from '@/providers/AlertProvider'

interface Props {
  user: SessionType
}

export function AccountCommission ({ user }: Props): React.ReactNode {
  const { setAlertMessage } = useAlertProvider()
  const [loading, setLoading] = React.useState(false)
  const [showCommission, setShowCommission] = React.useState(user.user?.showCommission ?? false)

  function handleStateChange (setStateF: (state: boolean) => void, state: boolean): void {
    setStateF(!state)
  }

  async function handleClick (): Promise<void> {
    setLoading(true)
    await updateUserCommissionInDB(showCommission)

    if (user.user !== undefined) {
      user.user.showCommission = showCommission
    }

    setLoading(false)
    setAlertMessage('Data was updated.', true)
  }

  return (
    <div className='smobile:w-full smobile:flex smobile:flex-col smobile:gap-[36px] tablet:mt-[41px] tablet:mb-[64px] smobile:mt-[46px] smobile:mb-[46px] laptop:mb-0 laptop:mt-[40px] desktop:mb-0 bdesktop:mb-0'>
      <h2 className='smobile:font-mundialRegular smobile:text-[24px] smobile:leading-[1] smobile:text-customParagraphMarkdown'>Commission Settings</h2>
      <div className='smobile:w-full smobile:flex smobile:flex-col smobile:gap-[40px] laptop:gap-[48px]'>
        <div className='smobile:w-full smobile:flex smobile:justify-between smobile:items-center'>
          <div className='smobile:flex smobile:flex-col smobile:gap-[10px] smobile:w-fit'>
            <p className='smobile:font-mundialLight smobile:text-[20px] smobile:leading-[1] smobile:text-black'>Display Commission</p>
            <p className='smobile:font-mundialLight smobile:max-w-[200px] tablet:max-w-none smobile:text-[16px] smobile:leading-[1] smobile:text-customGrey'>Show commission on properties and units throughout the site</p>
          </div>
          <ToggleSwitch
            state={showCommission}
            loading={loading}
            setState={setShowCommission}
            onChange={handleStateChange}
          />
        </div>
        <button
          type='button'
          title='Save changes'
          disabled={loading}
          onClick={() => {
            void handleClick()
          }}
          className='smobile:mt-[22px] tablet:mt-[14px] laptop:mt-[18px] laptop:col-span-2 smobile:w-full tablet:max-w-[246px] tablet:ml-auto tablet:mx-0 smobile:h-auto smobile:py-[21px] bdesktop:py-[20px] smobile:min-h-[56px] smobile:mx-auto smobile:bg-orange smobile:font-mundialRegular smobile:text-customWhite smobile:font-normal smobile:text-[14px] bdesktop:text-[16px] smobile:leading-[1] disabled:opacity-50 disabled:cursor-not-allowed'
        >
          Save changes
        </button>
      </div>
    </div>
  )
}
