import request from '@/utils/request'

const permissionsNew = {
    state: {
      permissionsList: [],
      permissionsListPagination: {},
      searchQuery: ''
    },
    getters: {
      permissionsListPagination: state => state.permissionsListPagination,
      permissionsList: state => state.permissionsList
    },
    mutations: {
      GET_PERMISSIONS_NEW: (state, permissionsList) => {
          state.permissionsList = permissionsList
      },
      GET_PERMISSIONS_NEW_PAGINATION: (state, permissionsListPagination) => {
        state.permissionsListPagination = permissionsListPagination
      }
    },
    actions: {
      getPermissionsNew ({ commit }, payload = { page: null }) {
        let { page } = payload
        if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
        return new Promise((resolve, reject) => {
        request({
            url: '/permissions',
            params: {
              page: page.current,
              limit: page.current === 1 ? 100 : 10
            }
        })
        .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_PERMISSIONS_NEW_PAGINATION', pagination)
          commit('GET_PERMISSIONS_NEW', result.permissions)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default permissionsNew
