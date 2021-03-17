import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const roles = {
  state: {
    rolesList: [],
    rolesPagination: {},
    searchQuery: ''
  },
  getters: {
    rolesList: state => state.rolesList,
    rolesPagination: state => state.rolesPagination,
    searchQuery: state => state.searchQuery
  },
  mutations: {
    SET_ROLES: (state, rolesList) => {
        state.rolesList = rolesList
    },
    SET_ROLES_PAGINATION: (state, rolesPagination) => {
        state.rolesPagination = rolesPagination
    },
    SET_SEARCH_QUERY: (state, query) => {
      state.searchQuery = query
    }
  },
  actions: {
    setSearchQuery ({ commit }, searchQuery) {
      commit('SET_SEARCH_QUERY', searchQuery)
    },
    createOrUpdateRole (_, payload) {
        const { id, ...others } = payload
        const req = {
            url: id ? `/role/${id}` : '/role',
            method: id ? 'put' : 'post'
        }
        return request({
                url: req.url,
                method: req.method,
                data: others,
                headers: headers
            })
            .then(res => {
                return res
            })
            .catch(err => {
                return err
            })
    },
    getRoles ({ commit, state }, page) {
      const { searchQuery } = state
      if (!page) {
        page = { current: 1, pageSize: 10, total: null }
      }
      return new Promise((resolve, reject) => {
      request({
          url: '/role',
          headers: headers,
          params: { page: page.current, limit: page.pageSize, search: searchQuery }
      })
        .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('SET_ROLES_PAGINATION', pagination)
          commit('SET_ROLES', result.roles)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getRoleDetail (_, id) {
      return request({
          url: `/role/${id}`,
          headers: headers
      })
        .then(result => {
          return result
        })
        .catch(error => {
          return error
        })
    }
  }
}
  export default roles
