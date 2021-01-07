import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const productKinds = {
    state: {
      productKinds: [],
      pagination: {}
    },
    getters: {
      paginationProductKinds: state => state.pagination,
      productKinds: state => state.productKinds
    },
    mutations: {
      GET_PRODUCT_KINDS: (state, productKinds) => {
          state.productKinds = productKinds
      },
      GET_PRODUCT_KINDS_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      }
    },
    actions: {
      getProductKinds ({ commit }, page) {
        if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
        return new Promise((resolve, reject) => {
        request({
            url: '/product-kind',
            headers: headers,
            params: { page: page.current, limit: page.pageSize }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_PRODUCT_KINDS_PAGINATION', pagination)
          commit('GET_PRODUCT_KINDS', result.product_kinds)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default productKinds
