import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const news = {
    state: {
      news: [],
      newsPagination: {},
      searchQuery: ''
    },
    getters: {
      newsData: state => state.news,
      newsPagination: state => state.newsPagination,
      searchQuery: state => state.searchQuery
    },
    mutations: {
      GET_NEWS: (state, news) => {
          state.news = news
      },
      GET_NEWS_PAGINATION: (state, newsPagination) => {
          state.newsPagination = newsPagination
      },
      SET_SEARCH_QUERY: (state, query) => {
        state.searchQuery = query
      }
    },
    actions: {
      setSearchQuery ({ commit }, searchQuery) {
        commit('SET_SEARCH_QUERY', searchQuery)
      },
      getNews ({ commit, state }, payload = { page: null }) {
        let { page } = payload
        const { searchQuery } = state
        if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
        return new Promise((resolve, reject) => {
          console.log(page)
        request({
            url: `/new`,
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
          commit('GET_NEWS_PAGINATION', pagination)
          commit('GET_NEWS', result.news)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
//     getNewsMenu ({ commit }) {
//       const page = { current: 1, pageSize: 100, total: null }
//       request({
//           url: '/new',
//           headers: headers,
//           params: { page: page.current, limit: page.pageSize }
//       })
//         .then(result => {
//         commit('GET_NEWS_MENU', result.news)
//       })
//       .catch(error => {
//         console.log(error)
//       })
//   }
  }
}
  export default news
