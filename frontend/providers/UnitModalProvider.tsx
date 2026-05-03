'use client'

import * as React from 'react'

interface Props {
  children: React.ReactNode
}

export const UnitModalTab = {
  FloorPlans: 'FloorPlans',
  Gallery: 'Gallery',
  Summary: 'Summary',
  Views: 'Views'
} as const

type UnitModalTabType = typeof UnitModalTab[keyof typeof UnitModalTab]

interface Context {
  unitId: number | null
  tab: UnitModalTabType
  isModalOpen: boolean
  closeModal: () => void
  openModal: (unitId: number, tab?: UnitModalTabType) => void
}

const UnitModalContext = React.createContext<Context | null>(null)

export function UnitModalProvider ({ children }: Props): React.ReactNode {
  const [tab, setTab] = React.useState<UnitModalTabType>(UnitModalTab.Summary)
  const [unitId, setUnitId] = React.useState<number | null>(null)
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false)

  function openModal (unitId: number, tab: UnitModalTabType = UnitModalTab.Summary): void {
    setIsModalOpen(true)
    setUnitId(unitId)
    setTab(tab)
  }

  function closeModal (): void {
    setIsModalOpen(false)
  }

  const initialValue = {
    unitId,
    isModalOpen,
    tab,
    openModal,
    closeModal
  }

  return (
    <UnitModalContext.Provider value={initialValue}>
      {children}
    </UnitModalContext.Provider>
  )
}

export function useUnitModalProvider (): Context {
  const context = React.useContext(UnitModalContext)
  if (context === null) {
    throw new Error('useUnitModalProvider must be used within an UnitModalProvider')
  }
  return context
}
