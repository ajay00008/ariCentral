'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { LoaderSpinner } from '@/components/Spinners/LoaderSpinner'
import { useAlertProvider } from '@/providers/AlertProvider'
import * as Sentry from '@sentry/nextjs'
import { getAccessRequests, handleAccessRequestAction } from '@/app/actions'
import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState
} from '@tanstack/react-table'
import { ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

interface TableData {
  id: number
  propertyName: string
  email: string
  status: 'pending' | 'approved' | 'rejected'
}

export function AccessRequestMain (): React.ReactNode {
  const [tableData, setTableData] = React.useState<TableData[] | null>(null)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)
  const { setAlertMessage } = useAlertProvider()
  const [meta, setMeta] = React.useState<Meta | null>(null)
  const [currentPage, setCurrentPage] = React.useState<number>(1)
  const [pageSize, setPageSize] = React.useState<number>(10)

  async function fetchRequests (page: number, size: number): Promise<void> {
    setLoading(true)
    try {
      const res = await getAccessRequests(String(page), String(size))
      const data = res?.data ?? []
      setMeta(res?.meta ?? null)
      if (data === null || data.length === 0) {
        setTableData([])
        return
      }
      const transformed = data.map((req: AccessRequest) => ({
        id: req.id,
        propertyName: req.attributes.Property?.data?.attributes?.Name ?? '',
        email: req.attributes.User?.data?.attributes?.email ?? '',
        status: req.attributes.Status ?? 'pending'
      }))
      setTableData(transformed)
    } catch (err) {
      setAlertMessage('Failed to fetch access requests.', false)
      setError(err instanceof Error ? err.message : 'An error occurred')
      Sentry.captureException(err)
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    void fetchRequests(currentPage, pageSize)
  }, [currentPage, pageSize])

  const handleRequest = (
    id: number,
    action: 'approve' | 'reject' | 'revoke'
  ): void => {
    handleAction(id, action).catch((e) => {
      setAlertMessage(`Failed to ${action} request.`, false)
      Sentry.captureException(e)
    })
  }

  const handleAction = async (
    id: number,
    action: 'approve' | 'reject' | 'revoke'
  ): Promise<void> => {
    try {
      const res = await handleAccessRequestAction(id, action)
      if (!res.success) {
        setAlertMessage(res.message, false)
        return
      }
      setTableData((prev) => {
        if (prev == null) return null
        return prev.map((request) =>
          request.id === id
            ? {
                ...request,
                status:
                  action === 'approve'
                    ? 'approved'
                    : action === 'reject'
                      ? 'rejected'
                      : 'pending'
              }
            : request
        )
      })
      setAlertMessage(`Request ${action}d successfully.`, true)
    } catch (err) {
      setAlertMessage(`Failed to ${action} request.`, false)
      Sentry.captureException(err)
    }
  }

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])

  const columns: Array<ColumnDef<TableData>> = [
    {
      accessorKey: 'propertyName',
      header: 'Property Name',
      cell: ({ row }) => row.original.propertyName,
      enableHiding: false
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => row.original.email,
      enableHiding: false
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => row.original.status,
      enableHiding: false
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        return (
          <>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleRequest(row.original.id, 'approve')}
              disabled={row.original.status !== 'pending'}
            >
              Approve
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleRequest(row.original.id, 'reject')}
              disabled={row.original.status !== 'pending'}
              className='ml-2'
            >
              Reject
            </Button>
            <Button
              variant='outline'
              size='sm'
              onClick={() => handleRequest(row.original.id, 'revoke')}
              disabled={
                row.original.status !== 'approved' &&
                row.original.status !== 'rejected'
              }
              className='ml-2'
            >
              Revoke
            </Button>
          </>
        )
      },
      enableHiding: false
    }
  ]

  const table = useReactTable({
    data: tableData ?? [],
    columns,
    state: {
      columnVisibility,
      rowSelection,
      columnFilters
    },
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection
  })

  const canPrev = React.useMemo(() => {
    const page = meta?.pagination?.page ?? 1
    return page > 1
  }, [meta])

  const canNext = React.useMemo(() => {
    const page = meta?.pagination?.page ?? 1
    const pageCount = meta?.pagination?.pageCount ?? 1
    return page < pageCount
  }, [meta])

  const handlePageSizeChange = (size: number): void => {
    if (pageSize === size) return
    setPageSize(size)
    setCurrentPage(1)
  }

  const handleNextPage = (): void => {
    setCurrentPage((p) => {
      const total = meta?.pagination?.pageCount
      return typeof total === 'number' ? Math.min(total, p + 1) : p + 1
    })
  }

  return (
    <div className='px-10 mx-auto p-6'>
      <h1 className='text-2xl font-semibold mb-4'>Access Requests</h1>
      {loading && (
        <div className='flex justify-center items-center h-screen'>
          <LoaderSpinner width={30} height={30} />
        </div>
      )}
      {error !== null && <h1>Error while fetching the data. Please reload.</h1>}

      {!loading && error === null && tableData !== null && (
        <div className='w-full'>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length > 0
                  ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow
                          key={row.id}
                          data-state={row.getIsSelected() && 'selected'}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    )
                  : (
                    <TableRow>
                      <TableCell
                        colSpan={columns.length}
                        className='h-24 text-center'
                      >
                        No results.
                      </TableCell>
                    </TableRow>
                    )}
              </TableBody>
            </Table>
          </div>
          <div className='flex items-center justify-between space-x-2 py-4'>
            <div className='flex items-center space-x-3'>
              <div className='flex items-center space-x-2'>
                <span className='text-sm'>Rows per page:</span>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='outline' size='sm'>
                      {pageSize}
                      <ChevronDown className='ml-2 h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    {[5, 10, 20, 50].map((size) => (
                      <DropdownMenuCheckboxItem
                        key={size}
                        checked={pageSize === size}
                        onCheckedChange={() => handlePageSizeChange(size)}
                      >
                        {size}
                      </DropdownMenuCheckboxItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className='flex items-center space-x-2 text-sm text-muted-foreground'>
                <span>
                  Page {meta?.pagination?.page ?? 1} of {meta?.pagination?.pageCount ?? 1}
                </span>
                <span className='ml-2'>
                  Total: {meta?.pagination?.total ?? 0}
                </span>
              </div>
            </div>
            <div className='space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={!canPrev}
              >
                Previous
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={handleNextPage}
                disabled={!canNext}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
