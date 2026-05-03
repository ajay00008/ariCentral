import React from 'react'

interface Tab {
  name: string
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  count?: number
}

interface TabIconProps {
  tabs: Tab[]
  currentTab: string
}

export function TabIcon ({ tabs, currentTab }: TabIconProps): React.ReactNode {
  const currentTabIndex = tabs.findIndex((tab) => tab.name === currentTab)
  const IconComponent = currentTabIndex !== -1 ? tabs[currentTabIndex].icon : null

  if (IconComponent === null) return null

  return (
    <IconComponent
      width={22}
      height={22}
      style={{ fill: 'white' }}
      className='smobile:w-[22px] smobile:h-[22px] laptop:flex laptop:shrink-0'
    />
  )
};
