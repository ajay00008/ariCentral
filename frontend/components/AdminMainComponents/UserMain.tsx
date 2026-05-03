'use client'

import * as React from 'react'
import { getAllUsers, searchUsersByParams } from '@/app/actions'
import { UsersList } from '@/components/Lists/UsersList'
import * as Sentry from '@sentry/nextjs'
import { useDebouncedValue } from '@/hooks/useDebouncedValue'

interface Props {
  currentUserId: string
}

export function UserMain ({ currentUserId }: Props): React.ReactNode {
  const [userData, setUserData] = React.useState<ActionGetAllUsers[] | null>(
    null
  )
  const [pagination, setPagination] = React.useState<Pagination | null>(null)
  const [currentPage, setCurrentPage] = React.useState('1')
  const [isLoading, setIsLoading] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState('')
  const debouncedSearchTerm = useDebouncedValue(searchTerm, 1000)
  const requestIdRef = React.useRef(0)

  React.useEffect(() => {
    if (debouncedSearchTerm.trim() !== '') {
      setCurrentPage('1')
    }
  }, [debouncedSearchTerm])

  React.useEffect(() => {
    async function fetchData (): Promise<void> {
      const requestId = ++requestIdRef.current
      setIsLoading(true)
      try {
        const search = debouncedSearchTerm.trim()
        let response

        if (search === '') {
          response = await getAllUsers(currentPage)
        } else {
          response = await searchUsersByParams(
            { mainQ: search },
            currentPage
          )
        }

        if (requestId === requestIdRef.current) {
          if (response !== null) {
            setUserData(response.data)
            setPagination(response.meta.pagination)
          } else {
            setUserData([])
            setPagination(null)
          }
        }
      } catch (err) {
        Sentry.captureException(err)
        if (requestId === requestIdRef.current) {
          setUserData([])
          setPagination(null)
        }
      } finally {
        if (requestId === requestIdRef.current) {
          setIsLoading(false)
        }
      }
    }

    void fetchData()
    return () => {
      requestIdRef.current++
    }
  }, [currentPage, debouncedSearchTerm])

  const handlePageChange = React.useCallback((page: number): void => {
    setCurrentPage(page.toString())
  }, [])

  return (
    <div className='flex flex-col pt-[50px] pb-[50px] width-[100%] height-[100%] px-16'>
      <UsersList
        data={userData}
        currentUserId={currentUserId}
        pagination={pagination}
        onPageChange={handlePageChange}
        isLoading={isLoading}
        setPagination={setPagination}
        onUserListChange={setUserData}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>
  )
}
