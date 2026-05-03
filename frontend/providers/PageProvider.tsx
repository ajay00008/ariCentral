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

const PageModalContext = React.createContext<Context | null>(null)

export function PageProvider ({ children }: Props): React.ReactNode {
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
    <PageModalContext.Provider value={initialValue}>
      {children}
    </PageModalContext.Provider>
  )
}

export function usePageProvider (): Context {
  const context = React.useContext(PageModalContext)
  if (context === null) {
    throw new Error('usePageProvider must be used within an PageProvider')
  }
  return context
}
