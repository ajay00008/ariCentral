module.exports = ({ env }) => [
  'strapi::logger',
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': [
            "'self'",
            'data:',
            'blob:',
            env('CDN_URL'),
            env('AWS_BUCKET') + '.s3' + env('AWS_REGION') + '.amazonaws.com'
          ],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            env('CDN_URL'),
            env('AWS_BUCKET') + '.s3' + env('AWS_REGION') + '.amazonaws.com'
          ],
          upgradeInsecureRequests: null
        }
      }
    }
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  {
    name: 'strapi::body',
    config: {
      formLimit: '500mb',
      jsonLimit: '500mb',
      textLimit: '500mb',
      formidable: {
        maxFileSize: 500 * 1024 * 1024
      }
    }
  },
  'strapi::session',
  'strapi::favicon',
  'strapi::public'
]
