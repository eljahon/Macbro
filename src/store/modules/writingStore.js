import request from '@/utils/request'
// eslint-disable-next-line camelcase
const base_url = {
  writoing: '/write-off'
}
const WritingStore = {
  state: {
    allListWriting: [],
    allPaginationWriting: {}
  },
  getters: {
    allListWriting: state => state.allListWriting,
    allPaginationWriting: state => state.allPaginationWriting
  },
  mutations: {
    ALL_LIST: (state, payload) => {
      state.allListWriting = payload
    },
    ALL_PAGINATION: (state, payload) => {
      state.allPaginationWriting = payload
    }
  },
  actions: {
    writingList ({ commit }, payload) {
      return new Promise((resolve, reject) => {
        request({
          url: `${base_url.writoing}`,
          method: 'get',
          params: {
            ...payload
          }
        })
          .then(res => {
            const page = {
              current: payload.page,
              pageSize: payload.limit,
              total: null
            }
            page.total = parseInt(res.count)
            commit('ALL_LIST', res.write_off_logs)
            commit('ALL_PAGINATION', page)
            resolve(res)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}
export default WritingStore
