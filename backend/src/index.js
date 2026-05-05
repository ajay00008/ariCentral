module.exports = {
  register ({ strapi }) {},
  async bootstrap ({ strapi }) {
    const allowPublicProperties = process.env.ALLOW_PUBLIC_PROPERTIES === 'true'

    const setPermission = async (roleType, action, enabled) => {
      const role = await strapi
        .query('plugin::users-permissions.role')
        .findOne({ where: { type: roleType } })

      if (!role) return

      const roleService = strapi.plugin('users-permissions').service('role')
      const roleWithPermissions = await roleService.findOne(role.id)
      const [typeName, controllerName, actionName] = action.split('.')

      if (
        roleWithPermissions.permissions?.[typeName]?.controllers?.[controllerName]?.[actionName] === undefined
      ) {
        return
      }

      roleWithPermissions.permissions[typeName].controllers[controllerName][actionName].enabled = enabled

      await roleService.updateRole(role.id, {
        name: role.name,
        description: role.description,
        permissions: roleWithPermissions.permissions
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
