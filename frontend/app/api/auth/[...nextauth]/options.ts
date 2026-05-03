import type { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { fetchAPI } from '@/api/fetch-api'

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: '/login'
  },
  providers: [
    CredentialsProvider({
      credentials: {
        email: {},
        password: {}
      },
      async authorize (credentials) {
        const response = await fetchAPI<APIAdminLoginResult>(`${process.env.PUBLIC_URL}/api/admin/login`, {
          method: 'POST',
          token: undefined,
          fields: { identifier: credentials?.email, password: credentials?.password }
        }, true, false) as APIAdminLoginResult

        if (response.message !== undefined || response.newUser === undefined) {
          return null
        }

        if (response.newUser.jwt !== undefined) {
          return {
            id: response.newUser.user.id.toString(),
            name: response.newUser.user.username,
            email: response.newUser.user.email,
            access_token: response.newUser.jwt,
            confirmed: response.newUser.user.confirmed,
            blocked: response.newUser.user.blocked,
            role: response.newUser.user.role,
            firstName: response.newUser.user.firstName
          }
        }

        return null
      }
    })
  ],
  callbacks: {
    async jwt ({ token, user }) {
      return { ...token, ...user }
    },
    async session ({ session, token }) {
      const accessToken = typeof token.access_token === 'string' ? token.access_token : ''
      const userId = typeof token.id === 'string' ? token.id : ''

      if (accessToken !== '' && userId !== '') {
        const response: Response = await fetchAPI(`/api/users/${userId}?populate=role,avatar`, { token: accessToken }, false, true)
        const user = await response.json()
        token.confirmed = user.confirmed
        token.role = user.role.name
        token.firstName = user.firstName !== '' && user.firstName !== null ? user.firstName : 'Jane'
        token.surname = user.surname !== '' && user.surname !== null ? user.surname : 'Doe'
        token.phone = user.phone !== '' && user.phone !== null ? user.phone : '+61 402 111 222'
        token.companyName = user.companyName !== '' && user.companyName !== null ? user.companyName : 'Jet skis'
        token.email = user.email
        token.showCommission = user.showCommission
        token.country = user.country
        token.stripeCustomerId = user.stripeCustomerId
        token.stripeSetupIntentSuccessful = user.stripeSetupIntentSuccessful
        token.subscriptionStatus = user.subscriptionStatus
        token.subscriptionId = user.subscriptionId
        token.registeredForUpdates = user.registeredForUpdates
        token.avatar = {
          id: user.avatar !== null ? user.avatar.id : null,
          url: user.avatar !== null ? user.avatar.url : '/empty-skeleton.jpg',
          width: user.avatar !== null ? user.avatar.width : 180,
          height: user.avatar !== null ? user.avatar.height : 180
        }
      }

      session.user = token
      return session
    }
  }
}
