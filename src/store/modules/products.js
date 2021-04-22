import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const products = {
    state: {
      products: [],
      productsPagination: {},
      productsMenu: [],
      searchQueryProduct: '',
      loading: false
    },
    getters: {
      productsData: state => state.products,
      productsMenu: state => state.productsMenu,
      productsPagination: state => state.productsPagination,
      searchQueryProduct: state => state.searchQueryProduct,
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
      SET_SEARCH_QUERY_PRODUCT: (state, query) => {
        state.searchQueryProduct = query
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
      getProducts ({ commit, state }, payload = { page: null, search: true }) {
        let { page } = payload
        // if search === false all products will be requested
        console.log('Payload', payload)
        const { search } = payload
        const { searchQueryProduct } = state
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
              search: search ? (searchQueryProduct !== '' ? searchQueryProduct : '') : ''
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
