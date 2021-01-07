import request from '@/utils/request'

const bannerPositions = {
    state: {
      bannerPositions: [],
      pagination: {},
      searchQuery: ''
    },
    getters: {
      bannerPositionsPagination: state => state.pagination,
      bannerPositions: state => state.bannerPositions,
      searchQuery: state => state.searchQuery
    },
    mutations: {
      GET_BANNER_POSITIONS: (state, bannerPositions) => {
          state.bannerPositions = bannerPositions
      },
      GET_BANNER_POSITIONS_PAGINATION: (state, pagination) => {
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
      getBannerPositions ({ commit, state }, payload = { page: null, search: true }) {
        let { page } = payload
        // if search === false all banner positions will be requested
        const { search } = payload
        const { searchQuery } = state
        if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
        return new Promise((resolve, reject) => {
        request({
            url: '/banner-position',
            params: {
              page: page.current,
              limit: page.pageSize,
              search: search ? searchQuery : ''
            }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_BANNER_POSITIONS_PAGINATION', pagination)
          commit('GET_BANNER_POSITIONS', result.positions)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default bannerPositions
