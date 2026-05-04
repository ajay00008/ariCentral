'use strict'

require('dotenv').config()
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const EventType = require('../../../constants/eventType')
const { formatUSAddress } = require('../../../utils/helper')

/**
 * property controller
 */

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController(
  'api::property.property',
  ({ strapi }) => ({
    async find (ctx) {
      const user = ctx.state.user

      const response = await super.find(ctx)
      const properties = response.data

      const findLowerPricedUnit = (floors) => {
        return floors?.data.reduce((lowestUnit, floor) => {
          const floorUnits = floor.attributes?.units?.data || []
          const floorLowestUnit = floorUnits.reduce((lowest, unit) => {
            return !lowest || unit.attributes.price < lowest.attributes.price
              ? unit
              : lowest
          }, null)

          return !lowestUnit || (floorLowestUnit && floorLowestUnit.attributes.price < lowestUnit.attributes.price)
            ? floorLowestUnit
            : lowestUnit
        }, null)
      }

      const filtered = properties.map((property) => {
        const attrs = property.attributes
        const lowerPricedUnit = findLowerPricedUnit(attrs.floors)
        const isApproved = attrs.ApprovedUsers?.data.some((u) => u.id === user.id)
        const request = attrs.AccessRequests?.data.find((r) => r.attributes?.User?.data.id === user.id)

        delete attrs.AccessRequests
        delete attrs.ApprovedUsers

        const computedAddress = formatUSAddress(attrs)

        const baseAttributes = {
          Name: attrs.Name,
          StageOfBuild: attrs.StageOfBuild,
          Address: computedAddress,
          Slug: attrs.Slug,
          Commission: attrs.Commission,
          Approved: isApproved,
          RequestStatus: request?.attributes?.Status || 'not_requested',
          LowerPricedUnit: lowerPricedUnit
            ? {
                id: lowerPricedUnit.id,
                attributes: {
                  price: lowerPricedUnit.attributes.price
                }
              }
            : null,
          HeroImage: attrs.HeroImage,
          HeroImages: attrs.HeroImages
        }

        if (isApproved || request?.attributes?.Status === 'approved' || user.role.name === 'Admin') {
          return {
            ...property,
            attributes: {
              ...attrs,
              Address: computedAddress,
              Approved: true,
              RequestStatus: 'approved',
              LowerPricedUnit: lowerPricedUnit
                ? {
                    id: lowerPricedUnit.id,
                    attributes: {
                      price: lowerPricedUnit.attributes.price
                    }
                  }
                : null
            }
          }
        }

        return {
          id: property.id,
          attributes: baseAttributes
        }
      })

      return {
        data: filtered,
        meta: response.meta
      }
    },
    async requestAccess (ctx) {
      try {
        const { slug } = ctx.params
        const user = ctx.state.user

        const property = await strapi.db
          .query('api::property.property')
          .findOne({
            where: { Slug: slug }
          })

        if (!property) {
          return ctx.notFound('Property not found')
        }

        const existingRequest = await strapi.db
          .query('api::access-request.access-request')
          .findOne({
            where: {
              User: user.id,
              Property: property.id
            }
          })
        if (existingRequest) {
          return ctx.send({ message: 'Access request already exists', success: true }, 200)
        }

        await strapi.db.query('api::access-request.access-request').create({
          data: {
            User: user.id,
            Property: property.id
          }
        })

        if (process.env.NODE_ENV === 'production') {
          await strapi.plugins.email.services.email.send({
            to: 'concierge@walkerwholesale.com',
            from: process.env.MAILGUN_EMAIL,
            subject: 'Property Access Request - walkerwholesale',
            text: `Hey ${user.email}, has requested access to the property: ${property.Name}. Please review and approve or deny the request.`,
            html: `<p>Hey ${user.email}, has requested access to the property: ${property.Name}. Please review and approve or deny the request.</p>`
          })
        }

        return ctx.send({ message: 'Access request sent successfully', success: true }, 200)
      } catch (err) {
        strapi.plugin('sentry').service('sentry').sendError(err)
        return ctx.send({ message: 'Failed to process access request', error: err.message, success: false }, 500)
      }
    },
    async deleteManyAction (ctx) {
      try {
        const { data } = ctx.request.body
        const { idArray } = data
        const ids = idArray.map((id) => parseInt(id))
        for (const id of ids) {
          const imageEntry = await strapi.db
            .query('plugin::upload.file')
            .delete({
              where: { id }
            })
          await strapi.plugins.upload.services.upload.remove(imageEntry)
        }
        return { status: 200 }
      } catch (err) {
        strapi.plugin('sentry').service('sentry').sendError(err)
        return err
      }
    },
    async sendResetLink (ctx) {
      try {
        const { email } = ctx.request.body

        function generateToken (length) {
          const characters =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
          let token = ''
          for (let i = 0; i < length; i++) {
            token += characters.charAt(
              Math.floor(Math.random() * characters.length)
            )
          }
          return token
        }

        const user = await strapi.db
          .query('plugin::users-permissions.user')
          .findOne({ where: { email } })
        if (!user) {
          return ctx.send({ message: 'User not found' }, 404)
        } else if (user.blocked) {
          return ctx.send(
            {
              message:
                'User is blocked in the system, you can`t change his password'
            },
            400
          )
        }

        const token = generateToken(40)
        const expiresAt = new Date()
        expiresAt.setHours(expiresAt.getHours() + 24)
        const publishedAt = new Date().toISOString()

        await strapi.entityService.create(
          'api::password-reset-token.password-reset-token',
          {
            data: {
              token,
              expiresAt,
              publishedAt,
              email
            }
          }
        )

        const resetLink = `${process.env.PUBLIC_FRONTEND_URL}/reset-password?token=${token}`
        try {
          const sendedEmail = await strapi.plugins.email.services.email.send({
            to: email,
            from: process.env.MAILGUN_EMAIL,
            subject: 'Password reset',
            text: `Please use the following link to reset your password: ${resetLink}`,
            html: `<p>Please use the following link to reset your password: <a href="${resetLink}">${resetLink}</a></p>`
          })

          return ctx.send(
            { email: sendedEmail, message: 'Password reset link was sent' },
            200
          )
        } catch (emailError) {
          strapi.plugin('sentry').service('sentry').sendError(emailError)
          return ctx.send({ message: 'Failed to send reset email' }, 500)
        }
      } catch (err) {
        strapi.plugin('sentry').service('sentry').sendError(err)
      }
    },
    async resetPassword (ctx) {
      try {
        const { resToken, password } = ctx.request.body

        async function hashPassword (password) {
          const saltRounds = 10
          const hashedPassword = await bcrypt.hash(password, saltRounds)
          return hashedPassword
        }

        const foundedLink = await strapi.db
          .query('api::password-reset-token.password-reset-token')
          .findOne({ where: { token: resToken } })
        if (!foundedLink) {
          return ctx.send({ message: 'Link not found' }, 404)
        }
        const tokenId = foundedLink.id
        const userEmail = foundedLink.email
        const hashedPassword = await hashPassword(password)

        const foundedUser = await strapi.db
          .query('plugin::users-permissions.user')
          .findOne({ where: { email: userEmail } })
        if (!foundedUser) {
          return ctx.send({ message: 'User not found' }, 404)
        } else if (foundedUser.blocked) {
          return ctx.send(
            { message: 'User is blocked. You can`t change password' },
            400
          )
        }

        await strapi.entityService.delete(
          'api::password-reset-token.password-reset-token',
          tokenId
        )

        await strapi.db.query('plugin::users-permissions.user').update({
          where: { id: foundedUser.id },
          data: {
            password: hashedPassword
          }
        })

        return ctx.send({ message: 'Password is changed successfully' }, 200)
      } catch (err) {
        strapi.plugin('sentry').service('sentry').sendError(err)
      }
    },
    async checkToken (ctx) {
      try {
        const { resToken } = ctx.request.body

        const foundedLink = await strapi.db
          .query('api::password-reset-token.password-reset-token')
          .findOne({ where: { token: resToken } })
        if (!foundedLink) {
          return ctx.send({ message: 'Link not found', code: 3 }, 404)
        }
        const currentTime = new Date()
        const tokenExpirationTime = new Date(foundedLink.expiresAt)

        if (currentTime > tokenExpirationTime) {
          return ctx.send({ message: 'Token has expired', code: 2 }, 400)
        }

        return ctx.send({ message: 'Token is valid', code: 1 }, 200)
      } catch (err) {
        strapi.plugin('sentry').service('sentry').sendError(err)
      }
    },
    async controlTokens (ctx) {
      try {
        const foundedLinks = await strapi.db
          .query('api::password-reset-token.password-reset-token')
          .findMany({
            select: ['id', 'email', 'token', 'expiresAt']
          })

        const currentTime = new Date()
        let expiredTokensCount = 0

        for (const link of foundedLinks) {
          const tokenExpirationTime = new Date(link.expiresAt)

          if (currentTime > tokenExpirationTime) {
            await strapi.db
              .query('api::password-reset-token.password-reset-token')
              .delete({
                where: { id: link.id }
              })
            expiredTokensCount++
          }
        }

        return ctx.send(
          {
            message: `${expiredTokensCount} expired tokens have been deleted`,
            code: 1
          },
          200
        )
      } catch (err) {
        strapi.plugin('sentry').service('sentry').sendError(err)
      }
    },
    async lastProperty (ctx) {
      try {
        const allProperties = await strapi.entityService.findMany(
          'api::property.property',
          {
            fields: ['name', 'createdAt'],
            populate: ['HeroImage', 'HeroImages', 'HeroImages.Image']
          }
        )
        if (allProperties.length === 0) {
          return ctx.send(
            {
              message: 'There no property currently in DB. Please, try later.'
            },
            400
          )
        }

        allProperties.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
        const lastProperty = allProperties[0]

        return ctx.send(lastProperty, 200)
      } catch (err) {
        strapi.plugin('sentry').service('sentry').sendError(err)
      }
    },
    async checkEmailExist (ctx) {
      try {
        const { email } = ctx.request.body

        const user = await strapi.db
          .query('plugin::users-permissions.user')
          .findOne({ where: { email } })
        if (!user) {
          return ctx.send(
            { email: false, message: 'Email is not found in DB' },
            200
          )
        }

        return ctx.send(
          { email: true, message: 'Email already registered in DB' },
          200
        )
      } catch (err) {
        strapi.plugin('sentry').service('sentry').sendError(err)
        return ctx.send({ message: 'Failed to start email check.' }, 500)
      }
    },
    async sendRegistrationPendingEmail (ctx) {
      try {
        const { userName, email } = ctx.request.body

        try {
          const sendedEmail = await strapi.plugins.email.services.email.send({
            to: email,
            from: process.env.MAILGUN_EMAIL,
            subject: 'Account registration pending - walkerwholesale',
            text: `Hey ${userName}, your registration to walkerwholesale is pending we will reach out once your account is activated.`,
            html: `<p>Hey ${userName}, your registration to walkerwholesale is pending we will reach out once your account is activated.</p>`
          })

          return ctx.send(
            { email: sendedEmail, message: 'Pending email was sent' },
            200
          )
        } catch (emailError) {
          strapi.plugin('sentry').service('sentry').sendError(emailError)
          return ctx.send({ message: 'Failed to send pending email' }, 500)
        }
      } catch (err) {
        strapi.plugin('sentry').service('sentry').sendError(err)
      }
    },
    async sendConfirmationStateEmail (ctx) {
      try {
        const { userName, email, confirmed } = ctx.request.body
        const sendText =
          confirmed === true
            ? `Hey ${userName}, you may now login to the walkerwholesale platform.`
            : `Hey ${userName}, your account was frozen by administrator, you cant login to the walkerwholesale platform for now.`
        const sendHtml =
          confirmed === true
            ? `<p>Hey ${userName}, you may now login to the walkerwholesale platform.</p>`
            : `<p>Hey ${userName}, your account was frozen by administrator, you cant login to the walkerwholesale platform for now.</p>`

        try {
          const sendedEmail = await strapi.plugins.email.services.email.send({
            to: email,
            from: process.env.MAILGUN_EMAIL,
            subject: 'Account Confirmation - walkerwholesale',
            text: sendText,
            html: sendHtml
          })

          return ctx.send(
            {
              email: sendedEmail,
              message: 'Account confirmation email was sent'
            },
            200
          )
        } catch (emailError) {
          strapi.plugin('sentry').service('sentry').sendError(emailError)
          return ctx.send(
            { message: 'Failed to send confirmation email' },
            500
          )
        }
      } catch (err) {
        strapi.plugin('sentry').service('sentry').sendError(err)
      }
    },
    async trackEvent (ctx) {
      const { id, eventType } = ctx.params
      const eventField = EventType[eventType]

      if (!eventField) {
        return ctx.send({ message: 'Invalid event type' }, 400)
      }

      try {
        const property = await strapi.db
          .query('api::property.property')
          .findOne({ where: { Slug: id } })

        if (!property) {
          return ctx.send({ message: 'Property not found' }, 404)
        }

        const updatedData = {}
        updatedData[eventField] =
          Number.parseInt(property[eventField] ?? '0', 10) + 1

        await strapi.db.query('api::property.property').update({
          where: { Slug: id },
          data: updatedData
        })

        return ctx.send({
          message: `${eventType} count incremented successfully.`
        })
      } catch (err) {
        strapi.plugin('sentry').service('sentry').sendError(err)
        return ctx.send(
          { error: 'An error occurred while processing the event.' },
          500
        )
      }
    },
    async generateShareToken (ctx) {
      const { id } = ctx.params

      try {
        const property = await strapi.db
          .query('api::property.property')
          .findOne({
            where: { Slug: id }
          })

        if (!property) {
          return ctx.send({ message: 'Property not found' }, 404)
        }

        if (property.shareToken) {
          return ctx.send({
            shareToken: property.shareToken
          })
        }

        const newToken = uuidv4()

        await strapi.db.query('api::property.property').update({
          where: { Slug: id },
          data: { shareToken: newToken }
        })

        return ctx.send({
          shareToken: newToken
        })
      } catch (err) {
        strapi.plugin('sentry').service('sentry').sendError(err)
        return ctx.send(
          { error: 'An error occurred while processing the request.' },
          500
        )
      }
    },
    async findByShareToken (ctx) {
      const { shareToken } = ctx.params

      try {
        const property = await strapi.entityService.findMany(
          'api::property.property',
          {
            filters: {
              shareToken
            },
            populate: 'deep',
            limit: 1
          }
        )

        if (property.length === 0) {
          return ctx.send({ message: 'Property not found' }, 404)
        }

        return ctx.send(property)
      } catch (err) {
        strapi.plugin('sentry').service('sentry').sendError(err)
        return ctx.send(
          { error: 'An error occurred while processing the request.' },
          500
        )
      }
    }
  })
)
