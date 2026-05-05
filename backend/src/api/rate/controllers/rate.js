'use strict'

/**
 * rate controller
 */

const { createCoreController } = require('@strapi/strapi').factories

module.exports = createCoreController('api::rate.rate', ({ strapi }) => ({
  async current (ctx) {
    try {
      const rate = await strapi.db.query('api::rate.rate').findOne({
        where: { AUD: 1 }
      })

      if (!rate) {
        return ctx.send({
          AUD: 1,
          EUR: 1,
          USD: 1,
          SGD: 1,
          GBP: 1,
          CAD: 1,
          BTC: 1,
          NZD: 1,
          BaseCurrency: 'AUD'
        })
      }

      return ctx.send({
        AUD: rate.AUD,
        EUR: rate.EUR,
        USD: rate.USD,
        SGD: rate.SGD,
        GBP: rate.GBP,
        CAD: rate.CAD,
        BTC: rate.BTC,
        NZD: rate.NZD,
        BaseCurrency: rate.BaseCurrency
      })
    } catch (err) {
      strapi.plugin('sentry').service('sentry').sendError(err)
      return ctx.internalServerError('Unable to load currency rates')
    }
  },

  async updateRates () {
    try {
      const currencies = await fetch(`http://data.fixer.io/api/latest?access_key=${process.env.FIXER_IO_API_KEY}&base=AUD&symbols=USD,SGD,GBP,CAD,NZD,BTC,EUR`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const currenciesData = await currencies.json()

      await strapi.db.query('api::rate.rate').update({
        where: { AUD: 1 },
        data: {
          AUD: 1,
          USD: currenciesData.rates.USD,
          EUR: currenciesData.rates.EUR,
          GBP: currenciesData.rates.GBP,
          SGD: currenciesData.rates.SGD,
          CAD: currenciesData.rates.CAD,
          NZD: currenciesData.rates.NZD,
          BTC: currenciesData.rates.BTC
        }
      })

      return { status: 200 }
    } catch (err) {
      strapi.plugin('sentry').service('sentry').sendError(err)
      return { err, status: 400 }
    }
  }
}))
