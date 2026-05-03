'use client'

import * as React from 'react'
import { ExclamationTriangleIcon, RocketIcon } from '@radix-ui/react-icons'
import {
  Alert,
  AlertDescription,
  AlertTitle
} from '@/components/ui/alert'
import { AnimatePresence, motion } from 'framer-motion'

interface AlertProps {
  children: React.ReactNode
}

interface Context {
  errorMessage: string | null
  message: string | null
  setAlertMessage: (message: string, success: boolean) => void
}

const AlertContext = React.createContext<Context | null>(null)

export function AlertProvider ({ children }: AlertProps): React.ReactNode {
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [message, setMessage] = React.useState<string | null>(null)

  const setAlertMessage = (message: string, success: boolean): void => {
    if (success) setMessage(message)
    else setErrorMessage(message)
  }

  const initialValue = {
    setAlertMessage,
    errorMessage,
    message
  }

  React.useEffect(() => {
    if (message !== null || errorMessage !== null) {
      setTimeout(() => {
        setMessage(null)
        setErrorMessage(null)
      }, 4000)
    }
  }, [message, errorMessage])

  const animationVariants = {
    hidden: { x: '100%' },
    visible: { x: 0 }
  }

  return (
    <AlertContext.Provider value={initialValue}>
      {children}
      <AnimatePresence>
        {errorMessage !== null && (
          <motion.div
            initial='hidden'
            animate='visible'
            exit='hidden'
            variants={animationVariants}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            className='w-[600px] fixed z-100 top-[80px] right-2'
            style={{ top: '80px', zIndex: 100 }}
          >
            <Alert variant='destructive' className='bg-white'>
              <ExclamationTriangleIcon className='h-4 w-4' />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                {errorMessage}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
        {message !== null && (
          <motion.div
            initial='hidden'
            animate='visible'
            exit='hidden'
            variants={animationVariants}
            transition={{ type: 'spring', stiffness: 200, damping: 30 }}
            className='w-[600px] fixed z-100 top-[80px] right-2'
            style={{ top: '80px', zIndex: 100 }}
          >
            <Alert>
              <RocketIcon className='h-4 w-4' />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>
                {message}
              </AlertDescription>
            </Alert>
          </motion.div>
        )}
      </AnimatePresence>
    </AlertContext.Provider>
  )
}

export function useAlertProvider (): Context {
  const context = React.useContext(AlertContext)
  if (context === null) {
    throw new Error('useAlertProvider must be used within an AlertProvider')
  }
  return context
}
