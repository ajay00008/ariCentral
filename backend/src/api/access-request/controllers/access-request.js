'use strict'

const { getApprovedUsers } = require('../../../utils/helper')

/**
 * access-request controller
 */

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController(
  'api::access-request.access-request',
  ({ strapi }) => ({
    async approveRequest (ctx) {
      const { id } = ctx.params

      try {
        const request = await strapi.db
          .query('api::access-request.access-request')
          .findOne({
            where: { id },
            populate: ['Property', 'User']
          })

        if (!request) {
          return ctx.send({ message: 'Access request not found.' }, 404)
        }

        const approvedUsers = getApprovedUsers(request.Property)

        await strapi.db.query('api::access-request.access-request').update({
          where: { id },
          data: { Status: 'approved' }
        })

        await strapi.db.query('api::property.property').update({
          where: { id: request.Property.id },
          data: {
            ApprovedUsers: [...approvedUsers, request.User]
          }
        })

        if (process.env.NODE_ENV === 'production') {
          await strapi.plugins.email.services.email.send({
            to: request.User.email,
            from: process.env.MAILGUN_EMAIL,
            subject: 'Your Access Request has been Approved - walkerwholesale',
            text: `Hi ${request.User.username},\n\nYour access request for the property "${request.Property.Name}" has been approved. You can now view the property details.\n\nThanks,\nThe walkerwholesale Team`,
            html: `<p>Hi ${request.User.username},</p><p>Your access request for the property "<strong>${request.Property.Name}</strong>" has been approved. You can now view the property details.</p><p>Thanks,<br>The walkerwholesale Team</p>`
          })
        }

        return ctx.send(
          { message: 'Access request approved successfully.' },
          200
        )
      } catch (err) {
        strapi.plugin('sentry').service('sentry').sendError(err)
        return ctx.send({ error: 'Failed to approve access request.' }, 500)
      }
    },

    async rejectRequest (ctx) {
      const { id } = ctx.params

      try {
        const request = await strapi.db
          .query('api::access-request.access-request')
          .findOne({
            where: { id },
            populate: ['User', 'Property']
          })

        if (!request) {
          return ctx.send({ message: 'Access request not found.' }, 404)
        }

        await strapi.db.query('api::access-request.access-request').update({
          where: { id },
          data: { Status: 'rejected' }
        })

        if (process.env.NODE_ENV === 'production') {
          await strapi.plugins.email.services.email.send({
            to: request.User.email,
            from: process.env.MAILGUN_EMAIL,
            subject: 'Your Access Request has been Rejected - walkerwholesale',
            text: `Hi ${request.User.username},\n\nUnfortunately, your access request for the property has been rejected at this time.\n\nThanks,\nThe walkerwholesale Team`,
            html: `<p>Hi ${request.User.username},</p><p>Unfortunately, your access request for the property has been rejected at this time.</p><p>Thanks,<br>The walkerwholesale Team</p>`
          })
        }

        return ctx.send(
          { message: 'Access request rejected successfully.' },
          200
        )
      } catch (err) {
        strapi.plugin('sentry').service('sentry').sendError(err)
        return ctx.send({ error: 'Failed to reject access request.' }, 500)
      }
    },
    async revokeRequest (ctx) {
      const { id } = ctx.params

      try {
        const request = await strapi.db
          .query('api::access-request.access-request')
          .findOne({
            where: { id },
            populate: ['Property', 'User']
          })

        if (!request || (request.Status !== 'approved' && request.Status !== 'rejected')) {
          return ctx.send({ message: 'Access request not found or not approved.' }, 404)
        }

        const approvedUsers = getApprovedUsers(request.Property)

        await strapi.db.query('api::access-request.access-request').update({
          where: { id },
          data: { Status: 'pending' }
        })

        await strapi.db.query('api::property.property').update({
          where: { id: request.Property.id },
          data: {
            ApprovedUsers: approvedUsers
          }
        })

        if (process.env.NODE_ENV === 'production') {
          await strapi.plugins.email.services.email.send({
            to: request.User.email,
            from: process.env.MAILGUN_EMAIL,
            subject: 'Your Access has been Revoked - walkerwholesale',
            text: `Hi ${request.User.username},\n\nYour access to the property "${request.Property.Name}" has been revoked and the status has been set to pending.\n\nThanks,\nThe walkerwholesale Team`,
            html: `<p>Hi ${request.User.username},</p><p>Your access to the property "<strong>${request.Property.Name}</strong>" has been revoked and the status has been set to pending.</p><p>Thanks,<br>The walkerwholesale Team</p>`
          })
        }

        return ctx.send(
          { message: 'Access revoked successfully and status set to pending.' },
          200
        )
      } catch (err) {
        strapi.plugin('sentry').service('sentry').sendError(err)
        return ctx.send({ error: 'Failed to revoke access.' }, 500)
      }
    }
  })
)
