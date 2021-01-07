export const PERMISSION_ENUM = {
  'add': { key: 'add', label: 'add' },
  'delete': { key: 'delete', label: 'delete' },
  'edit': { key: 'edit', label: 'edit' },
  'query': { key: 'query', label: 'query' },
  'get': { key: 'get', label: 'get' },
  'enable': { key: 'enable', label: 'enable' },
  'disable': { key: 'disable', label: 'disable' },
  'import': { key: 'import', label: 'import' },
  'export': { key: 'export', label: 'export' }
}

function plugin (Vue) {
  if (plugin.installed) {
    return
  }

  !Vue.prototype.$auth && Object.defineProperties(Vue.prototype, {
    $auth: {
      get () {
        const _this = this
        return (permissions) => {
          const [permission, action] = permissions.split('.')
          const permissionList = _this.$store.getters.roles.permissions
          return permissionList.find((val) => {
            return val.permissionId === permission
          }).actionList.findIndex((val) => {
            return val === action
          }) > -1
        }
      }
    }
  })

  !Vue.prototype.$enum && Object.defineProperties(Vue.prototype, {
    $enum: {
      get () {
        // const _this = this;
        return (val) => {
          let result = PERMISSION_ENUM
          val && val.split('.').forEach(v => {
            result = result && result[v] || null
          })
          return result
        }
      }
    }
  })
}

export default plugin
