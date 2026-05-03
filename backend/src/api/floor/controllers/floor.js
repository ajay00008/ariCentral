'use strict'

/**
 * floor controller
 */

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::floor.floor', ({ strapi }) => ({
  async createAction (ctx) {
    try {
      const { data } = ctx.request.body
      const { propertyId, amountOfFloors, amountOfUnits } = data
      const publishedAt = new Date().toISOString()
      const floorCreateData = []
      const unitCreateData = []

      for (let i = 0; i < amountOfFloors; i++) {
        floorCreateData.push({
          identifier: `${i + 1}`,
          property: propertyId,
          publishedAt
        })

        for (let i = 0; i < amountOfUnits; i++) {
          unitCreateData.push({
            identifier: '',
            status: 'AVAILABLE',
            externalSize: 0,
            internalSize: 0,
            beds: '0',
            baths: '0',
            cars: 0,
            powder: 0,
            price: 0,
            bodyCorp: 0,
            rentApp: 0,
            rates: 0,
            living: 0,
            aspect: 'NORTH',
            type: 'TOWNHOUSE',
            propertyImagePositionX: 0,
            propertyImagePositionY: 0,
            unitPlan: { data: null },
            unitGallery: { data: null },
            order: i,
            publishedAt
          })
        }
      }

      const { ids: floorIds } = await strapi.db.query('api::floor.floor').createMany({
        data: floorCreateData
      })

      const { ids: unitIds } = await strapi.db.query('api::unit.unit').createMany({
        data: unitCreateData
      })

      await strapi.entityService.update('api::property.property', propertyId, {
        data: {
          floors: {
            connect: floorIds
          }
        }
      })

      const unitsFloorLinks = []

      for (let i = 0; i < floorIds.length; i++) {
        const floorId = floorIds[i]

        const newLinks = unitIds.slice(i * amountOfUnits, (i + 1) * amountOfUnits).map((unitId) => {
          return { floor_id: floorId, unit_id: unitId }
        })

        unitsFloorLinks.push(...newLinks)
      }

      await strapi.db.connection.insert(unitsFloorLinks).into('units_floor_links')

      return []
    } catch (err) {
      strapi.plugin('sentry').service('sentry').sendError(err)
      return err
    }
  },
  async createSingleAction (ctx) {
    try {
      const { data } = ctx.request.body
      const { propertyId } = data
      const publishedAt = new Date().toISOString()

      const floorTemplate = {
        identifier: '',
        publishedAt
      }

      const createdFloor = await strapi.entityService.create('api::floor.floor', { data: floorTemplate })

      await strapi.entityService.update('api::property.property', propertyId, {
        data: {
          floors: {
            connect: [{ id: createdFloor.id }]
          }
        }
      })

      const entry = await strapi.entityService.findOne('api::floor.floor', createdFloor.id, {
        fields: ['identifier'],
        populate: { units: true, property: true }
      })

      const tranformedResponse = {
        id: entry.id,
        attributes: {
          identifier: entry.identifier,
          units: entry.units.length !== 0 ? entry.units : { data: [] },
          property: entry.property
        }
      }

      return tranformedResponse
    } catch (err) {
      strapi.plugin('sentry').service('sentry').sendError(err)
      return err
    }
  },
  async DeleteOneAction (ctx) {
    try {
      const { data } = ctx.request.body
      const { floorId } = data

      const entry = await strapi.entityService.findOne('api::floor.floor', floorId, {
        fields: ['identifier'],
        populate: { units: true }
      })

      const unitsArray = entry.units

      for (const unit of unitsArray) {
        await strapi.entityService.delete('api::unit.unit', unit.id)
      }

      await strapi.entityService.delete('api::floor.floor', floorId)

      return { status: 200 }
    } catch (err) {
      strapi.plugin('sentry').service('sentry').sendError(err)
      return err
    }
  }
}))
