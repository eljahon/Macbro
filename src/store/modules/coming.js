import request from '@/utils/request'
// eslint-disable-next-line camelcase
const base_url = {
  rollcallget: '/journaling/report/list'
}
const Coming = {
  state: {
    rollCollList: [],
    rollcollPagination: {}
  },
  getters: {
    rollCollList: state => state.rollCollList,
    rollcollPagination: state => state.rollcollPagination
  },
  mutations: {
    GET_ROLL_COLL_ALL_DATA: (state, payload) => {
      state.rollCollList = payload
    },
    Pagination: (state, payload) => {
      state.rollcollPagination = payload
    }
  },
  actions: {
    getRollCollAll ({ commit }, payload) {
      const { page } = payload
      return new Promise((resolve, reject) => {
        request({
          url: `${base_url.rollcallget}`,
          method: 'get',
          params: {
            from_date: payload.from_date,
            to_date: payload.to_date,
            page: page.current,
            limit: page.pageSize
          }
        })
          .then(res => {
            resolve(res)
            page.total = res.count
            commit('Pagination', page)
            commit('GET_ROLL_COLL_ALL_DATA', res.user_journaling_report_items)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}
export default Coming
