import request from '@/utils/request'
// eslint-disable-next-line camelcase
const base_Url = {
  parishes: '/history/prixod'
}
const Parishes = {
  state: {
    parishesList: [],
    parishesPagination: {}
  },
  getters: {
    parishesPagination: state => state.parishesPagination,
    parishesList: state => state.parishesList
  },
  mutations: {
    PARISHES_LIST: (state, payload) => {
      state.parishesList = payload
    },
    PARISHES_PAGINATION: (state, payload) => {
      state.parishesPagination = payload
    }
  },
  actions: {
    getAllListParishes ({ commit }, payload) {
      const { page } = payload
      return new Promise((resolve, reject) => {
        request({
          url: `${base_Url.parishes}`,
          method: 'get',
          params: {
            limit: page.pageSize,
            page: page.current,
            from_date: payload.from_date,
            to_date: payload.to_date
          }
        })
          .then(res => {
            resolve(res)
            page.total = parseInt(res.count)
            console.log('===========', res.parties)
            commit('PARISHES_LIST', res.parties)
            commit('PARISHES_PAGINATION', page)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
    }
}
export default Parishes
