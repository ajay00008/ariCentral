export { default } from 'next-auth/middleware'

export const config = {
  matcher: [
    '/account',
    '/admin',
    '/admin/faq',
    '/admin/pages',
    '/admin/pages/:path*',
    '/admin/properties',
    '/admin/properties/:path*',
    '/admin/reporting',
    '/admin/users',
    '/:path*/downloads',
    '/search'
  ]
}
