import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const staff = {
  state: {
    staff: [],
    staffPagination: {},
    searchQuery: ''
  },
  getters: {
    staffList: state => state.staff,
    staffPagination: state => state.staffPagination,
    searchQuery: state => state.searchQuery
  },
  mutations: {
    SET_STAFF: (state, staff) => {
        state.staff = staff
    },
    SET_STAFF_PAGINATION: (state, staffPagination) => {
        state.staffPagination = staffPagination
    },
    SET_SEARCH_QUERY: (state, query) => {
      state.searchQuery = query
    }
  },
  actions: {
    setSearchQuery ({ commit }, searchQuery) {
      commit('SET_SEARCH_QUERY', searchQuery)
    },
    createOrUpdateStaff (_, payload) {
        const { id, ...others } = payload
        const req = {
            url: id ? `/staff/${id}` : '/staff',
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
    getStaff ({ commit, state }, page) {
      const { searchQuery } = state
      if (!page) {
        page = { current: 1, pageSize: 10, total: null }
      }
      return new Promise((resolve, reject) => {
      request({
          url: '/staff',
          headers: headers,
          params: { page: page.current, limit: page.pageSize, search: searchQuery }
      })
        .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('SET_STAFF_PAGINATION', pagination)
          commit('SET_STAFF', result.staff)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getStaffDetail (_, id) {
      return request({
          url: `/staff/${id}`,
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
  export default staff
