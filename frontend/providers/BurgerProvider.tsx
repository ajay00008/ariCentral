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

const BurgerContext = React.createContext<Context | null>(null)

export function BurgerProvider ({ children }: Props): React.ReactNode {
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
    <BurgerContext.Provider value={initialValue}>
      {children}
    </BurgerContext.Provider>
  )
}

export function useBurgerProvider (): Context {
  const context = React.useContext(BurgerContext)
  if (context === null) {
    throw new Error('useBurgerProvider must be used within an BurgerProvider')
  }
  return context
}
