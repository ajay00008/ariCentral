'use strict'

/**
 * property router
 */

const { createCoreRouter } = require('@strapi/strapi').factories
const allowPublicProperties = process.env.ALLOW_PUBLIC_PROPERTIES === 'true'

const routerConfig = allowPublicProperties
  ? {
      config: {
        create: {
          policies: ['global::is-admin']
        },
        update: {
          policies: ['global::is-admin']
        },
        delete: {
          policies: ['global::is-admin']
        }
      }
    }
  : undefined

module.exports = createCoreRouter('api::property.property', routerConfig)
