/* global strapi */

'use strict'

const { sanitize } = require('@strapi/utils')

module.exports = (plugin) => {
  plugin.controllers.user.find = async (ctx) => {
    const { page = 1, pageSize = 50 } = ctx.query.pagination || {}
    const { results, pagination } = await strapi.entityService.findPage(
      'plugin::users-permissions.user',
      { ...ctx.query, page: Number(page), pageSize: Number(pageSize) }
    )

    const userModel = strapi.getModel('plugin::users-permissions.user')
    const sanitizedResults = await sanitize.contentAPI.output(results, userModel, { auth: ctx.state.auth })

    return { data: sanitizedResults, meta: { pagination } }
  }
  return plugin
}
