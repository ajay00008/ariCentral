'use client'

import { TitleCapitalize } from '@/utils/capitalize'

interface Props {
  currentTab: string
  onTabChange: (value: string) => void
}

const tabs = [
  'account',
  'commission'
]

export function AccountTabSelector ({ currentTab, onTabChange }: Props): React.ReactNode {
  function handleSelectTabStyles (tab: string): string {
    const tabStyles = currentTab === tab
      ? 'smobile:font-mundialDemiBold smobile:text-[16px] smobile:leading-[1] smobile:text-black smobile:pb-[24px] smobile:border-b smobile:border-black mb-[-1px]'
      : 'smobile:font-mundialLight smobile:text-[16px] smobile:leading-[1] smobile:text-customGrey smobile:pb-[24px] smobile:border-b smobile:border-transparent mb-[-1px]'
    return tabStyles
  }

  return (
    <div className='smobile:flex smobile:gap-[24px] smobile:items-center smobile:border-b smobile:border-[#D1D1D1]'>
      {tabs.map(item => (
        <button
          key={item}
          onClick={() => onTabChange(item)}
          className={handleSelectTabStyles(item)}
        >
          {TitleCapitalize(item)}
        </button>
      ))}
    </div>
  )
}
