import request from '@/utils/request'
const customUrl = 'v1/client'
const client = {
  state: {
    clients: []
  },
  getters: {
    getClients: state => state.clients
  },
  mutations: {
    SET_CLIENT (state, payload) {
      state.clients = payload
    }
  },
  actions: {
    getClients ({ commit }) {
      return new Promise((resolve, reject) => {
        request({
          url: customUrl,
          method: 'get'
        })
          .then(result => {
            commit('SET_CLIENT', result.clients)
            resolve(result.clients)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getClient ({ commit }, id) {
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
    postClient ({ commit }, data) {
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
    updateClient ({ commit }, data) {
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
    deleteClient ({ commit }, id) {
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
export default client
