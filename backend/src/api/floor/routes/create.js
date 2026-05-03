module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/create',
      handler: 'floor.createAction',
      config: {
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/floor/create-one',
      handler: 'floor.createSingleAction',
      config: {
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/floor/delete-one',
      handler: 'floor.DeleteOneAction',
      config: {
        auth: false
      }
    }
  ]
}
