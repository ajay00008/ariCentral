module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/rate/rates',
      handler: 'rate.updateRates',
      config: {
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/rate/current',
      handler: 'rate.current',
      config: {
        auth: false
      }
    }
  ]
}
