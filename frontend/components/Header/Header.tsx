'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { CircleUser, Menu, Package2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

export function Header (): React.ReactNode {
  return (
    <header className='sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6'>
      <nav className='hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6'>
        <Link
          className='flex items-center gap-2 text-lg font-semibold md:text-base'
          href='#'
        >
          <Package2 className='h-6 w-6' />
          <span className='sr-only'>Admin Panel</span>
        </Link>
        <Link
          className='text-muted-foreground transition-colors hover:text-foreground'
          href='/admin/properties'
          prefetch={false}
        >
          Properties
        </Link>
        <Link
          className='text-muted-foreground transition-colors hover:text-foreground'
          href='/admin/users'
          prefetch={false}
        >
          Users
        </Link>
        <Link
          className='text-muted-foreground transition-colors hover:text-foreground'
          href='/admin/pages'
          prefetch={false}
        >
          Pages
        </Link>
        <Link
          className='text-muted-foreground transition-colors hover:text-foreground'
          href='/search'
          prefetch={false}
        >
          Search
        </Link>
        <Link
          className='text-muted-foreground transition-colors hover:text-foreground'
          href='/admin/faq'
          prefetch={false}
        >
          FAQ
        </Link>
        <Link
          className='text-muted-foreground transition-colors hover:text-foreground'
          href='/admin/reporting'
          prefetch={false}
        >
          Reports
        </Link>
        <Link
          className='text-muted-foreground transition-colors hover:text-foreground'
          href='/admin/access-request'
          prefetch={false}
        >
          Access Requests
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant='outline'
            size='icon'
            className='shrink-0 md:hidden'
          >
            <Menu className='h-5 w-5' />
            <span className='sr-only'>Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side='left'>
          <nav className='grid gap-6 text-lg font-medium'>
            <Link
              href='#'
              className='flex items-center gap-2 text-lg font-semibold'
            >
              <Package2 className='h-6 w-6' />
              <span className='sr-only'>Admin Panel</span>
            </Link>
            <Link
              className='text-muted-foreground transition-colors hover:text-foreground'
              href='/admin/properties'
              prefetch={false}
            >
              Properties
            </Link>
            <Link
              className='text-muted-foreground transition-colors hover:text-foreground'
              href='/admin/users'
              prefetch={false}
            >
              Users
            </Link>
            <Link
              className='text-muted-foreground transition-colors hover:text-foreground'
              href='/admin/pages'
              prefetch={false}
            >
              Pages
            </Link>
            <Link
              className='text-muted-foreground transition-colors hover:text-foreground'
              href='/search'
              prefetch={false}
            >
              Search
            </Link>
            <Link
              className='text-muted-foreground transition-colors hover:text-foreground'
              href='/admin/faq'
              prefetch={false}
            >
              FAQ
            </Link>
            <Link
              className='text-muted-foreground transition-colors hover:text-foreground'
              href='/admin/reporting'
              prefetch={false}
            >
              Reports
            </Link>
            <Link
              className='text-muted-foreground transition-colors hover:text-foreground w-full'
              href='/admin/access-request'
              prefetch={false}
            >
              Access Requests
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className='flex justify-end w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='secondary' size='icon' className='rounded-full'>
              <CircleUser className='h-5 w-5' />
              <span className='sr-only'>Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem
              onClick={() => {
                void signOut()
              }}
            >
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
