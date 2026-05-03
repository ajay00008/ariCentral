'use client'

import * as React from 'react'

interface Props {
  children: React.ReactNode
}

interface Context {
  isModalOpen: boolean
  closeModal: () => void
  openModal: () => void
}

const SearchFilterContext = React.createContext<Context | null>(null)

export function SearchFiltersProvider ({ children }: Props): React.ReactNode {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false)

  function openModal (): void {
    setIsModalOpen(true)
  }

  function closeModal (): void {
    setIsModalOpen(false)
  }

  const initialValue = {
    isModalOpen,
    openModal,
    closeModal
  }

  return (
    <SearchFilterContext.Provider value={initialValue}>
      {children}
    </SearchFilterContext.Provider>
  )
}

export function useSearchFilterProvider (): Context {
  const context = React.useContext(SearchFilterContext)
  if (context === null) {
    throw new Error('useSearchFilterProvider must be used within an BurgerProvider')
  }
  return context
}
