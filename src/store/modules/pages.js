import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const pages = {
    state: {
      pages: [],
      pagesPagination: {},
      searchQuery: ''
    },
    getters: {
      pagesData: state => state.pages,
      pagesPagination: state => state.pagesPagination,
      searchQuery: state => state.searchQuery
    },
    mutations: {
      GET_PAGES: (state, pages) => {
          state.pages = pages
      },
      GET_PAGES_PAGINATION: (state, pagesPagination) => {
          state.pagesPagination = pagesPagination
      },
      SET_SEARCH_QUERY: (state, query) => {
        state.searchQuery = query
      }
    },
    actions: {
      setSearchQuery ({ commit }, searchQuery) {
        commit('SET_SEARCH_QUERY', searchQuery)
      },
      getPages ({ commit, state }, payload = { page: null }) {
        let { page } = payload
        const { searchQuery } = state
        if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
        return new Promise((resolve, reject) => {
          console.log(page)
        request({
            url: `/page`,
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
          commit('GET_PAGES_PAGINATION', pagination)
          commit('GET_PAGES', result.pages)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default pages
