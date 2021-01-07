import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const couriers = {
    state: {
      couriers: [],
      pagination: {}
    },
    getters: {
      paginationCourier: state => state.pagination,
      couriers: state => state.couriers
    },
    mutations: {
      GET_COURIERS: (state, couriers) => {
          state.couriers = couriers
      },
      GET_COURIERS_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      }
    },
    actions: {
      getCouriers ({ commit }, page) {
        if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
        return new Promise((resolve, reject) => {
        request({
            url: '/couriers',
            headers: headers,
            params: { page: page.current, limit: page.pageSize }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_COURIERS_PAGINATION', pagination)
          commit('GET_COURIERS', result.couriers)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default couriers
