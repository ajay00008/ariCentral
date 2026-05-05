import { withAuth } from 'next-auth/middleware'
import { NextResponse, type NextFetchEvent, type NextRequest } from 'next/server'
import { isPublicPropertiesEnabled } from '@/lib/public-properties'

const authMiddleware = withAuth({
  pages: {
    signIn: '/login'
  }
})

function isPublicPropertyPath (pathname: string): boolean {
  return pathname === '/search' || pathname.endsWith('/downloads')
}

export default async function middleware (request: NextRequest, event: NextFetchEvent): Promise<NextResponse | Response | null | undefined> {
  const allowPublicProperties = isPublicPropertiesEnabled()

  if (allowPublicProperties && isPublicPropertyPath(request.nextUrl.pathname)) {
    return NextResponse.next()
  }

  const response = await authMiddleware(request as any, event)
  return response as NextResponse | Response | null | undefined
}

export const config = {
  matcher: [
    '/account',
    '/saved-properties',
    '/admin/:path*',
    '/:path*/downloads',
    '/search'
  ]
}
