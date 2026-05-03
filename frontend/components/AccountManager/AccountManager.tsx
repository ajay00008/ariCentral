'use client'

import { AccountTabSelector } from '@/components/Custom/AccountTabSelector'
import { AccountForm } from '@/components/Forms/AccountForm'
import * as React from 'react'
import { AccountCommission } from '@/components/Custom/AccountCommission'

interface Props {
  user: SessionType
  onChange: React.Dispatch<React.SetStateAction<SessionUserData>>
}

export function AccountManager ({ user, onChange }: Props): React.ReactNode {
  const [currentTab, setCurrentTab] = React.useState('account')

  function handleTabChange (value: string): void {
    setCurrentTab(value)
  }

  return (
    <div className='laptop:max-w-[904px] laptop:w-full desktop:max-w-[970px]'>
      <AccountTabSelector currentTab={currentTab} onTabChange={handleTabChange} />
      {currentTab === 'account' && (
        <AccountForm user={user} onChange={onChange} />
      )}
      {currentTab === 'commission' && (
        <AccountCommission user={user} />
      )}
    </div>
  )
}
