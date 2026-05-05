module.exports = {
  register ({ strapi }) {},
  async bootstrap ({ strapi }) {
    const allowPublicProperties = process.env.ALLOW_PUBLIC_PROPERTIES === 'true'

    const setPermission = async (roleType, action, enabled) => {
      const role = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: roleType } })

      if (!role) return

      await strapi
        .query('plugin::users-permissions.permission')
        .updateMany({
          where: {
            role: role.id,
            action
          },
          data: { enabled }
        })
    }

    await Promise.all([
      setPermission('public', 'api::property.property.find', allowPublicProperties),
      setPermission('public', 'api::property.property.findOne', allowPublicProperties),
      setPermission('public', 'api::property.property.create', false),
      setPermission('public', 'api::property.property.update', false),
      setPermission('public', 'api::property.property.delete', false)
    ])
  }
}
