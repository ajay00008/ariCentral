'use client'

import * as React from 'react'
import { X } from 'lucide-react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { CreateUserModal } from '@/components/Modals/CreateUserModal'
import {
  blockUserById,
  confirmUserById,
  deleteUserById,
  unblockUserById,
  unconfirmUserById
} from '@/app/actions'
import { getUserFullName } from '@/lib/utils'
import { ChangeUserPasswordModal } from '@/components/Modals/ChangeUserPassword'
import { useAlertProvider } from '@/providers/AlertProvider'

interface UsersListProps {
  data: ActionGetAllUsers[] | null
  currentUserId: string
  pagination: {
    page: number
    pageSize: number
    pageCount: number
    total: number
  } | null
  onPageChange: (page: number) => void
  isLoading: boolean
  onUserListChange: React.Dispatch<
  React.SetStateAction<ActionGetAllUsers[] | null>
  >
  setPagination: React.Dispatch<React.SetStateAction<any>>
  searchTerm: string
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>
}

type UserWithoutError = Omit<ActionCreateUser, keyof APIError>

function userStatus (user: CustomUser): string {
  if (user.blocked) {
    return 'Blocked'
  } else if (!user.confirmed) {
    return 'Pending'
  }

  return 'Active'
}

function userColor (user: CustomUser): string {
  if (user.blocked) {
    return 'text-rose-600'
  } else if (!user.confirmed) {
    return 'text-yellow-500'
  }

  return 'text-green'
}

export function UsersList ({
  data: userData,
  currentUserId,
  pagination,
  onPageChange,
  isLoading: isDataLoading,
  onUserListChange: setUserData,
  setPagination,
  searchTerm,
  setSearchTerm
}: UsersListProps): React.ReactNode {
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [changePasswordUserId, setChangePasswordUserId] = React.useState(0)
  const [isUserModalOpen, setIsUserModalOpen] = React.useState(false)
  const [currentUserModalId, setCurrentUserModalId] = React.useState<
  number | null
  >(null)
  const { setAlertMessage } = useAlertProvider()

  function handleOpenModal (userId: number): void {
    setIsModalOpen(true)
    setChangePasswordUserId(userId)
  }

  function handleToggleModal (): void {
    setIsModalOpen(!isModalOpen)
  }

  function handleUserModalToggle (value: boolean, id?: number): void {
    setIsUserModalOpen(value)
    if (id !== undefined) setCurrentUserModalId(id)
  }

  function handleUserCreated (newUser: UserWithoutError): void {
    setUserData((prevUserData) => {
      if (prevUserData === null) return null
      const newUserData: CustomUser[] = [...prevUserData, newUser.user]
      return newUserData
    })
  }

  function handleUserUpdated (id: number, updatedUser: CustomUser): void {
    setUserData((prevUserData) => {
      if (prevUserData === null) return null

      const newUserData = prevUserData.map((user) =>
        user.id === id ? updatedUser : user
      )

      return newUserData
    })
  }

  async function handleBlockUser (id: number): Promise<void> {
    await blockUserById(id)

    setAlertMessage('User was blocked successfully.', true)
    setUserData((prevUserData) => {
      if (prevUserData === null) return null

      const newUserData: CustomUser[] = prevUserData.map((user) => {
        if (user.id === id) {
          return { ...user, blocked: true }
        }
        return user
      })

      return newUserData
    })
  }

  async function handleUnlockUser (id: number): Promise<void> {
    await unblockUserById(id)

    setAlertMessage('User was unblocked successfully.', true)
    setUserData((prevUserData) => {
      if (prevUserData === null) return null

      const newUserData: CustomUser[] = prevUserData.map((user) => {
        if (user.id === id) {
          return { ...user, blocked: false }
        }
        return user
      })

      return newUserData
    })
  }

  async function handleDeleteUser (id: number): Promise<void> {
    await deleteUserById(id)
    setAlertMessage('User was deleted successfully.', true)
    const newUserData = userData?.filter((it) => it.id !== id) ?? []
    setUserData(newUserData)
  }

  async function handleConfirmUser (
    id: number,
    name: string,
    email: string
  ): Promise<void> {
    await confirmUserById(id, name, email)

    setAlertMessage('User was confirmed successfully.', true)
    setUserData((prevUserData) => {
      if (prevUserData === null) return null

      const newUserData: CustomUser[] = prevUserData.map((user) => {
        if (user.id === id) {
          return { ...user, confirmed: true }
        }
        return user
      })

      return newUserData
    })
  }

  async function handleUnconfirmUser (
    id: number,
    name: string,
    email: string
  ): Promise<void> {
    await unconfirmUserById(id, name, email)

    setAlertMessage('User was unconfirmed successfully.', true)
    setUserData((prevUserData) => {
      if (prevUserData === null) return null

      const newUserData: CustomUser[] = prevUserData.map((user) => {
        if (user.id === id) {
          return { ...user, confirmed: false }
        }
        return user
      })

      return newUserData
    })
  }

  React.useEffect(() => {
    if (!isUserModalOpen) setCurrentUserModalId(null)
  }, [isUserModalOpen])

  const isLoading = isDataLoading

  return (
    <div className='flex flex-col gap-9'>
      <div className='flex w-full justify-between items-center'>
        <h1 className='text-2xl font-bold'>Users</h1>
        <CreateUserModal
          currentUserModalId={currentUserModalId}
          isModalOpen={isUserModalOpen}
          toggleModal={handleUserModalToggle}
          onUserCreate={handleUserCreated}
          onUserUpdate={handleUserUpdated}
          edit={false}
          allUsers={userData}
        />
      </div>
      <div className='flex mb-2 relative w-full max-w-md'>
        <input
          type='text'
          className='border border-gray-300 rounded px-3 py-2 w-full outline-none focus:ring-2 focus:ring-cyan-500 pr-10'
          placeholder='Search by name or email...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={isLoading}
        />
        {searchTerm !== '' && (
          <button
            type='button'
            className='absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none'
            onClick={() => setSearchTerm('')}
            aria-label='Clear search'
            tabIndex={0}
          >
            <X size={18} />
          </button>
        )}
      </div>
      {isLoading
        ? (
          <div className='text-center text-gray-500 py-8'>Loading...</div>
          )
        : userData != null && userData.length === 0
          ? (
            <div className='text-center text-gray-500 py-8'>
              No user by that name or email.
            </div>
            )
          : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className='w-[140px]'>Name</TableHead>
                    <TableHead className='w-[100px]'>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {userData?.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className='font-medium'>
                        {getUserFullName(item)}
                      </TableCell>
                      <TableCell className='font-medium text-lg'>
                        {item.id === parseInt(currentUserId)
                          ? `${item.email} [Current User]`
                          : item.email}
                      </TableCell>
                      <TableCell className={userColor(item)}>
                        {userStatus(item)}
                      </TableCell>
                      <TableCell className='font-mundialRegular'>
                        {item.role.type === 'authenticated'
                          ? 'Client'
                          : item.role.name === 'Admin'
                            ? 'Admin'
                            : 'Public user'}
                      </TableCell>
                      <TableCell className='flex gap-5'>
                        <Button
                          className='w-fit h-[45px] justify-center gap-1 bg-cyan-500 disabled:opacity-5'
                          onClick={() => handleOpenModal(item.id)}
                          disabled={
                        item.id === parseInt(currentUserId) || item.blocked
                      }
                        >
                          Change Password
                        </Button>
                        <Button
                          variant='destructive'
                          className='w-fit h-[45px] justify-center gap-1 disabled:opacity-5'
                          onClick={() => {
                            void (item.blocked
                              ? handleUnlockUser(item.id)
                              : handleBlockUser(item.id))
                          }}
                          disabled={item.id === parseInt(currentUserId)}
                        >
                          {item.blocked ? 'Unblock' : 'Block'}
                        </Button>
                        <Button
                          variant='destructive'
                          className='w-fit h-[45px] justify-center gap-1 disabled:opacity-5'
                          onClick={() => {
                            void (item.confirmed
                              ? handleUnconfirmUser(
                                item.id,
                                item.firstName,
                                item.email
                              )
                              : handleConfirmUser(
                                item.id,
                                item.firstName,
                                item.email
                              ))
                          }}
                          disabled={item.id === parseInt(currentUserId)}
                        >
                          {item.confirmed ? 'Unconfirm' : 'Confirm'}
                        </Button>
                        <Button
                          variant='secondary'
                          className='w-fit h-[45px] justify-center gap-1 disabled:opacity-5'
                          onClick={() => handleUserModalToggle(true, item.id)}
                          disabled={item.id === parseInt(currentUserId)}
                        >
                          Edit user
                        </Button>
                        <Button
                          variant='destructive'
                          className='w-fit h-[45px] justify-center gap-1 disabled:opacity-5'
                          onClick={() => {
                            const confirmDelete = window.confirm(
                              'Are you sure you want to delete this user?'
                            )
                            if (confirmDelete) {
                              void handleDeleteUser(item.id)
                            }
                          }}
                          style={
                        item.id === parseInt(currentUserId)
                          ? { display: 'none' }
                          : {}
                      }
                        >
                          Delete user
                        </Button>
                      </TableCell>
                      {isModalOpen && (
                        <ChangeUserPasswordModal
                          id={changePasswordUserId}
                          isModalOpen={isModalOpen}
                          toggleModal={handleToggleModal}
                          setMessage={setAlertMessage}
                        />
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {pagination != null && pagination.pageCount > 1 && (
                <div className='flex items-center justify-end space-x-2 py-4'>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => onPageChange(pagination.page - 1)}
                    disabled={pagination.page <= 1}
                  >
                    Previous
                  </Button>
                  <span>
                    Page {pagination.page} of {pagination.pageCount}
                  </span>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => onPageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.pageCount}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
            )}
    </div>
  )
}
