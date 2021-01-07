import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const promos = {
    state: {
      promos: [],
      promosPagination: {},
      searchQuery: ''
    },
    getters: {
      promosData: state => state.promos,
      promosPagination: state => state.promosPagination,
      searchQuery: state => state.searchQuery
    },
    mutations: {
      GET_PROMOS: (state, promos) => {
          state.promos = promos
      },
      GET_PROMOS_PAGINATION: (state, promosPagination) => {
          state.promosPagination = promosPagination
      },
      SET_SEARCH_QUERY: (state, query) => {
        state.searchQuery = query
      }
    },
    actions: {
      setSearchQuery ({ commit }, searchQuery) {
        commit('SET_SEARCH_QUERY', searchQuery)
      },
      getPromos ({ commit, state }, payload = { page: null }) {
        let { page } = payload
        const { searchQuery } = state
        if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
        return new Promise((resolve, reject) => {
          console.log(page)
        request({
            url: `/promo`,
            headers: headers,
            params: {
              page: page.current,
              search: searchQuery
            }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          console.log(pagination)
          console.log('pagination')
          commit('GET_PROMOS_PAGINATION', pagination)
          commit('GET_PROMOS', result.promos)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default promos
