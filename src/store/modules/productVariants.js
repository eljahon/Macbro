import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const productVariants = {
  state: {
    productVariants: [],
    productVariantsPagination: {},
    searchQueryProductVar: '',
    loading: false
  },
  getters: {
    productVariantsData: state => state.productVariants,
    productVariantsPagination: state => state.productVariantsPagination,
    searchQueryProductVar: state => state.searchQueryProductVar,
    loading: state => state.loading
  },
  mutations: {
    GET_PRODUCT_VARIANTS: (state, productVariants) => {
      state.productVariants = productVariants
    },
    GET_PRODUCT_VARIANTS_PAGINATION: (state, productVariantsPagination) => {
      state.productVariantsPagination = productVariantsPagination
    },
    SET_SEARCH_QUERY: (state, query) => {
      state.searchQueryProductVar = query
    },
    SET_LOADING: (state, loadingStatus) => {
      state.loading = loadingStatus
    }
  },
  actions: {
    setLoading ({ commit }, status) {
      commit('SET_LOADING', status)
    },
    setSearchQueryProductVar ({ commit }, searchQueryProductVar) {
      commit('SET_SEARCH_QUERY', searchQueryProductVar)
    },
    getProductVariants ({ commit, state }, payload = { page: null, search: true }) {
      let { page } = payload
      // if search === false all productVariants will be requested
      const { search } = payload
      const { searchQueryProductVar } = state
      if (!page) {
        page = { current: 1, pageSize: 10, total: null }
      }
      return new Promise((resolve, reject) => {
        console.log(page)
        request({
          url: `/product-variant`,
          headers: headers,
          params: {
            page: page.current,
            search: search ? (searchQueryProductVar !== '' ? searchQueryProductVar : '') : ''
          }
        })
          .then(result => {
            const pagination = { ...page }
            pagination.total = parseInt(result.count)
            console.log(pagination)
            console.log('pagination')
            commit('GET_PRODUCT_VARIANTS_PAGINATION', pagination)
            commit('GET_PRODUCT_VARIANTS', result.product_variants)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getProductVariantsAll ({ commit, state }, params) {
      return new Promise((resolve, reject) => {
        request({
          url: `/product-variant`,
          headers: headers,
          params: params
        })
          .then(result => {
            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}
export default productVariants
