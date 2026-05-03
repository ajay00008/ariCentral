module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/rate/rates',
      handler: 'rate.updateRates',
      config: {
        auth: false
      }
    }
  ]
}
