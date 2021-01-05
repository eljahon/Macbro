import request from '@/utils/request'
const customUrl = 'v1/featuredstudent'
const fs = {
  state: {
    featuredStudent: []
  },
  getters: {
    getFStudent: state => state.featuredStudent
  },
  mutations: {
    SET_FSTUDENTS (state, payload) {
      state.featuredStudent = payload
    }
  },
  actions: {
    getFeatureStudents ({ commit }) {
      return new Promise((resolve, reject) => {
        request({
          url: customUrl,
          method: 'get'
        })
          .then(result => {
            commit('SET_FSTUDENTS', result.featuredstudents)
            resolve(result.featuredstudents)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getFeatureStudent ({ commit }, id) {
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
    postFeatureStudent ({ commit }, data) {
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
    updateFeatureStudent ({ commit }, data) {
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
    deleteFeatureStudent ({ commit }, id) {
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
export default fs
