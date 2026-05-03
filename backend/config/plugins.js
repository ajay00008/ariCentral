module.exports = ({ env }) => ({
  upload: {
    config: {
      sizeLimit: 500 * 1024 * 1024,
      provider: 'aws-s3',
      providerOptions: {
        baseUrl: env('CDN_URL'),
        rootPath: env('CDN_ROOT_PATH'),
        s3Options: {
          credentials: {
            accessKeyId: env('AWS_ACCESS_KEY_ID'),
            secretAccessKey: env('AWS_ACCESS_SECRET')
          },
          region: env('AWS_REGION'),
          params: {
            ACL: env('AWS_ACL', 'public-read'),
            signedUrlExpires: env('AWS_SIGNED_URL_EXPIRES', 15 * 60),
            Bucket: env('AWS_BUCKET')
          }
        }
      }
    }
  },
  email: {
    config: {
      provider: 'mailgun',
      providerOptions: {
        key: env('MAILGUN_API_KEY'),
        domain: env('MAILGUN_DOMAIN'),
        url: 'https://api.mailgun.net'
      },
      settings: {
        defaultFrom: env('MAILGUN_EMAIL'),
        defaultReplyTo: env('MAILGUN_EMAIL'),
        testAddress: env('MAILGUN_EMAIL')
      }
    }
  },
  sentry: {
    enabled: true,
    config: {
      dsn: env('NODE_ENV') === 'production' ? env('SENTRY_DSN') : null,
      sendMetadata: true
    }
  }
})
