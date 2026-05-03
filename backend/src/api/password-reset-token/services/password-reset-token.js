/**
 * password-reset-token service
 */

const { factories } = require('@strapi/strapi')

module.exports = factories.createCoreService('api::password-reset-token.password-reset-token')
