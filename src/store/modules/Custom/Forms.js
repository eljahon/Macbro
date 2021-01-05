import request from '@/utils/request'
const customUrl = 'v1/form'
const form = {
  state: {
    forms: []
  },
  getters: {
    getForms: state => state.forms
  },
  mutations: {
    SET_FORMS (state, payload) {
      state.forms = payload
    }
  },
  actions: {
    getForms ({ commit }) {
      return new Promise((resolve, reject) => {
        request({
          url: customUrl,
          method: 'get'
        })
          .then(result => {
            commit('SET_FORMS', result.forms)
            resolve(result.forms)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    getForm ({ commit }, id) {
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

    deleteForm ({ commit }, id) {
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
    },
    updateForm ({ commit }, data) {
      return new Promise((resolve, reject) => {
        request({
          url: customUrl + '/' + data.id,
          method: 'put',
          data
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
export default form
