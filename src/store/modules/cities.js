import request from '@/utils/request'

const headers = {
  'Content-Type': 'application/json'
}

const cities = {
  state: {
    cities: [],
    citiesPagination: {}
  },
  getters: {
    citiesList: state => state.cities,
    citiesPagination: state => state.citiesPagination
  },
  mutations: {
    SET_CITIES: (state, cities) => {
        state.cities = cities
    },
    SET_CITIES_PAGINATION: (state, citiesPagination) => {
        state.citiesPagination = citiesPagination
    }
  },
  actions: {
    createOrUpdateCity (_, payload) {
        const { id, ...others } = payload
        const req = {
            url: id ? `/city/${id}` : '/city',
            method: id ? 'put' : 'post'
        }
        return request({
                url: req.url,
                method: req.method,
                data: others,
                headers: headers
            })
            .then(res => {
                return res
            })
            .catch(err => {
                return err
            })
    },
    getCities ({ commit, state }, page) {
      const { searchQuery } = state
      if (!page) {
        page = { current: 1, pageSize: 10, total: null }
      }
      return new Promise((resolve, reject) => {
      request({
          url: '/city',
          headers: headers,
          params: { page: page.current, limit: page.pageSize, search: searchQuery }
      })
        .then(result => {
          const pagination = { ...page }
          pagination.total = parseInt(result.count)
          commit('SET_CITIES_PAGINATION', pagination)
          commit('SET_CITIES', result.cities)
          resolve()
        })
        .catch(error => {
          reject(error)
        })
      })
    },
    getCityDetail (_, id) {
      return request({
          url: `/city/${id}`,
          headers: headers
      })
        .then(result => {
          return result
        })
        .catch(error => {
          return error
        })
    }
  }
}
  export default cities
