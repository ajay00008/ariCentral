const { withSentryConfig } = require('@sentry/nextjs')

const isProd = process.env.NODE_ENV === 'production'
const allowPublicProperties = process.env.ALLOW_PUBLIC_PROPERTIES === 'true' ||
  process.env.NEXT_PUBLIC_ALLOW_PUBLIC_PROPERTIES === 'true'

const remotePatterns = [
  {
    protocol: 'https',
    hostname: 'd27wb9d3wdpfey.cloudfront.net',
    port: ''
  },
  {
    protocol: 'https',
    hostname: `**.${process.env.ROOT_DOMAIN}`,
    port: ''
  }
]

if (!isProd) {
  remotePatterns.push({
    hostname: 'localhost'
  })
}

const config = {
  webpack (config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    })

    return config
  },
  images: {
    remotePatterns
  },
  assetPrefix: isProd ? process.env.PUBLIC_URL : undefined,
  redirects () {
    if (allowPublicProperties) return []

    return [
      {
        source: '/',
        destination: '/login',
        permanent: true
      }
    ]
  }
}

module.exports = withSentryConfig(
  config,
  {
    org: process.env.SENTRY_ORG,
    project: process.env.SENTRY_PROJECT,
    silent: !process.env.CI,
    sourcemaps: {
      deleteSourcemapsAfterUpload: true
    },
    widenClientFileUpload: true,
    tunnelRoute: '/monitoring',
    hideSourceMaps: true,
    disableLogger: true
  }
)
