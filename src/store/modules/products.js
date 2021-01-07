import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const products = {
    state: {
      products: [],
      productsPagination: {},
      productsMenu: [],
      searchQuery: '',
      loading: false
    },
    getters: {
      productsData: state => state.products,
      productsMenu: state => state.productsMenu,
      productsPagination: state => state.productsPagination,
      searchQuery: state => state.searchQuery,
      loading: state => state.loading
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
      SET_SEARCH_QUERY: (state, query) => {
        state.searchQuery = query
      },
      SET_LOADING: (state, loadingStatus) => {
        state.loading = loadingStatus
      }
    },
    actions: {
      setLoading ({ commit }, status) {
        commit('SET_LOADING', status)
      },
      setSearchQuery ({ commit }, searchQuery) {
        commit('SET_SEARCH_QUERY', searchQuery)
      },
      getProducts ({ commit, state }, payload = { page: null, search: true }) {
        let { page } = payload
        // if search === false all products will be requested
        const { search } = payload
        const { searchQuery } = state
        if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
        return new Promise((resolve, reject) => {
          console.log(page)
        request({
            url: `/product`,
            headers: headers,
            params: {
              page: page.current,
              search: search ? (searchQuery !== '' ? searchQuery : '') : ''
            }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          console.log(pagination)
          console.log('pagination')
          commit('GET_PRODUCTS_PAGINATION', pagination)
          commit('GET_PRODUCTS', result.products)
          resolve()
        })
        .catch(error => {
          reject(error)
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
  }
  }
}
  export default products
