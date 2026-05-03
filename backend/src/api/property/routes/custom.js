module.exports = {
  routes: [
    {
      method: 'POST',
      path: '/delete-many',
      handler: 'property.deleteManyAction',
      config: {
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/reset-link',
      handler: 'property.sendResetLink',
      config: {
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/reset-password',
      handler: 'property.resetPassword',
      config: {
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/check-token',
      handler: 'property.checkToken',
      config: {
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/control-tokens',
      handler: 'property.controlTokens',
      config: {
        auth: false
      }
    },
    {
      method: 'GET',
      path: '/last-property',
      handler: 'property.lastProperty',
      config: {
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/email-exist',
      handler: 'property.checkEmailExist',
      config: {
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/send-pending',
      handler: 'property.sendRegistrationPendingEmail',
      config: {
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/send-confirmation',
      handler: 'property.sendConfirmationStateEmail',
      config: {
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/property/:id/track/:eventType',
      handler: 'property.trackEvent',
      config: {
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/property/:id/share',
      handler: 'property.generateShareToken',
      config: {
        policies: ['global::is-admin']
      }
    },
    {
      method: 'GET',
      path: '/property/share/:shareToken',
      handler: 'property.findByShareToken',
      config: {
        auth: false
      }
    },
    {
      method: 'POST',
      path: '/property/:slug/request-access',
      handler: 'property.requestAccess'
    }
  ]
}
