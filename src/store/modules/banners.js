import request from '@/utils/request'

const banners = {
    state: {
      banners: [],
      pagination: {},
      searchQuery: ''
    },
    getters: {
      bannersPagination: state => state.pagination,
      banners: state => state.banners,
      searchQuery: state => state.searchQuery
    },
    mutations: {
      GET_BANNERS: (state, banners) => {
          state.banners = banners
      },
      GET_BANNERS_PAGINATION: (state, pagination) => {
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
      getBanners ({ commit, state }, payload = { page: null, search: true }) {
        let { page } = payload
        // if search === false all banner s will be requested
        const { search } = payload
        const { searchQuery } = state
        if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
        return new Promise((resolve, reject) => {
        request({
            url: '/banner',
            params: {
              page: page.current,
              limit: page.pageSize,
              search: search ? searchQuery : ''
            }
        })
        .then(result => {
            const pagination = { ...page }
            pagination.total = parseInt(result.count)
            commit('GET_BANNERS_PAGINATION', pagination)
            commit('GET_BANNERS', result.banners)
            resolve()
        })
        .catch(error => {
            reject(error)
        })
      })
    }
  }
}
  export default banners
