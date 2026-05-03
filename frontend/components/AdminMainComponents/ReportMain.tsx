'use client'

import * as React from 'react'
import Link from 'next/link'
import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'
import { ChevronDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { getAllProperties } from '@/app/actions'
import { LoaderSpinner } from '@/components/Spinners/LoaderSpinner'
import { useAlertProvider } from '@/providers/AlertProvider'
import * as Sentry from '@sentry/nextjs'

interface PropertyStatus {
  id: number
  slug: string
  name: string
  views: number | null
  offers: number | null
  downloads: number | null
}

const transformData = (data: FullProperty[]): PropertyStatus[] => {
  return data.map((item, index) => ({
    id: item.id,
    slug: item.attributes.Slug,
    name: item.attributes.Name,
    views: item.attributes.PageView,
    offers: item.attributes.MakeOfferButtonClicks,
    downloads: item.attributes.DownloadButtonClicks,
    srNo: index + 1
  }))
}

export const columns: Array<ColumnDef<PropertyStatus>> = [
  {
    accessorKey: 'srNo',
    header: 'Sr. No',
    cell: ({ row }) => row.index + 1,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: 'Property Name',
    cell: ({ row }) => (
      <Link
        className='text-blue-500 hover:underline'
        href={`/${row.original.slug}`}
        prefetch={false}
        rel='noopener noreferrer'
        target='_blank'
      >
        {row.getValue('name')}
      </Link>
    ),
    enableHiding: false
  },
  {
    accessorKey: 'views',
    header: 'Page Views',
    cell: ({ row }) => {
      const views = row.getValue('views')
      return views !== null ? views : 0
    }
  },
  {
    accessorKey: 'offers',
    header: 'Make an Offer Clicks',
    cell: ({ row }) => {
      const offers = row.getValue('offers')
      return offers !== null ? offers : 0
    }
  },
  {
    accessorKey: 'downloads',
    header: 'Download Clicks',
    cell: ({ row }) => {
      const downloads = row.getValue('downloads')
      return downloads !== null ? downloads : 0
    }
  }
]

export function ReportMain (): React.ReactNode {
  const [propertyData, setPropertyData] = React.useState<PropertyStatus[] | null>(null)
  const [loading, setLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 100
  })
  const { setAlertMessage } = useAlertProvider()

  React.useEffect(() => {
    async function fetchData (): Promise<void> {
      setLoading(true)
      try {
        const res = await getAllProperties(1, pagination.pageSize)
        const transformedData = transformData(res ?? [])
        setPropertyData(transformedData)
      } catch (err) {
        setAlertMessage('There was an error fetching the data', false)
        setError(err instanceof Error ? err.message : 'An error occurred')
        Sentry.captureException(err)
      } finally {
        setLoading(false)
      }
    }
    void fetchData()
  }, [])

  const table = useReactTable({
    data: propertyData ?? [],
    columns,
    state: {
      columnVisibility,
      rowSelection,
      pagination
    },
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection
  })

  const handlePageSizeChange = (newSize: number): void => {
    setPagination((prev) => ({
      ...prev,
      pageIndex: 0,
      pageSize: newSize
    }))
  }

  return (
    <div className='px-10 mx-auto p-6'>
      <h1 className='text-2xl font-semibold mb-4'>📊 Property Reporting</h1>
      {loading && (
        <div className='flex justify-center items-center h-screen'>
          <LoaderSpinner width={30} height={30} />
        </div>
      )}
      {error !== null && <h1>Error while fetching the data. Please reload.</h1>}

      {!loading && error === null && (
        <div className='w-full'>
          <div className='flex items-center py-4'>
            <Input
              placeholder='Filter properties...'
              value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
              onChange={(event) => table.getColumn('name')?.setFilterValue(event.target.value)}
              className='max-w-sm'
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='outline' className='ml-auto'>
                  Columns
                  <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.columnDef.header as string}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className='rounded-md border'>
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.length > 0
                  ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    )
                  : (
                    <TableRow>
                      <TableCell colSpan={columns.length} className='h-24 text-center'>
                        No results.
                      </TableCell>
                    </TableRow>
                    )}
              </TableBody>
            </Table>
          </div>
          <div className='flex items-center justify-between space-x-2 py-4'>
            <div className='flex items-center space-x-2'>
              <span className='text-sm'>Rows per page:</span>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='outline' size='sm'>
                    {pagination.pageSize}
                    <ChevronDown className='ml-2 h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  {[5, 10, 20, 50].map((size) => (
                    <DropdownMenuCheckboxItem
                      key={size}
                      checked={pagination.pageSize === size}
                      onCheckedChange={() => handlePageSizeChange(size)}
                    >
                      {size}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className='space-x-2'>
              <Button
                variant='outline'
                size='sm'
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant='outline'
                size='sm'
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
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
