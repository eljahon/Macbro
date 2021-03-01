import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const companies = {
    state: {
      companies: [],
      companiesPagination: {},
      searchQuery: ''
    },
    getters: {
      companiesList: state => state.companies,
      companiesPagination: state => state.companiesPagination,
      searchQuery: state => state.searchQuery
    },
    mutations: {
      SET_COMPANIES: (state, companies) => {
          state.companies = companies
      },
      SET_COMPANIES_PAGINATION: (state, companiesPagination) => {
          state.companiesPagination = companiesPagination
      },
      SET_SEARCH_QUERY: (state, query) => {
        state.searchQuery = query
      }
    },
    actions: {
      setSearchQuery ({ commit }, searchQuery) {
        commit('SET_SEARCH_QUERY', searchQuery)
      },
      updateQuantity ({ commit }, payload) {
        return new Promise((resolve, reject) => {
          console.log(payload.id)
          request({
            url: `/shop/${payload.id}/update-quantity`,
            method: 'put',
            data: payload.files
          }).then(res => {
            resolve()
            console.log(res)
          })
        })
      },
      getCompanies ({ commit, state }, page) {
        const { searchQuery } = state
        if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
        return new Promise((resolve, reject) => {
        request({
            url: '/company',
            headers: headers,
            params: { page: page.current, limit: page.pageSize, search: searchQuery }
        })
        .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('SET_COMPANIES_PAGINATION', pagination)
          commit('SET_COMPANIES', result.companies)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default companies
