import request from '@/utils/request'
const customUrl = 'v1/feature'
const auth = {
  state: {
    features: []
  },
  getters: {
    getFeatures: state => state.features
  },
  mutations: {
    SET_FEATURE (state, payload) {
      state.features = payload
    }
  },
  actions: {
    getFeatures ({ commit }) {
      return new Promise((resolve, reject) => {
        request({
          url: customUrl,
          method: 'get'
        })
          .then(result => {
            commit('SET_FEATURE', result.features)
            resolve(result.features)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getFeature ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: customUrl + '/' + id,
          method: 'get'
        })
          .then(result => {
            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    postFeature ({ commit }, data) {
      return new Promise((resolve, reject) => {
        request({
          url: customUrl,
          method: 'post',
          data: data
        })
          .then(result => {
            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    updateFeature ({ commit }, data) {
      return new Promise((resolve, reject) => {
        request({
          url: customUrl + '/' + data.id,
          method: 'put',
          data: data
        })
          .then(result => {
            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    deleteFeature ({ commit }, id) {
      return new Promise((resolve, reject) => {
        request({
          url: customUrl + '/' + id,
          method: 'delete'
        })
          .then(result => {
            resolve(result)
          })
          .catch(error => {
            reject(error)
          })
      })
    }
  }
}
export default auth
