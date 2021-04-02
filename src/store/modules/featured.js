import request from '@/utils/request'

const featuredProducts = {
  state: {
    featuredProducts: [],
    pagination: {},
    searchQuery: ''
  },
  getters: {
    featuredProductsPagination: state => state.pagination,
    featuredProducts: state => state.featuredProducts,
    searchQuery: state => state.searchQuery
  },
  mutations: {
    GET_FEATURED_PRODUCTS: (state, featuredProducts) => {
      state.featuredProducts = featuredProducts
    },
    GET_FEATURED_PRODUCTS_PAGINATION: (state, pagination) => {
      state.pagination = pagination
    },
    SET_SEARCH_QUERY: (state, query) => {
      state.searchQuery = query
    }
  },
  actions: {
    setSearchQuery ({ commit }, searchQuery) {
      commit('SET_SEARCH_QUERY', searchQuery)
    },
    getFeaturedProducts ({ commit, state }, payload = { page: null, search: true }) {
      let { page } = payload
      // if search === false all widget positions will be requested
      const { search } = payload
      const { searchQuery } = state
      if (!page) {
        page = { current: 1, pageSize: 10, total: null }
      }
      const params = {
        page: page.current,
        limit: page.pageSize,
        search: search ? (searchQuery !== '' ? searchQuery : '') : ''
      }
      return new Promise((resolve, reject) => {
        request({
          url: '/featured-list',
          params
        })
          .then(result => {
            const pagination = { ...page }
            pagination.total = parseInt(result.count)
            commit('GET_FEATURED_PRODUCTS_PAGINATION', pagination)
            commit('GET_FEATURED_PRODUCTS', result.featured_lists)
            resolve()
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}
export default featuredProducts
