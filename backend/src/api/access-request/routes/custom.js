module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/access-requests/:id/approve',
      handler: 'access-request.approveRequest',
      config: {
        policies: ['global::is-admin']
      }
    },
    {
      method: 'POST',
      path: '/access-requests/:id/reject',
      handler: 'access-request.rejectRequest',
      config: {
        policies: ['global::is-admin']
      }
    },
    {
      method: 'POST',
      path: '/access-requests/:id/revoke',
      handler: 'access-request.revokeRequest',
      config: {
        policies: ['global::is-admin']
      }
    }
  ]
}
