import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}
const currency = {
    state: {
      currency: [],
      pagination: {},
      searchQuery: ''
    },
    getters: {
      paginationCurrency: state => state.pagination,
      currencyList: state => state.currency,
      searchQuery: state => state.searchQuery
    },
    mutations: {
      GET_CURRENCY: (state, currency) => {
          state.currency = currency
      },
      GET_CURRENCY_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      },
      SET_SEARCH_QUERY: (state, query) => {
        state.searchQuery = query
      }
    },
    actions: {
        getCurrencyList ({ commit, state }, payload = { page: null, lang: 'ru', search: true }) {
        let { page } = payload
        // if search === false all Currency will be requested
        const { search } = payload
        const { searchQuery } = state
        if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
        return new Promise((resolve, reject) => {
        request({
            url: `/rate`,
            headers: headers,
            params: {
              page: page.current,
              limit: page.pageSize,
              search: search ? searchQuery : '',
              currency: payload.currency
            }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_CURRENCY_PAGINATION', pagination)
          commit('GET_CURRENCY', result.rates)
          resolve(result)
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    setSearchQuery ({ commit }, searchQuery) {
      commit('SET_SEARCH_QUERY', searchQuery)
    }
  }
}
  export default currency
