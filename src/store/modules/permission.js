import { asyncRouterMap, constantRouterMap } from '@/config/router.config'

/**
 *
 * @param permission
 * @param route
 * @returns {boolean}
 */
function hasPermission (permission, route) {
  if (route.meta && route.meta.permission) {
    let flag = false
    for (let i = 0, len = permission.length; i < len; i++) {
      flag = route.meta.permission.includes(permission[i])
      if (flag) {
        return true
      }
    }
    return false
  }
  return true
}

/**
 *
 * @param roles
 * @param route
 * @returns {*}
 */
// eslint-disable-next-line
function hasRole(roles, route) {
  if (route.meta && route.meta.roles) {
    return route.meta.roles.includes(roles.id)
  } else {
    return true
  }
}

function filterAsyncRouter (routerMap, roles) {
  const accessedRouters = routerMap.filter(route => {
    if (hasPermission(roles.permissionList, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, roles)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes ({ commit }, data) {
      return new Promise(resolve => {
        const { roles } = data
        const mainRoutes = [...asyncRouterMap]
        let accessedRouters = ''
        // console.log('MASHETTA', 'sadas', mainRoutes, constantRouterMap)
        if (roles) {
          accessedRouters = filterAsyncRouter(mainRoutes, roles)
        } else {
          accessedRouters = mainRoutes
        }
        console.log('MASHETTA', accessedRouters, mainRoutes)
        if (accessedRouters.length && accessedRouters[0].children && accessedRouters[0].children.length) {
          accessedRouters[0].redirect = accessedRouters[0].children[0].path
        }
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    }
  }
}
export default permission
