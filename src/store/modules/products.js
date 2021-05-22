import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const products = {
    state: {
      products: [],
      productsPagination: {},
      productsMenu: [],
      searchqueryProduct: '',
      loading: false
    },
    getters: {
      productsData: state => state.products,
      productsMenu: state => state.productsMenu,
      productsPagination: state => state.productsPagination,
      searchQueryProduct: state => state.searchqueryProduct,
      loadingProducts: state => state.loading
    },
    mutations: {
      GET_PRODUCTS: (state, products) => {
          state.products = products
      },
      GET_PRODUCTS_PAGINATION: (state, productsPagination) => {
          state.productsPagination = productsPagination
      },
      GET_PRODUCTS_MENU: (state, products) => {
        state.productsMenu = products
      },
      SET_SEARCH_QUERY_PRODUCT: (state, query) => {
        state.searchqueryProduct = query
      },
      SET_LOADING: (state, loadingStatus) => {
        state.loading = loadingStatus
      }
    },
    actions: {
      setLoading ({ commit }, status) {
        commit('SET_LOADING', status)
      },
      setSearchQueryProduct ({ commit }, searchQueryProduct) {
        commit('SET_SEARCH_QUERY_PRODUCT', searchQueryProduct)
      },
      getProducts ({ commit, state }, payload) {
        const { page } = payload
        commit('SET_LOADING', true)
        return new Promise((resolve, reject) => {
          console.log(page)
          request({
              url: `/product`,
              headers: headers,
              params: {
                page: page.current,
                limit: page.pageSize,
                search: payload.search ? payload.search : ''
              }
          })
            .then(result => {
            const pagination = { ...page }
            pagination.total = parseInt(result.count)
            console.log(pagination)
            console.log(result)
            console.log('pagination')
            commit('GET_PRODUCTS_PAGINATION', pagination)
            commit('GET_PRODUCTS', result.products)
            resolve()
          })
          .catch(error => {
            reject(error)
          }).finally(() => {
            commit('SET_LOADING', false)
          })
      })
    },
    getProductsMenu ({ commit }) {
      const page = { current: 1, pageSize: 100, total: null }
      request({
          url: '/product',
          headers: headers,
          params: { page: page.current, limit: page.pageSize }
      })
        .then(result => {
        commit('GET_PRODUCTS_MENU', result.products)
      })
      .catch(error => {
        console.log(error)
      })
  },
      getProductSearch ({ commit }, payload) {
         return new Promise((resolve, reject) => {
           request({
             url: `/product`,
             method: 'get',
             headers: headers,
             params: {
               page: payload.current,
               search: payload.value,
               limit: payload.pageSize
             }
           })
             .then(res => {
               console.log('search==>>>>>', res)
             }).catch(err => {
             console.log('search==>>>', err)
           })
         })
      }

  }
}
  export default products
