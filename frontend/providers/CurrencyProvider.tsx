'use client'

import * as React from 'react'
import { getCurrentCurrency } from '@/app/actions'
import { initialCurrency } from '@/constants/currencies'

interface Props {
  children: React.ReactNode
  shouldLoad?: boolean
}

interface Context {
  currency: Currency
  handleChangeCurrency: (newCurrency: string) => void
}

const CurrencyContext = React.createContext<Context | null>(null)

export function CurrencyProvider ({ children, shouldLoad = true }: Props): React.ReactNode {
  const [currency, setCurrency] = React.useState<Currency>(initialCurrency)

  function handleChangeCurrency (newCurrency: string): void {
    setCurrency((prevCurrency) => ({
      ...prevCurrency,
      BaseCurrency: newCurrency
    }))
    localStorage.setItem('currency', newCurrency)
  }

  React.useEffect(() => {
    async function handleCurrency (): Promise<void> {
      const currency = await getCurrentCurrency()

      if (currency === null) {
        throw new Error('Unable to load currency metadata')
      }

      const localCurrency = localStorage.getItem('currency')

      setCurrency({
        ...currency,
        ...(localCurrency === null ? {} : { BaseCurrency: localCurrency })
      })
    }

    if (shouldLoad) {
      void handleCurrency()
    }
  }, [shouldLoad])

  const initialValue = {
    currency,
    handleChangeCurrency
  }

  return (
    <CurrencyContext.Provider value={initialValue}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrencyProvider (): Context {
  const context = React.useContext(CurrencyContext)
  if (context === null) {
    throw new Error('useCurrencyProvider must be used within an CurrencyProvider')
  }
  return context
}
