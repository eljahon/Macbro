import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const measures = {
    state: {
      measures: [],
      pagination: {}
    },
    getters: {
      paginationMeasures: state => state.pagination,
      measures: state => state.measures
    },
    mutations: {
      GET_MEASURES: (state, measures) => {
          state.measures = measures
      },
      GET_MEASURES_PAGINATION: (state, pagination) => {
        state.pagination = pagination
      }
    },
    actions: {
      getMeasures ({ commit }, page) {
        if (!page) {
          page = { current: 1, pageSize: 10, total: null }
        }
        return new Promise((resolve, reject) => {
        request({
            url: '/measure',
            headers: headers,
            params: { page: page.current, limit: page.pageSize }
        })
          .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('GET_MEASURES_PAGINATION', pagination)
          commit('GET_MEASURES', result.measures)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    }
  }
}
  export default measures
