'use client'

import * as React from 'react'

interface Props {
  children: React.ReactNode
}

interface Context {
  historyArray: string[]
  updateHistory: (value: string, isBeginning: boolean) => void
}

const HistoryContext = React.createContext<Context | null>(null)

export function HistoryProvider ({ children }: Props): React.ReactNode {
  const [historyArray, setHistoryArray] = React.useState<string[]>([])
  const [historyUpdated, setHistoryUpdated] = React.useState(false)

  function updateHistory (value: string, isBeginning: boolean): void {
    const isHistoryNull = localStorage.getItem('historyArray')
    if (isHistoryNull === null) {
      localStorage.setItem('historyArray', JSON.stringify([value]))
      return setHistoryArray(prev => [...prev, value])
    }
    if (historyUpdated) {
      setHistoryArray(prev => {
        if (isBeginning) {
          const newHistory = [value]
          localStorage.setItem('historyArray', JSON.stringify(newHistory))
          return newHistory
        }
        if (prev.includes(value)) {
          const filteredValues = prev.filter((item) => item !== value)
          const newHistory = [...filteredValues, value]
          localStorage.setItem('historyArray', JSON.stringify(newHistory))
          return newHistory
        }

        const newHistory = [...prev, value]
        localStorage.setItem('historyArray', JSON.stringify(newHistory))
        return newHistory
      })
    }
  }

  React.useEffect(() => {
    if (localStorage !== undefined) {
      if (typeof localStorage !== 'undefined') {
        const savedHistory = localStorage.getItem('historyArray')
        const initialHistory = savedHistory !== null ? JSON.parse(savedHistory) : []

        setHistoryArray(prev => {
          const combined = [...prev, ...initialHistory]
          return combined
        })
        setHistoryUpdated(true)
      }
    }
  }, [])

  React.useEffect(() => {
    function checkLocationAndUpdateHistory (): void {
      const currentUrl = window.location.href
      if (!currentUrl.includes(`${window.location.origin}/search`)) {
        setHistoryArray([])
        localStorage.removeItem('historyArray')
      } else if (currentUrl === `${window.location.origin}/search`) {
        const historyString = localStorage.getItem('historyArray')
        const historyArray = historyString !== null ? JSON.parse(historyString) : []
        const hasSearchPage = historyArray.includes(`${window.location.origin}/search`)
        if (hasSearchPage === false) {
          localStorage.setItem('historyArray', JSON.stringify([...historyArray, `${window.location.origin}/search`]))
        }
      }
    }

    checkLocationAndUpdateHistory()

    const observer = new MutationObserver(checkLocationAndUpdateHistory)
    observer.observe(document, { subtree: true, childList: true })

    return () => {
      observer.disconnect()
    }
  }, [])

  const initialValue = {
    historyArray,
    updateHistory
  }

  return (
    <HistoryContext.Provider value={initialValue}>
      {children}
    </HistoryContext.Provider>
  )
}

export function useHistoryProvider (): Context {
  const context = React.useContext(HistoryContext)
  if (context === null) {
    throw new Error('useHistoryProvider must be used within a HistoryProvider')
  }
  return context
}
