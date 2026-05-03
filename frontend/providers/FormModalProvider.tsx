'use client'

import * as React from 'react'

interface Props {
  children: React.ReactNode
}

interface Context {
  isModalOpen: boolean
  iframeCode: string
  isNested: boolean
  closeModal: () => void
  openModal: (iframe: string, isNested: boolean | undefined) => void
}

const FormContext = React.createContext<Context | null>(null)

export function FormModalProvider ({ children }: Props): React.ReactNode {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [isNested, setIsNested] = React.useState(false)
  const [iframeCode, setIframeCode] = React.useState('')

  function openModal (iframe: string, isNested = false): void {
    setIsModalOpen(true)
    setIsNested(isNested)
    setIframeCode(iframe)
  }

  function closeModal (): void {
    setIsModalOpen(false)
  }

  const initialValue = {
    isModalOpen,
    iframeCode,
    isNested,
    openModal,
    closeModal
  }

  return (
    <FormContext.Provider value={initialValue}>
      {children}
    </FormContext.Provider>
  )
}

export function useFormProvider (): Context {
  const context = React.useContext(FormContext)
  if (context === null) {
    throw new Error('useFormProvider must be used within an BurgerProvider')
  }
  return context
}
