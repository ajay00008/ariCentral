'use client'

import * as React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { deleteDynamicPage } from '@/app/actions'
import { format, parseISO } from 'date-fns'
import { ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { CreatePageModal } from '../Modals/CreatePageModal'
import { usePageProvider } from '@/providers/PageProvider'
import { PlusCircledIcon } from '@radix-ui/react-icons'

interface Props {
  data: DynamicPage[] | null
}

export function PagesList ({ data }: Props): React.ReactNode {
  const [pagesData, setPagesData] = React.useState(data)
  const { openModal } = usePageProvider()

  function handlePageCreated (newPage: DynamicPage): void {
    setPagesData((prevPageData) => {
      if (prevPageData === null) return null
      const newPageData = [...prevPageData, newPage]
      return newPageData
    })
  }

  async function handlePageDelete (pageId: number): Promise<void> {
    setPagesData(pagesData?.filter(it => it.id !== pageId) ?? [])
    await deleteDynamicPage(pageId)
  }

  function handleProcessDataFormat (data: string): string {
    const date = parseISO(data)
    return format(date, 'MMMM dd, yyyy')
  }

  React.useEffect(() => {
    if (data !== null) {
      setPagesData(data)
    }
  }, [data])

  return (
    <div className='flex flex-col gap-9'>
      <div className='flex w-full justify-between'>
        <h1 className='text-2xl font-bold'>Pages</h1>
        <Button
          size='sm'
          className='w-fit ml-auto mr-[50px] h-[50px] gap-1 bg-zinc-400'
          onClick={() => openModal()}
        >
          <PlusCircledIcon className='h-3.5 w-3.5' />
          <span className='sr-only sm:not-sr-only sm:whitespace-nowrap'>
            Create Page
          </span>
        </Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[200px]'>Slug</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pagesData?.map((item) => (
            <TableRow key={item.id}>
              <TableCell className='font-medium text-lg'>
                {item.attributes.Slug}
              </TableCell>
              <TableCell>
                {item.attributes.Name}
              </TableCell>
              <TableCell>
                {handleProcessDataFormat(item.attributes.Date.toString())}
              </TableCell>
              <TableCell className='flex gap-5'>
                <Button asChild size='sm' className='w-fit h-[45px] justify-center gap-1 bg-cyan-500 disabled:opacity-5'>
                  <Link href={`/admin/pages/${item.attributes.Slug}`} prefetch={false}>Edit Page</Link>
                </Button>
                <Button
                  variant='destructive'
                  className='w-fit h-[45px] justify-center gap-1 disabled:opacity-5'
                  onClick={() => {
                    const confirmDelete = window.confirm('Are you sure you want to delete this page?')
                    if (confirmDelete) {
                      void handlePageDelete(item.id)
                    }
                  }}
                >
                  Delete Page
                </Button>
                <Button
                  size='sm'
                  className='w-fit h-[45px] bg-zinc-400'
                >
                  <Link
                    href={`/${item.attributes.Slug}`}
                    className='flex p-[10px] flex-row-reverse items-center gap-1'
                    prefetch={false}
                    rel='noopener noreferrer'
                    target='_blank'
                  >
                    <ExternalLink className='h-3.5 w-3.5 flex flex-shrink-0' />
                    <p>Open Page</p>
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CreatePageModal onPageCreate={handlePageCreated} />
    </div>
  )
}
