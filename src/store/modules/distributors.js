import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const distributors = {
    state: {
      distributors: [],
      pagination: {}
    },
    getters: {
      paginationDistributors: state => state.pagination,
      distributors: state => state.distributors
    },
    mutations: {
      GET_DISTRIBUTORS: (state, distributors) => {
          state.distributors = distributors
      },
      GET_DISTRIBUTORS_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      }
    },
    actions: {
      getDistributors ({ commit }, page) {
        if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
        return new Promise((resolve, reject) => {
        request({
            url: '/distributors',
            headers: headers,
            params: { page: page.current, limit: page.pageSize }
        })
          .then(result => {
              console.log('distributors')
              console.log(result.distributors)
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_DISTRIBUTORS_PAGINATION', pagination)
          commit('GET_DISTRIBUTORS', result.distributors)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default distributors
