import request from '@/utils/request'
const customUrl = 'v1/advantage'
const advantages = {
  state: {
    advantages: []
  },
  getters: {
    getAdvantages: state => state.advantages
  },
  mutations: {
    SET_ADNVA (state, payload) {
      state.advantages = payload
    }
  },
  actions: {
    getAdvantages ({ commit }) {
      return new Promise((resolve, reject) => {
        request({
          url: customUrl,
          method: 'get'
        })
          .then(result => {
            commit('SET_ADNVA', result.advantages)
            resolve(result.advantages)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getAdvantage ({ commit }, id) {
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
    postAdvantage ({ commit }, data) {
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
    updateAdvantage ({ commit }, data) {
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
    deleteAdvantage ({ commit }, id) {
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
export default advantages
