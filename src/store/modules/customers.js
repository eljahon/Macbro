import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const customers = {
    state: {
      customers: [],
      customersPagination: {},
      searchQuery: ''
    },
    getters: {
      customersData: state => state.customers,
      customersPagination: state => state.customersPagination,
      searchQuery: state => state.searchQuery
    },
    mutations: {
      GET_CUSTOMERS: (state, customers) => {
          state.customers = customers
      },
      GET_CUSTOMERS_PAGINATION: (state, customersPagination) => {
          state.customersPagination = customersPagination
      },
      SET_SEARCH_QUERY: (state, query) => {
        state.searchQuery = query
      }
    },
    actions: {
      setSearchQuery ({ commit }, searchQuery) {
        commit('SET_SEARCH_QUERY', searchQuery)
      },
      getCustomers ({ commit, state }, payload = { page: null }) {
        let { page } = payload
        const { searchQuery } = state
        if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
        return new Promise((resolve, reject) => {
          console.log(page)
        request({
            url: `/customer`,
            headers: headers,
            params: {
              page: page.current,
              phone: searchQuery
            }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          console.log(pagination)
          console.log('pagination')
          commit('GET_CUSTOMERS_PAGINATION', pagination)
          commit('GET_CUSTOMERS', result.customers)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default customers
