'use strict'

/**
 * unit controller
 */

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::unit.unit', ({ strapi }) => ({
  async createUnitAction (ctx) {
    try {
      const { data } = ctx.request.body
      const { floorId, itemsCount } = data
      const publishedAt = new Date().toISOString()

      const unitPublishedData = {
        identifier: '',
        status: 'AVAILABLE',
        externalSize: 0,
        internalSize: 0,
        beds: '0',
        baths: '0',
        cars: 0,
        powder: 0,
        price: 0,
        rentApp: 0,
        bodyCorp: 0,
        living: 0,
        rates: 0,
        aspect: 'NORTH',
        type: 'TOWNHOUSE',
        propertyImagePositionX: 0,
        propertyImagePositionY: 0,
        order: `${itemsCount + 1}`,
        unitPlan: { data: null },
        unitGallery: { data: null },
        publishedAt
      }

      const createdUnit = await strapi.entityService.create('api::unit.unit', { data: unitPublishedData })

      await strapi.entityService.update('api::floor.floor', floorId, {
        data: {
          units: {
            connect: [{ id: createdUnit.id }]
          }
        }
      })

      const entry = await strapi.entityService.findOne('api::unit.unit', createdUnit.id, {
        fields: [
          'identifier',
          'status',
          'type',
          'aspect',
          'beds',
          'baths',
          'cars',
          'powder',
          'price',
          'bodyCorp',
          'rates',
          'rentApp',
          'living',
          'externalSize',
          'internalSize',
          'propertyImagePositionX',
          'propertyImagePositionY',
          'order'
        ],
        populate: '*'
      })

      const tranformedResponse = {
        id: entry.id,
        attributes: {
          identifier: entry.identifier,
          floor: {
            data: {
              id: entry.floor.id,
              attributes: {
                identifier: entry.floor.identifier
              }
            }
          },
          status: entry.status,
          type: entry.type,
          aspect: entry.aspect,
          beds: entry.beds,
          baths: entry.baths,
          cars: entry.cars,
          powder: entry.powder,
          price: entry.price,
          living: entry.living,
          bodyCorp: entry.bodyCorp,
          rates: entry.rates,
          rentApp: entry.rentApp,
          externalSize: entry.externalSize,
          internalSize: entry.internalSize,
          propertyImagePositionX: entry.propertyImagePositionX,
          propertyImagePositionY: entry.propertyImagePositionY,
          unitPlan: { data: entry.unitGallery },
          unitGallery: { data: entry.unitGallery },
          order: entry.order
        }
      }

      return tranformedResponse
    } catch (err) {
      strapi.plugin('sentry').service('sentry').sendError(err)
      return err
    }
  },
  async updateUnitAction (ctx) {
    try {
      const { data } = ctx.request.body
      const { unitId, update } = data

      await strapi.entityService.update('api::unit.unit', unitId, {
        data: {
          ...update.attributes
        }
      })

      return { status: 200 }
    } catch (err) {
      strapi.plugin('sentry').service('sentry').sendError(err)
      return err
    }
  },
  async updateManyUnitsAction (ctx) {
    try {
      const { data } = ctx.request.body
      const { arrayToUpdate } = data

      for (const unit of arrayToUpdate) {
        await strapi.entityService.update('api::unit.unit', unit.id, {
          data: {
            order: unit.attributes.order
          }
        })
      }

      return { status: 200 }
    } catch (err) {
      strapi.plugin('sentry').service('sentry').sendError(err)
      return err
    }
  }
}))
