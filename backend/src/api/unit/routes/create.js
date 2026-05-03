module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/unit/create',
      handler: 'unit.createUnitAction',
      config: {
        auth: false
      }
    },
    {
      method: 'PUT',
      path: '/unit/update',
      handler: 'unit.updateUnitAction',
      config: {
        auth: false
      }
    },
    {
      method: 'PUT',
      path: '/unit/update-many',
      handler: 'unit.updateManyUnitsAction',
      config: {
        auth: false
      }
    }
  ]
}
