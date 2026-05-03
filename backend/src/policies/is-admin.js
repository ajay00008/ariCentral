module.exports = async (ctx) => {
  const { user } = ctx.state

  if (!user) {
    return ctx.unauthorized('You must be logged in as an admin to access this resource.')
  }

  if (user.role.name !== 'Admin') {
    return ctx.forbidden('You do not have permission to access this resource.')
  }
}
